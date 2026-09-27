import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';
import { getMe, createProfile } from '../api/auth.api';

interface AuthContextType {
  user: User | null;
  role: 'customer' | 'worker';
  token: string | null;
  setRole: (role: 'customer' | 'worker') => void;
  login: (role: 'customer' | 'worker', email?: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, city: string, role: 'customer' | 'worker', profession?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRoleState] = useState<'customer' | 'worker'>('customer');

  // Load active session from Supabase & Backend GET /api/me
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setToken(session.access_token);
          const meRes = await getMe(session.access_token);
          if (meRes.success && meRes.data) {
            const backendUser: User = {
              id: meRes.data.id,
              name: meRes.data.full_name || 'BuildConnect User',
              email: meRes.data.email || session.user.email || '',
              role: meRes.data.role || 'customer',
              city: meRes.data.city || 'Jaipur',
              phone: meRes.data.phone || '',
              avatar: meRes.data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
            };
            setUser(backendUser);
            setRoleState(backendUser.role);
          } else {
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Supabase Auth session fetch warning:', err);
        setUser(null);
        setToken(null);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setToken(session.access_token);
        const meRes = await getMe(session.access_token);
        if (meRes.success && meRes.data) {
          const backendUser: User = {
            id: meRes.data.id,
            name: meRes.data.full_name || 'BuildConnect User',
            email: meRes.data.email || session.user.email || '',
            role: meRes.data.role || 'customer',
            city: meRes.data.city || 'Jaipur',
            phone: meRes.data.phone || '',
            avatar: meRes.data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          };
          setUser(backendUser);
          setRoleState(backendUser.role);
        }
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setRole = (newRole: 'customer' | 'worker') => {
    setRoleState(newRole);
    localStorage.setItem('buildconnect_role', newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const login = async (selectedRole: 'customer' | 'worker', email?: string, password?: string) => {
    if (!email || !password) {
      throw new Error('Please enter both email address and password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data?.session) {
      setUser(null);
      setToken(null);
      throw new Error(error?.message || 'Authentication failed: Invalid credentials.');
    }

    const accessToken = data.session.access_token;
    setToken(accessToken);

    // Call GET /api/me to fetch authoritative backend profile
    const meRes = await getMe(accessToken);
    if (meRes.success && meRes.data) {
      const authenticatedUser: User = {
        id: meRes.data.id,
        name: meRes.data.full_name || 'BuildConnect User',
        email: meRes.data.email || email,
        role: meRes.data.role || selectedRole,
        city: meRes.data.city || 'Jaipur',
        phone: meRes.data.phone || '',
        avatar: meRes.data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      setUser(authenticatedUser);
      setRoleState(meRes.data.role || selectedRole);
    } else {
      // Fallback for new Supabase user whose backend profile is created on demand
      const fallbackUser: User = {
        id: data.user.id,
        name: data.user.email ? data.user.email.split('@')[0] : 'User',
        email: data.user.email || email,
        role: selectedRole,
        city: 'Jaipur',
        phone: ''
      };
      setUser(fallbackUser);
      setRoleState(selectedRole);
    }
  };

  const register = async (
    name: string,
    email: string,
    password = 'password123',
    phone: string,
    city: string,
    newRole: 'customer' | 'worker'
  ) => {
    if (!email || !password) {
      throw new Error('Please enter valid registration details.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setUser(null);
      setToken(null);
      throw new Error(error.message || 'Registration failed.');
    }

    if (data?.session) {
      const accessToken = data.session.access_token;
      setToken(accessToken);
      await createProfile(accessToken, {
        full_name: name,
        phone,
        city,
        role: newRole
      });

      const newUser: User = {
        id: data.user?.id || `u-${Date.now()}`,
        name,
        email,
        role: newRole,
        city,
        phone
      };
      setUser(newUser);
      setRoleState(newRole);
    } else {
      // Account created but session requires email confirmation
      setUser(null);
      setToken(null);
      throw new Error('Account created. Please verify your email address to log in.');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, setRole, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
