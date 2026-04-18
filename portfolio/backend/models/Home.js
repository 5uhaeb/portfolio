const mongoose = require('mongoose');

// Home is a singleton — exactly one document. We key it with slug: 'home'.
const HomeSchema = new mongoose.Schema(
  {
    slug: { type: String, default: 'home', unique: true },
    name: { type: String, default: 'Your Name' },
    role: { type: String, default: 'What you do' },
    tagline: { type: String, default: 'A short line about yourself.' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Home', HomeSchema);
