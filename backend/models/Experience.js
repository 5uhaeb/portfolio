const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' }, // "Jan 2023" — keep as string for flexible formats
    endDate: { type: String, default: '' },   // "Present" is fine
    description: { type: String, default: '' },
    highlights: [{ type: String }],           // bullet points
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ExperienceSchema.index({ order: 1 });

module.exports = mongoose.model('Experience', ExperienceSchema);
