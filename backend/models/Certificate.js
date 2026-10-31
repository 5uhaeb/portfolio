const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, default: '' },
    issueDate: { type: String, default: '' }, // e.g. "Mar 2024"
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '', validate: { validator: value => !value || /^https?:\/\//i.test(value), message: 'Use a public HTTP or HTTPS image URL' } },
    description: { type: String, default: '' },
    kind: { type: String, enum: ['certificate', 'achievement'], default: 'certificate' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CertificateSchema.index({ order: 1 });

module.exports = mongoose.model('Certificate', CertificateSchema);
