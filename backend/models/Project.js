const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    tech: [{ type: String }],
    liveUrl: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    year: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ order: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
