import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';
import { socket } from './socket.js';

export function useHomeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/home')
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const onUpdated = (doc) => setData(doc);
    socket.on('home:updated', onUpdated);
    return () => {
      cancelled = true;
      socket.off('home:updated', onUpdated);
    };
  }, []);

  const save = useCallback(async (payload) => {
    const { data: fresh } = await api.put('/home', payload);
    return fresh;
  }, []);

  return { data, loading, save };
}
