import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      testimonials: {
        Row: {
          id: string;
          name: string;
          testimonial: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          testimonial: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          testimonial?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          appointment_date: string;
          appointment_time: string;
          service: 'consultation' | 'fitting' | 'final-fitting' | 'delivery';
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          appointment_date: string;
          appointment_time: string;
          service: 'consultation' | 'fitting' | 'final-fitting' | 'delivery';
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string;
          appointment_date?: string;
          appointment_time?: string;
          service?: 'consultation' | 'fitting' | 'final-fitting' | 'delivery';
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}