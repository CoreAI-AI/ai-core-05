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
    
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          setShowAuth(false);
        } else if (event === 'SIGNED_OUT') {
          setShowAuth(true);
        }
        
        setLoading(false);
      }
    );

    // Get initial session - handle failures gracefully
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error || !session?.user) {
          // Session expired or failed - show login
          setUser(null);
          setShowAuth(true);
        } else {
          setUser(session.user);
          setShowAuth(false);
        }
      } catch (err) {
        console.warn('Auth session fetch failed:', err);
        if (!mounted) return;
        setUser(null);
        setShowAuth(true);
      }
      
      if (mounted) setLoading(false);
    };

    // Set a timeout to force loading to false after 5 seconds
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - showing login');
        setLoading(false);
        setShowAuth(true);
      }
    }, 5000);

    getSession();

    return () => {
      mounted = false;
      clearTimeout(timeout);
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