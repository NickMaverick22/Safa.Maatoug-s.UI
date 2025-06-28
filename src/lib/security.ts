// Security utilities and validation
import { z } from 'zod';

// Input validation schemas
export const testimonialSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, 'Le nom contient des caractères non autorisés'),
  quote: z.string()
    .min(10, 'Le témoignage doit contenir au moins 10 caractères')
    .max(1000, 'Le témoignage ne peut pas dépasser 1000 caractères')
});

export const appointmentSchema = z.object({
  clientName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, 'Le nom contient des caractères non autorisés'),
  clientEmail: z.string()
    .email('Format d\'email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  clientPhone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{8,20}$/, 'Format de téléphone invalide')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères'),
  service: z.enum(['consultation', 'fitting', 'final-fitting', 'delivery']),
  notes: z.string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .optional()
});

// Content Security Policy
export const getCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');
};

// Rate limiting (client-side tracking)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, timeUntilReset);
  }
}

export const formRateLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes

// XSS Protection
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// CSRF Protection (simple token generation)
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

// Secure headers for requests
export const getSecureHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
};

// Error handling with security in mind
export class SecureError extends Error {
  public readonly userMessage: string;
  public readonly logMessage: string;
  public readonly statusCode: number;

  constructor(userMessage: string, logMessage: string, statusCode: number = 400) {
    super(logMessage);
    this.userMessage = userMessage;
    this.logMessage = logMessage;
    this.statusCode = statusCode;
    this.name = 'SecureError';
  }
}

// Input length validation
export const validateInputLength = (input: string, maxLength: number): boolean => {
  return input.length <= maxLength;
};

// Email validation with additional security checks
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255 && !email.includes('<') && !email.includes('>');
};