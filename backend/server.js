require('dotenv').config({ path: require('node:path').join(__dirname, '.env') });
const http = require('node:http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
const User = require('./models/User');
const createApp = require('./app');
const { isAllowedOrigin } = require('./middleware/origins');
const { MONGODB_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD, PORT = 4000 } = process.env;

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  allowRequest: (req, callback) => callback(null, isAllowedOrigin(req.headers.origin)),
  cors: { origin: (origin, callback) => callback(null, isAllowedOrigin(origin)) },
});
app.set('io', io);

// Bootstrap exactly one admin user from env on first boot
async function ensureAdminUser() {
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log(`[bootstrap] admin user "${existing.username}" already exists — env creds ignored`);
    return;
  }
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD for first-boot admin creation');
  }
  if (ADMIN_PASSWORD.length < 12 || Buffer.byteLength(ADMIN_PASSWORD) > 72) {
    throw new Error('Initial admin password must have 12+ characters and at most 72 UTF-8 bytes');
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({ username: ADMIN_USERNAME, passwordHash, role: 'admin' });
  console.log(`[bootstrap] created admin user "${ADMIN_USERNAME}"`);
}

async function main() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is required');
  if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');
  if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS?.trim()) {
    throw new Error('Set CORS_ORIGINS to the production frontend origin');
  }
  await mongoose.connect(MONGODB_URI);
  await ensureAdminUser();
  server.listen(PORT, () => console.log(`[http] listening on :${PORT}`));
}

main().catch(() => {
  console.error('Startup failed: check MongoDB access, JWT_SECRET, origins and bootstrap credentials.');
  process.exit(1);
});
