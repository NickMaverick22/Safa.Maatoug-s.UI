import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types/cms';

const JWT_SECRET = 'safa-maatoug-cms-secret-key-2024';
const ADMIN_EMAIL = 'admin@safamaatoug.com';
const ADMIN_PASSWORD_HASH = '$2a$12$LQv3c1yqBwEHxv6HKk.2aO.jRuHkiDY31p8B4NfCAOtY8iKCOlRGy'; // 'admin123'

// Mock user database - in production, this would be a real database
const users: User[] = [
  {
    id: '1',
    email: ADMIN_EMAIL,
    name: 'Safa Maatoug',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  }
];

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  const user = users.find(u => u.email === email);
  if (!user) return null;

  // For demo purposes, check against hardcoded admin
  if (email === ADMIN_EMAIL) {
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (isValid) {
      user.lastLogin = new Date();
      return user;
    }
  }

  return null;
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('cms_token');
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return users.find(u => u.id === decoded.id) || null;
};

export const logout = (): void => {
  localStorage.removeItem('cms_token');
};