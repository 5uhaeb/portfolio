function isAllowedOrigin(origin) {
  const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173')
    .split(',').map(value => value.trim()).filter(Boolean);
  return !origin || origins.includes(origin);
}
module.exports = { isAllowedOrigin };
