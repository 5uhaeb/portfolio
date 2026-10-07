const { test, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Home = require('../models/Home');
const createApp = require('../app');

process.env.JWT_SECRET = 'test-only-secret-never-a-production-credential';
process.env.CORS_ORIGINS = 'http://localhost:5173';
const id = '507f1f77bcf86cd799439011';
const secondId = '507f1f77bcf86cd799439012';
let base, server, user;
const events = [];
function token(extra = {}) {
  return jwt.sign({ id, role: 'admin', version: user.tokenVersion, ...extra }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
function request(path, method = 'GET', body, bearer) {
  return fetch(`${base}${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
function mockUser(t) {
  t.mock.method(User, 'findById', () => ({
    select() { return this; }, lean: async () => user,
    then: (resolve, reject) => Promise.resolve(user).then(resolve, reject),
  }));
}
before(async () => {
  user = { _id: id, username: 'admin', role: 'admin', tokenVersion: 0,
    passwordHash: await bcrypt.hash('original-test-password', 4), save: async () => {} };
  const app = createApp();
  app.set('io', { emit: (event, data) => events.push({ event, data }) });
  server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
});
afterEach(() => { events.length = 0; });

test('all content writes require a bearer token', async () => {
  for (const resource of ['skills', 'projects', 'experience', 'certificates']) {
    for (const [method, path] of [['POST', ''], ['PUT', `/${id}`], ['DELETE', `/${id}`], ['PUT', '/reorder']]) {
      assert.equal((await request(`/api/${resource}${path}`, method, {})).status, 401);
    }
  }
  assert.equal((await request('/api/home', 'PUT', {})).status, 401);
});

test('live database role controls admin access, not a role in the JWT', async t => {
  mockUser(t);
  const signed = token();
  const previous = user.role; user.role = 'viewer';
  try { assert.equal((await request('/api/skills', 'POST', { name: 'Java' }, signed)).status, 403); }
  finally { user.role = previous; }
});

test('tampered and expired JWTs are rejected before storage', async () => {
  const signed = token();
  assert.equal((await request('/api/auth/me', 'GET', undefined, signed.slice(0, -6) + 'forged')).status, 401);
  const expired = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: -1 });
  assert.equal((await request('/api/auth/me', 'GET', undefined, expired)).status, 401);
});

test('login rejects query operators and malformed password types', async t => {
  t.mock.method(User, 'findOne', () => assert.fail('malformed login must not query MongoDB'));
  assert.equal((await request('/api/auth/login', 'POST', { username: { $ne: null }, password: 'abc' })).status, 400);
  assert.equal((await request('/api/auth/login', 'POST', { username: 'admin', password: ['abc'] })).status, 400);
});

test('login verifies bcrypt and never returns its password hash', async t => {
  t.mock.method(User, 'findOne', async () => user);
  mockUser(t);
  const response = await request('/api/auth/login', 'POST', { username: 'admin', password: 'original-test-password' });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.user.passwordHash, undefined);
  assert.equal(jwt.verify(data.token, process.env.JWT_SECRET).id, id);
  const me = await request('/api/auth/me', 'GET', undefined, data.token);
  assert.equal(me.status, 200);
  assert.equal((await me.json()).user.passwordHash, undefined);
});

test('changing a password invalidates the previously signed token', async t => {
  mockUser(t);
  const signed = token();
  const response = await request('/api/auth/change-password', 'POST', {
    currentPassword: 'original-test-password', newPassword: 'replacement-test-password'
  }, signed);
  assert.equal(response.status, 200);
  assert.equal(await bcrypt.compare('replacement-test-password', user.passwordHash), true);
  assert.equal((await request('/api/auth/me', 'GET', undefined, signed)).status, 401);
});

test('public home read uses defaults without creating documents', async t => {
  t.mock.method(Home, 'findOne', async () => null);
  t.mock.method(Home, 'create', () => assert.fail('public read must not write'));
  const response = await request('/api/home');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).slug, 'home');
});

test('admin updates reject nested operators and keep protected metadata out', async t => {
  mockUser(t);
  t.mock.method(Home, 'findOneAndUpdate', async (_filter, update, options) => {
    assert.deepEqual(update, { $set: { name: 'New name' } });
    assert.equal(options.runValidators, true);
    return { name: 'New name' };
  });
  const updated = await request('/api/home', 'PUT', { name: 'New name', slug: 'other', _id: secondId, createdAt: 'yesterday', arbitrary: 'discard' }, token());
  assert.equal(updated.status, 200);
  assert.equal(events[0].event, 'home:updated');
  const denied = await request('/api/home', 'PUT', { socials: { github: { $ne: null } } }, token());
  assert.equal(denied.status, 400);
});

test('reorder rejects duplicate and operator IDs before storage writes', async t => {
  mockUser(t);
  t.mock.method(Skill, 'countDocuments', () => assert.fail('malformed IDs must not query MongoDB'));
  for (const ids of [[id, id], [{ $ne: null }], ['invalid-id']]) {
    assert.equal((await request('/api/skills/reorder', 'PUT', { ids }, token())).status, 400);
  }
});

test('valid reorder writes one batch and broadcasts updated public content', async t => {
  mockUser(t);
  t.mock.method(Skill, 'countDocuments', async () => 2);
  t.mock.method(Skill, 'bulkWrite', async operations => {
    assert.equal(operations.length, 2);
    assert.deepEqual(operations[1].updateOne, { filter: { _id: id }, update: { $set: { order: 1 } } });
  });
  t.mock.method(Skill, 'find', () => ({ sort: async () => [{ _id: secondId, order: 0 }, { _id: id, order: 1 }] }));
  assert.equal((await request('/api/skills/reorder', 'PUT', { ids: [secondId, id] }, token())).status, 200);
  assert.equal(events[0].event, 'skills:reordered');
});

test('untrusted origins and invalid JSON receive safe HTTP errors', async () => {
  const denied = await fetch(`${base}/api/health`, { headers: { Origin: 'https://untrusted.invalid' } });
  assert.equal(denied.status, 403);
  const badJson = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' });
  assert.equal(badJson.status, 400);
  assert.deepEqual(await badJson.json(), { error: 'Invalid JSON' });
});

test('repeated failed login attempts are throttled', async t => {
  t.mock.method(User, 'findOne', async () => null);
  let status;
  for (let count = 0; count < 11; count++) status = (await request('/api/auth/login', 'POST', { username: 'absent', password: 'bad-password' })).status;
  assert.equal(status, 429);
});
