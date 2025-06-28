import { supabase } from './supabaseClient';
import { User } from '../types/cms';

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Authentication error:', error);
      return null;
    }

    if (data.session && data.user) {
      // Convert Supabase user to our User type
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email || 'Admin',
        role: 'admin', // For now, all authenticated users are admins
        createdAt: new Date(data.user.created_at),
        lastLogin: new Date()
      };
      
      return user;
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return null;
    }

    if (session && session.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email || 'Admin',
        role: 'admin',
        createdAt: new Date(session.user.created_at),
        lastLogin: new Date()
      };
      
      return user;
    }

    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Legacy function for backward compatibility - not used with Supabase
export const generateToken = (user: User): string => {
  // This is no longer needed with Supabase as it handles tokens automatically
  return '';
};

// Legacy function for backward compatibility - not used with Supabase
export const verifyToken = (token: string): any => {
  // This is no longer needed with Supabase
  return null;
};

// Legacy function for backward compatibility - not used with Supabase
export const hashPassword = async (password: string): Promise<string> => {
  // This is no longer needed with Supabase as it handles password hashing
  return '';
};