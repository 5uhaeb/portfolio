const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'General' }, // e.g. "Frontend", "Backend", "Tools"
    level: { type: Number, min: 0, max: 100, default: 70 }, // proficiency %
    years: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ order: 1 });

module.exports = mongoose.model('Skill', SkillSchema);
