import { io } from 'socket.io-client';
import { API_URL } from '../api/client.js';

// Autoconnects, reconnects on drop. One socket shared across all pages/hooks.
export const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
});
