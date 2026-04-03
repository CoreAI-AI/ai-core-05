import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let mounted = true;

    // 1. Restore session from storage FIRST
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        setShowAuth(false);
      } else {
        setUser(null);
        setShowAuth(true);
      }
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setUser(null);
      setShowAuth(true);
      setLoading(false);
    });

    // 2. Listen for subsequent auth changes (sign in/out) - NO async
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);

        if (_event === 'SIGNED_IN') {
          setShowAuth(false);
          setLoading(false);
        } else if (_event === 'SIGNED_OUT') {
          setShowAuth(true);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowAuth(true);
    toast.success("Signed out successfully!");
  };

  return {
    user,
    loading,
    showAuth,
    signOut,
    setShowAuth,
  };
};
