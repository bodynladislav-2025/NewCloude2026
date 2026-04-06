import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ALLOWED_EMAILS = (import.meta.env.VITE_ALLOWED_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function useAuth() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [user, setUser]       = useState(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      setAllowed(isAllowed(u));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      setAllowed(isAllowed(u));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function isAllowed(u) {
    if (!u) return false;
    if (ALLOWED_EMAILS.length === 0) return true; // no whitelist = allow all
    return ALLOWED_EMAILS.includes((u.email || '').toLowerCase());
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const loading = session === undefined;

  return { session, user, allowed, loading, signInWithGoogle, signOut };
}
