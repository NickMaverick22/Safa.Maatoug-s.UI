import { supabase } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { Testimonial, Appointment, GalleryImage, CMSStats } from '../types/cms';
import { SecureError } from './security';

// Create a dedicated anonymous client for public operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const anonSupabase = createClient(supabaseUrl, supabaseAnonKey);

// Testimonials CRUD with enhanced error handling
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new SecureError(
        'Erreur lors du chargement des témoignages',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      quote: item.testimonial,
      avatar: '', // Not stored in database
      status: item.status,
      submittedAt: new Date(item.created_at),
      reviewedAt: item.updated_at ? new Date(item.updated_at) : undefined,
      reviewedBy: '' // Not stored in database
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement des témoignages',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const getTestimonialById = async (id: string): Promise<Testimonial | undefined> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined; // Not found
      }
      throw new SecureError(
        'Erreur lors du chargement du témoignage',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      name: data.name,
      quote: data.testimonial,
      avatar: '', // Not stored in database
      status: data.status,
      submittedAt: new Date(data.created_at),
      reviewedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      reviewedBy: '' // Not stored in database
    };
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement du témoignage',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const updateTestimonialStatus = async (
  id: string, 
  status: 'approved' | 'rejected', 
  reviewedBy: string
): Promise<boolean> => {
  try {
    // Validate inputs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    if (!['approved', 'rejected'].includes(status)) {
      throw new SecureError('Statut invalide', 'Invalid status value', 400);
    }

    const { error } = await supabase
      .from('testimonials')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la mise à jour du statut',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la suppression',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'submittedAt'>): Promise<Testimonial | null> => {
  try {
    console.log('Adding testimonial with data:', testimonial);

    // Validate required fields
    if (!testimonial.name || !testimonial.quote) {
      throw new SecureError(
        'Le nom et le témoignage sont requis',
        'Name and testimonial are required fields',
        400
      );
    }

    // Validate field lengths to match RLS policy requirements
    if (testimonial.name.trim().length < 2 || testimonial.name.trim().length > 100) {
      throw new SecureError(
        'Le nom doit contenir entre 2 et 100 caractères',
        'Name length validation failed',
        400
      );
    }

    if (testimonial.quote.trim().length < 10 || testimonial.quote.trim().length > 1000) {
      throw new SecureError(
        'Le témoignage doit contenir entre 10 et 1000 caractères',
        'Testimonial length validation failed',
        400
      );
    }

    // Store current session to restore later if needed
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    console.log('Current session before submission:', currentSession ? 'authenticated' : 'anonymous');

    // Prepare insert data - ensure status is 'pending' for RLS policy compliance
    const insertData = {
      name: testimonial.name.trim(),
      testimonial: testimonial.quote.trim(),
      status: 'pending', // Force pending status for RLS policy compliance
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Insert data:', insertData);

    // Use the anonymous client for testimonial submission
    // This ensures the request is always made with the 'anon' role
    const { data, error } = await anonSupabase
      .from('testimonials')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      
      // Handle specific RLS policy violation
      if (error.code === '42501' || error.message.includes('row-level security policy')) {
        throw new SecureError(
          'Erreur de sécurité lors de la soumission. Veuillez vérifier que tous les champs sont remplis correctement.',
          `RLS policy violation: ${error.message}`,
          403
        );
      }
      
      // Handle missing required fields
      if (error.code === '23502') {
        throw new SecureError(
          'Données manquantes. Veuillez remplir tous les champs requis.',
          `Missing required field: ${error.message}`,
          400
        );
      }
      
      // Handle check constraint violations
      if (error.code === '23514') {
        throw new SecureError(
          'Les données ne respectent pas les critères requis. Vérifiez la longueur de vos textes.',
          `Check constraint violation: ${error.message}`,
          400
        );
      }
      
      throw new SecureError(
        'Erreur lors de l\'ajout du témoignage',
        `Supabase error: ${error.message}`,
        500
      );
    }

    console.log('Successfully inserted testimonial:', data);

    return {
      id: data.id,
      name: data.name,
      quote: data.testimonial,
      avatar: '', // Not stored in database
      status: data.status,
      submittedAt: new Date(data.created_at),
      reviewedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      reviewedBy: '' // Not stored in database
    };
  } catch (error) {
    console.error('Error adding testimonial:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Une erreur inattendue s\'est produite lors de la soumission',
      `Unexpected error: ${error}`,
      500
    );
  }
};

// Appointments CRUD with enhanced error handling
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) {
      throw new SecureError(
        'Erreur lors du chargement des rendez-vous',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return data.map(item => ({
      id: item.id,
      clientName: item.client_name,
      clientEmail: item.client_email,
      clientPhone: item.client_phone,
      appointmentDate: new Date(item.appointment_date),
      appointmentTime: item.appointment_time,
      service: item.service,
      status: item.status,
      notes: item.notes,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement des rendez-vous',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined; // Not found
      }
      throw new SecureError(
        'Erreur lors du chargement du rendez-vous',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      clientName: data.client_name,
      clientEmail: data.client_email,
      clientPhone: data.client_phone,
      appointmentDate: new Date(data.appointment_date),
      appointmentTime: data.appointment_time,
      service: data.service,
      status: data.status,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error fetching appointment:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement du rendez-vous',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<boolean> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.clientName) updateData.client_name = updates.clientName;
    if (updates.clientEmail) updateData.client_email = updates.clientEmail;
    if (updates.clientPhone) updateData.client_phone = updates.clientPhone;
    if (updates.appointmentDate) updateData.appointment_date = updates.appointmentDate.toISOString();
    if (updates.appointmentTime) updateData.appointment_time = updates.appointmentTime;
    if (updates.service) updateData.service = updates.service;
    if (updates.status) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la mise à jour du rendez-vous',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la suppression du rendez-vous',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

export const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_name: appointment.clientName,
        client_email: appointment.clientEmail,
        client_phone: appointment.clientPhone,
        appointment_date: appointment.appointmentDate.toISOString(),
        appointment_time: appointment.appointmentTime,
        service: appointment.service,
        status: appointment.status || 'scheduled',
        notes: appointment.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new SecureError(
        'Erreur lors de la création du rendez-vous',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      clientName: data.client_name,
      clientEmail: data.client_email,
      clientPhone: data.client_phone,
      appointmentDate: new Date(data.appointment_date),
      appointmentTime: data.appointment_time,
      service: data.service,
      status: data.status,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error adding appointment:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return null;
  }
};

// Gallery Images CRUD (keeping mock data for now as requested)
let galleryImages: GalleryImage[] = [
  {
    id: '1',
    filename: '88c2ef1d-431e-419a-ba66-607284097b92.png',
    originalName: 'etoile-azure.png',
    url: '/lovable-uploads/88c2ef1d-431e-419a-ba66-607284097b92.png',
    alt: 'Étoile Azure - Plumes et Éclats',
    category: 'collection',
    tags: ['haute-couture', 'plumes', 'bleu'],
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'admin@safamaatoug.com',
    size: 2048576,
    dimensions: { width: 800, height: 1200 }
  },
  {
    id: '2',
    filename: '6254dd8b-8e1d-44e8-af43-adb58b41fa97.png',
    originalName: 'lumiere-champagne.png',
    url: '/lovable-uploads/6254dd8b-8e1d-44e8-af43-adb58b41fa97.png',
    alt: 'Lumière Champagne',
    category: 'collection',
    tags: ['ceremonie', 'champagne', 'tulle'],
    uploadedAt: new Date('2024-01-20'),
    uploadedBy: 'admin@safamaatoug.com',
    size: 1876543,
    dimensions: { width: 800, height: 1200 }
  }
];

export const getGalleryImages = (): GalleryImage[] => galleryImages;

export const getGalleryImageById = (id: string): GalleryImage | undefined => {
  return galleryImages.find(img => img.id === id);
};

export const updateGalleryImage = (id: string, updates: Partial<GalleryImage>): boolean => {
  const image = galleryImages.find(img => img.id === id);
  if (image) {
    Object.assign(image, updates);
    return true;
  }
  return false;
};

export const deleteGalleryImage = (id: string): boolean => {
  const index = galleryImages.findIndex(img => img.id === id);
  if (index > -1) {
    galleryImages.splice(index, 1);
    return true;
  }
  return false;
};

export const addGalleryImage = (image: Omit<GalleryImage, 'id' | 'uploadedAt'>): GalleryImage => {
  const newImage: GalleryImage = {
    ...image,
    id: Date.now().toString(),
    uploadedAt: new Date()
  };
  galleryImages.push(newImage);
  return newImage;
};

// Statistics with enhanced error handling
export const getCMSStats = async (): Promise<CMSStats> => {
  try {
    const [testimonialsResult, appointmentsResult] = await Promise.all([
      supabase.from('testimonials').select('status', { count: 'exact' }),
      supabase.from('appointments').select('status', { count: 'exact' })
    ]);

    const testimonials = testimonialsResult.data || [];
    const appointments = appointmentsResult.data || [];

    return {
      totalTestimonials: testimonials.length,
      pendingTestimonials: testimonials.filter(t => t.status === 'pending').length,
      totalAppointments: appointments.length,
      upcomingAppointments: appointments.filter(a => 
        a.status === 'scheduled' || a.status === 'confirmed'
      ).length,
      totalImages: galleryImages.length,
      storageUsed: galleryImages.reduce((total, img) => total + img.size, 0)
    };
  } catch (error) {
    console.error('Error fetching CMS stats:', error);
    return {
      totalTestimonials: 0,
      pendingTestimonials: 0,
      totalAppointments: 0,
      upcomingAppointments: 0,
      totalImages: galleryImages.length,
      storageUsed: galleryImages.reduce((total, img) => total + img.size, 0)
    };
  }
};