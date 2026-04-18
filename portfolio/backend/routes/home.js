const express = require('express');
const Home = require('../models/Home');
const { requireAuth, requireAdmin } = require('../middleware/auth');

module.exports = function createHomeRouter(io) {
  const router = express.Router();

  // Public — always returns a doc (creates one if missing)
  router.get('/', async (_req, res) => {
    try {
      let doc = await Home.findOne({ slug: 'home' });
      if (!doc) doc = await Home.create({ slug: 'home' });
      res.json(doc);
    } catch (err) {
      console.error('[home/get]', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Admin — update the singleton
  router.put('/', requireAuth, requireAdmin, async (req, res) => {
    try {
      const update = { ...req.body };
      delete update._id;
      delete update.slug;
      delete update.createdAt;
      delete update.updatedAt;

      const doc = await Home.findOneAndUpdate(
        { slug: 'home' },
        { $set: update },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      io.emit('home:updated', doc);
      res.json(doc);
    } catch (err) {
      console.error('[home/put]', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
