const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/**
 * Builds a CRUD router for a Mongoose Model that has an `order` field.
 * Emits socket events on every mutation so connected clients update live.
 *
 * Endpoints:
 *   GET    /            list, sorted by order asc (public)
 *   POST   /            create, appended at end of order  (admin)
 *   PUT    /:id         update a single item              (admin)
 *   DELETE /:id         delete a single item              (admin)
 *   PUT    /reorder     reorder by list of ids            (admin)
 */
function createCrudRouter({ Model, resource, io }) {
  const router = express.Router();
  const event = (type) => `${resource}:${type}`;

  router.get('/', async (_req, res) => {
    try {
      const items = await Model.find({}).sort({ order: 1, createdAt: 1 });
      res.json(items);
    } catch (err) {
      console.error(`[${resource}/list]`, err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
      const last = await Model.findOne({}).sort({ order: -1 }).lean();
      const nextOrder = last ? (last.order ?? 0) + 1 : 0;
      const payload = { ...req.body, order: nextOrder };
      delete payload._id;
      const doc = await Model.create(payload);
      io.emit(event('created'), doc);
      res.status(201).json(doc);
    } catch (err) {
      console.error(`[${resource}/create]`, err);
      res.status(400).json({ error: err.message || 'Bad request' });
    }
  });

  router.put('/reorder', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { ids } = req.body || {};
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'ids must be an array' });
      }
      // Write new order for each id in the supplied sequence
      await Promise.all(
        ids.map((id, i) => Model.updateOne({ _id: id }, { $set: { order: i } }))
      );
      const items = await Model.find({}).sort({ order: 1, createdAt: 1 });
      io.emit(event('reordered'), items);
      res.json(items);
    } catch (err) {
      console.error(`[${resource}/reorder]`, err);
      res.status(400).json({ error: err.message || 'Bad request' });
    }
  });

  router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const update = { ...req.body };
      delete update._id;
      delete update.createdAt;
      delete update.updatedAt;
      const doc = await Model.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      io.emit(event('updated'), doc);
      res.json(doc);
    } catch (err) {
      console.error(`[${resource}/update]`, err);
      res.status(400).json({ error: err.message || 'Bad request' });
    }
  });

  router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Not found' });
      io.emit(event('deleted'), { _id: doc._id });
      res.json({ ok: true, _id: doc._id });
    } catch (err) {
      console.error(`[${resource}/delete]`, err);
      res.status(400).json({ error: err.message || 'Bad request' });
    }
  });

  return router;
}

module.exports = createCrudRouter;
