const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the Authorization: Bearer <token> header. Attaches req.user on success.
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof payload.id !== 'string' || !/^[a-f\d]{24}$/i.test(payload.id)) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    const user = await User.findById(payload.id).select('username role tokenVersion').lean();
    if (!user || (payload.version ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = { id: String(user._id), username: user.username, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
