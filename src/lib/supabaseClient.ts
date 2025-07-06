import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

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
          user_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          testimonial: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          testimonial?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
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
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    testimonials2: {
      Row: {
        id: string;
        name: string;
        testimonial: string;
        created_at: string;
        updated_at: string;
        user_id: string | null;
      };
      Insert: {
        id?: string;
        name: string;
        testimonial: string;
        created_at?: string;
        updated_at?: string;
        user_id?: string | null;
      };
      Update: {
        id?: string;
        name?: string;
        testimonial?: string;
        created_at?: string;
        updated_at?: string;
        user_id?: string | null;
      };
    };
  };
}