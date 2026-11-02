export function webUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

// Google Drive sharing pages are HTML; use the public image delivery endpoint.
export function profileImageUrl(value) {
  const safe = webUrl(value);
  if (!safe) return '';
  const url = new URL(safe);
  if (url.hostname === 'drive.google.com') {
    const fileId = url.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/)?.[1] || url.searchParams.get('id');
    if (fileId && /^[a-zA-Z0-9_-]+$/.test(fileId)) return `https://lh3.googleusercontent.com/d/${fileId}=w960`;
  }
  return safe;
}
