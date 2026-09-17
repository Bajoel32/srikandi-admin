import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

const AuthContext = createContext(null);

// status: 'checking' | 'signedOut' | 'authed'
export function AuthProvider({ children }) {
  const [status, setStatus] = useState('checking');
  const [admin, setAdmin] = useState(null);
  const [notAdminMessage, setNotAdminMessage] = useState('');

  const checkAdmin = useCallback(async (session) => {
    if (!session) {
      setAdmin(null);
      setStatus('signedOut');
      return;
    }
    const email = session.user.email?.toLowerCase() ?? '';
    const { data } = await supabase
      .from('admin_users')
      .select('email, nama, aktif')
      .eq('email', email)
      .maybeSingle();

    if (!data || !data.aktif) {
      setNotAdminMessage('Akun ini tidak terdaftar sebagai admin.');
      await supabase.auth.signOut();
      setAdmin(null);
      setStatus('signedOut');
      return;
    }
    setAdmin(data);
    setStatus('authed');
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => checkAdmin(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdmin(session);
    });
    return () => sub.subscription.unsubscribe();
  }, [checkAdmin]);

  const requestLoginLink = useCallback(async (email) => {
    setNotAdminMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setStatus('signedOut');
  }, []);

  return (
    <AuthContext.Provider value={{ status, admin, notAdminMessage, requestLoginLink, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
