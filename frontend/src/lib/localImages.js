import { useEffect, useState } from 'react';

const PREFIX = 'portfolio_image:';
const EVENT = 'portfolio-local-image';

export function getLocalImage(key) {
  if (!key) return '';
  try { return localStorage.getItem(`${PREFIX}${key}`) || ''; } catch { return ''; }
}

export function setLocalImage(key, value) {
  if (!key) return;
  try {
    if (value) localStorage.setItem(`${PREFIX}${key}`, value);
    else localStorage.removeItem(`${PREFIX}${key}`);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key, value } }));
  } catch {
    throw new Error('This image is too large for browser storage. Choose a smaller file.');
  }
}

export function useLocalImage(key) {
  const [value, setValue] = useState(() => getLocalImage(key));
  useEffect(() => {
    setValue(getLocalImage(key));
    const update = (event) => {
      if (event.detail?.key === key) setValue(event.detail.value || '');
    };
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, [key]);
  return value;
}

export function imageFileToDataUrl(file, { maxWidth = 1000, maxHeight = 750, quality = .82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) return reject(new Error('Choose an image file.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Could not decode the image.'));
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
