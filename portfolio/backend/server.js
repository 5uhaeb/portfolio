require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Server: IOServer } = require('socket.io');

const User = require('./models/User');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Certificate = require('./models/Certificate');

const authRoutes = require('./routes/auth');
const createHomeRouter = require('./routes/home');
const createCrudRouter = require('./routes/crud');

const PORT = process.env.PORT || 4000;
const {
  MONGODB_URI,
  JWT_SECRET,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  CORS_ORIGINS = '',
} = process.env;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET in environment');
  process.exit(1);
}

// Allowed origins for both HTTP and websocket. Empty string means "allow all" — handy for
// local dev but you should set CORS_ORIGINS in production.
const allowedOrigins = CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));

// Health check — Render pings this to know the service is up
app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'portfolio-backend' });
});
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // Connection logging only — all broadcasts are driven by route handlers
  console.log(`[io] client connected ${socket.id}`);
  socket.on('disconnect', () => console.log(`[io] client disconnected ${socket.id}`));
});

// Wire routes
app.use('/api/auth', authRoutes);
app.use('/api/home', createHomeRouter(io));
app.use('/api/skills', createCrudRouter({ Model: Skill, resource: 'skills', io }));
app.use('/api/projects', createCrudRouter({ Model: Project, resource: 'projects', io }));
app.use('/api/experience', createCrudRouter({ Model: Experience, resource: 'experience', io }));
app.use('/api/certificates', createCrudRouter({ Model: Certificate, resource: 'certificates', io }));

// Bootstrap exactly one admin user from env on first boot
async function ensureAdminUser() {
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log(`[bootstrap] admin user "${existing.username}" already exists — env creds ignored`);
    return;
  }
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn('[bootstrap] No admin exists AND ADMIN_USERNAME/ADMIN_PASSWORD are not set — nobody can log in!');
    return;
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({ username: ADMIN_USERNAME, passwordHash, role: 'admin' });
  console.log(`[bootstrap] created admin user "${ADMIN_USERNAME}"`);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('[db] connected');
  await ensureAdminUser();

  server.listen(PORT, () => {
    console.log(`[http] listening on :${PORT}`);
  });
}

main().catch((err) => {
  console.error('Fatal startup error', err);
  process.exit(1);
});
