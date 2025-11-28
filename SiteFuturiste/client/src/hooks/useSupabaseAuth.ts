import { useState } from 'react';
import { useToast } from './use-toast';

export function useSupabaseAuth() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      setUser(data.user);
      toast({ title: 'Succès', description: 'Connecté avec succès' });
      return data.user;
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Login failed',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdmin = async (secret: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });

      if (!res.ok) {
        throw new Error('Invalid secret');
      }

      setIsAdmin(true);
      toast({ title: 'Succès', description: 'Admin access granted' });
      return true;
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Code secret incorrect',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAdmin,
    isLoading,
    login,
    verifyAdmin,
    logout,
  };
}
