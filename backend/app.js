const express = require('express');
const cors = require('cors');
const { isAllowedOrigin } = require('./middleware/origins');
const authRoutes = require('./routes/auth');
const createHomeRouter = require('./routes/home');
const createCrudRouter = require('./routes/crud');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Certificate = require('./models/Certificate');

module.exports = function createApp() {
  const app = express();
  // One reverse proxy on Render; direct local connections use their remote address.
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    if (!isAllowedOrigin(req.headers.origin)) return res.status(403).json({ error: 'Origin not allowed' });
    next();
  });
  app.use(cors({ origin: (origin, callback) => callback(null, isAllowedOrigin(origin)) }));
  app.use(express.json({ limit: '2mb' }));
  app.get('/', (_req, res) => res.json({ ok: true, service: 'portfolio-backend' }));
  app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
  app.use('/api/auth', authRoutes);
  app.use('/api/home', createHomeRouter());
  for (const [resource, Model] of Object.entries({ skills: Skill, projects: Project, experience: Experience, certificates: Certificate })) {
    app.use(`/api/${resource}`, createCrudRouter({ Model, resource }));
  }
  app.use((err, _req, res, _next) => {
    const status = err.type === 'entity.too.large' ? 413 : err.type === 'entity.parse.failed' ? 400 : 500;
    res.status(status).json({ error: status === 413 ? 'Request too large' : status === 400 ? 'Invalid JSON' : 'Server error' });
  });
  return app;
};
