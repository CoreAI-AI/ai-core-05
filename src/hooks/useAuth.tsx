import { useState, useEffect } from 'react';

export interface SimpleUser {
  id: string;
  username: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Clear old Supabase auth tokens to prevent errors
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key);
        }
      });
    } catch {}

    const savedUsername = localStorage.getItem('coreai_username');
    if (savedUsername) {
      setUser({
        id: savedUsername,
        username: savedUsername,
      });
      setShowAuth(false);
    } else {
      setShowAuth(true);
    }
    setLoading(false);
  }, []);

  const signIn = (username: string) => {
    localStorage.setItem('coreai_username', username);
    const newUser: SimpleUser = { id: username, username };
    setUser(newUser);
    setShowAuth(false);
  };

  const signOut = () => {
    localStorage.removeItem('coreai_username');
    setUser(null);
    setShowAuth(true);
  };

  const changeUsername = (newUsername: string) => {
    localStorage.setItem('coreai_username', newUsername);
    setUser({ id: newUsername, username: newUsername });
  };

  return {
    user,
    loading,
    showAuth,
    signOut,
    signIn,
    changeUsername,
    setShowAuth,
  };
};
