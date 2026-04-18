import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { socket } from './socket.js';

/**
 * Drives a section's data layer end-to-end.
 *
 *   resource:  "skills" | "projects" | "experience" | "certificates"
 *
 * Returns: { items, loading, error, create, update, remove, reorder }
 *
 * Every mutation hits the backend, which broadcasts a socket event that this hook
 * (and every other connected client) handles to update local state — so the admin's
 * save shows up in every visitor's browser within a beat.
 */
export function useRealtimeList(resource) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/${resource}`)
      .then((res) => {
        if (!cancelled) {
          setItems(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resource]);

  // Socket subscriptions
  useEffect(() => {
    const onCreated = (doc) => setItems((prev) => [...prev, doc]);
    const onUpdated = (doc) =>
      setItems((prev) => prev.map((it) => (it._id === doc._id ? doc : it)));
    const onDeleted = ({ _id }) =>
      setItems((prev) => prev.filter((it) => it._id !== _id));
    const onReordered = (fresh) => setItems(fresh);

    socket.on(`${resource}:created`, onCreated);
    socket.on(`${resource}:updated`, onUpdated);
    socket.on(`${resource}:deleted`, onDeleted);
    socket.on(`${resource}:reordered`, onReordered);

    return () => {
      socket.off(`${resource}:created`, onCreated);
      socket.off(`${resource}:updated`, onUpdated);
      socket.off(`${resource}:deleted`, onDeleted);
      socket.off(`${resource}:reordered`, onReordered);
    };
  }, [resource]);

  const create = useCallback(
    async (payload) => {
      const { data } = await api.post(`/${resource}`, payload);
      // Don't bother updating local state — socket event will arrive and do it
      return data;
    },
    [resource]
  );

  const update = useCallback(
    async (id, payload) => {
      const { data } = await api.put(`/${resource}/${id}`, payload);
      return data;
    },
    [resource]
  );

  const remove = useCallback(
    async (id) => {
      await api.delete(`/${resource}/${id}`);
    },
    [resource]
  );

  const reorder = useCallback(
    async (ids) => {
      // Optimistic: reorder locally so dragging feels instant
      setItems((prev) => {
        const byId = new Map(prev.map((it) => [it._id, it]));
        return ids.map((id) => byId.get(id)).filter(Boolean);
      });
      await api.put(`/${resource}/reorder`, { ids });
    },
    [resource]
  );

  return { items, loading, error, create, update, remove, reorder };
}
