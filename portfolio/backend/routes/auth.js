const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login — returns a JWT on success
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me — validates token and returns user
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/change-password — admin changes own password
router.post('/change-password', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ ok: true });
  } catch (err) {
    console.error('[auth/change-password]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
