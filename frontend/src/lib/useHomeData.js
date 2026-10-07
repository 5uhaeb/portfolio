import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';
import { socket } from './socket.js';

export function useHomeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => api
      .get('/home')
      .then((res) => {
        if (!cancelled) { setData(res.data); setError(null); }
      })
      .catch(() => { if (!cancelled) setError('Could not load profile. Please try again.'); })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    load();
    socket.on('connect', load);
    const onUpdated = (doc) => setData(doc);
    socket.on('home:updated', onUpdated);
    return () => {
      cancelled = true;
      socket.off('home:updated', onUpdated);
      socket.off('connect', load);
    };
  }, []);

  const save = useCallback(async (payload) => {
    const { data: fresh } = await api.put('/home', payload);
    setData(fresh);
    return fresh;
  }, []);

  return { data, loading, error, save };
}
