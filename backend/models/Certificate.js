const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, default: '' },
    issueDate: { type: String, default: '' }, // e.g. "Mar 2024"
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    kind: { type: String, enum: ['certificate', 'achievement'], default: 'certificate' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CertificateSchema.index({ order: 1 });

module.exports = mongoose.model('Certificate', CertificateSchema);
