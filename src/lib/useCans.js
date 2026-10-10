import { useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from './auth';

// Refetches on login/logout so owner-only UI stays in sync.
export function useCans() {
  const { user, ready } = useAuth();
  const [cans, setCans] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    api.cans()
      .then((data) => alive && setCans(data))
      .catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [user?.id, ready]);

  return { cans, error };
}
