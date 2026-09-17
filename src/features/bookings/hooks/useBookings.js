import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchBookings } from '../api.js';

const POLL_MS = 60_000;

export function useBookings() {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [items, setItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const inFlight = useRef(false);

  const load = useCallback(async (silent = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (!silent) setStatus('loading');
    try {
      const data = await fetchBookings();
      setItems(data);
      setStatus('ready');
      setLastUpdated(new Date());
    } catch {
      setStatus((s) => (s === 'ready' ? 'ready' : 'error'));
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load(true);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  const applyLocalUpdate = useCallback((id, patch) => {
    setItems((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  return { status, items, lastUpdated, reload: () => load(false), applyLocalUpdate };
}
