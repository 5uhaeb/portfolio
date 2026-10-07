const express = require('express');
const { editableFields } = require('./content');
const Home = require('../models/Home');
const { requireAuth, requireAdmin } = require('../middleware/auth');

module.exports = function createHomeRouter() {
  const router = express.Router();

  // Public reads do not mutate storage; missing content returns schema defaults.
  router.get('/', async (_req, res) => {
    try {
      let doc = await Home.findOne({ slug: 'home' });
      if (!doc) doc = new Home({ slug: 'home' });
      res.json(doc);
    } catch (err) {
      console.error('[home/get]');
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Admin — update the singleton
  router.put('/', requireAuth, requireAdmin, async (req, res) => {
    try {
      const update = editableFields(Home, req.body);
      const doc = await Home.findOneAndUpdate(
        { slug: 'home' },
        { $set: update },
        { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
      );

      req.app.get('io')?.emit('home:updated', doc);
      res.json(doc);
    } catch (err) {
      console.error('[home/put]');
      res.status(400).json({ error: 'Invalid content or storage request failed' });
    }
  });

  return router;
};
