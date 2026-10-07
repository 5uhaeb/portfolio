const express = require('express');
const { editableFields } = require('./content');
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
function createCrudRouter({ Model, resource }) {
  const router = express.Router();
  const event = (type) => `${resource}:${type}`;

  router.get('/', async (_req, res) => {
    try {
      const items = await Model.find({}).sort({ order: 1, createdAt: 1 });
      res.json(items);
    } catch (err) {
      console.error(`[${resource}/list]`);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
      const last = await Model.findOne({}).sort({ order: -1 }).lean();
      const nextOrder = last ? (last.order ?? 0) + 1 : 0;
      const payload = { ...editableFields(Model, req.body), order: nextOrder };
      const doc = await Model.create(payload);
      req.app.get('io')?.emit(event('created'), doc);
      res.status(201).json(doc);
    } catch (err) {
      console.error(`[${resource}/create]`);
      res.status(400).json({ error: 'Invalid content or storage request failed' });
    }
  });

  router.put('/reorder', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { ids } = req.body || {};
      if (!Array.isArray(ids) || ids.length > 500 || new Set(ids).size !== ids.length ||
          ids.some(id => typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id))) {
        return res.status(400).json({ error: 'ids must be unique document IDs (up to 500)' });
      }
      if (await Model.countDocuments({ _id: { $in: ids } }) !== ids.length) {
        return res.status(400).json({ error: 'Unknown document ID' });
      }
      if (ids.length) await Model.bulkWrite(ids.map((id, order) => ({
        updateOne: { filter: { _id: id }, update: { $set: { order } } },
      })));
      const items = await Model.find({}).sort({ order: 1, createdAt: 1 });
      req.app.get('io')?.emit(event('reordered'), items);
      res.json(items);
    } catch (err) {
      console.error(`[${resource}/reorder]`);
      res.status(400).json({ error: 'Invalid content or storage request failed' });
    }
  });

  router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const update = editableFields(Model, req.body);
      const doc = await Model.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      req.app.get('io')?.emit(event('updated'), doc);
      res.json(doc);
    } catch (err) {
      console.error(`[${resource}/update]`);
      res.status(400).json({ error: 'Invalid content or storage request failed' });
    }
  });

  router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Not found' });
      req.app.get('io')?.emit(event('deleted'), { _id: doc._id });
      res.json({ ok: true, _id: doc._id });
    } catch (err) {
      console.error(`[${resource}/delete]`);
      res.status(400).json({ error: 'Invalid content or storage request failed' });
    }
  });

  return router;
}

module.exports = createCrudRouter;
