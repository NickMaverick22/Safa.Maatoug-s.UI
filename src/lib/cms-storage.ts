import { supabase } from './supabaseClient';
import { Testimonial, Appointment, GalleryImage, CMSStats, Collection, CollectionImage } from '../types/cms';
import { SecureError } from './security';

// Upload file to Supabase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from('safa-maatoug-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new SecureError(
        'Erreur lors du téléchargement du fichier',
        `Storage error: ${error.message}`,
        500
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('safa-maatoug-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du téléchargement du fichier',
      `Unexpected error: ${error}`,
      500
    );
  }
};

// Simple function to create anonymous request
const createAnonymousRequest = async (tableName: string, data: any) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
};

// Testimonials CRUD with enhanced error handling
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials2')
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
      status: item.status || 'pending',
      submittedAt: new Date(item.created_at),
      reviewedAt: item.updated_at ? new Date(item.updated_at) : undefined,
      reviewedBy: '', // Not stored in database
      userId: item.user_id
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
      .from('testimonials2')
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
      status: data.status || 'pending',
      avatar: '', // Not stored in database
      status: data.status || 'pending',
      submittedAt: new Date(data.created_at),
      reviewedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      reviewedBy: '', // Not stored in database
      userId: data.user_id
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

export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { error } = await supabase
      .from('testimonials2')
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
    // Validate required fields
    if (!testimonial.name?.trim() || !testimonial.quote?.trim()) {
      throw new SecureError(
        'Tous les champs sont obligatoires',
        'Name and testimonial must not be empty',
        400
      );
    }

    // Validate field lengths
    const trimmedName = testimonial.name.trim();
    const trimmedQuote = testimonial.quote.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      throw new SecureError(
        'Le nom doit contenir entre 2 et 100 caractères',
        'Name length validation failed',
        400
      );
    }

    if (trimmedQuote.length < 10 || trimmedQuote.length > 1000) {
      throw new SecureError(
        'Le témoignage doit contenir entre 10 et 1000 caractères',
        'Testimonial length validation failed',
        400
      );
    }

    // Prepare insert data
    const insertData = {
      name: trimmedName,
      testimonial: trimmedQuote,
      status: 'pending',
      user_id: null
    };

    // Use Supabase client for insertion
    const { data, error } = await supabase
      .from('testimonials2')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new SecureError(
        'Erreur lors de l\'ajout du témoignage',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      name: data.name,
      quote: data.testimonial,
      avatar: '',
      submittedAt: new Date(data.created_at),
      reviewedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      reviewedBy: '', // Not stored in database
      userId: data.user_id
    };
  } catch (error) {
    console.error('Full error adding testimonial:', error);
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

// Gallery Images CRUD with Supabase integration
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new SecureError(
        'Erreur lors du chargement des images',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return data.map(item => ({
      id: item.id,
      filename: item.filename,
      originalName: item.original_name,
      url: item.url,
      alt: item.alt,
      category: item.category,
      tags: item.tags || [],
      uploadedAt: new Date(item.uploaded_at),
      uploadedBy: item.uploaded_by || '',
      size: item.size || 0,
      dimensions: item.dimensions || { width: 0, height: 0 }
    }));
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement des images',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const getGalleryImageById = async (id: string): Promise<GalleryImage | undefined> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      throw new SecureError(
        'Erreur lors du chargement de l\'image',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      filename: data.filename,
      originalName: data.original_name,
      url: data.url,
      alt: data.alt,
      category: data.category,
      tags: data.tags || [],
      uploadedAt: new Date(data.uploaded_at),
      uploadedBy: data.uploaded_by || '',
      size: data.size || 0,
      dimensions: data.dimensions || { width: 0, height: 0 }
    };
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement de l\'image',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const updateGalleryImage = async (id: string, updates: Partial<GalleryImage>): Promise<boolean> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const updateData: any = {};
    if (updates.alt) updateData.alt = updates.alt;
    if (updates.category) updateData.category = updates.category;
    if (updates.tags) updateData.tags = updates.tags;

    const { error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la mise à jour de l\'image',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

export const deleteGalleryImage = async (id: string): Promise<boolean> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la suppression de l\'image',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

export const addGalleryImage = async (file: File, imageData: Omit<GalleryImage, 'id' | 'uploadedAt' | 'url' | 'filename' | 'size'>): Promise<GalleryImage | null> => {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const path = `gallery/${filename}`;

    // Upload file to storage
    const url = await uploadFile(file, path);

    // Get image dimensions (basic implementation)
    const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 800, height: 1200 }); // Default dimensions
      };
      img.src = URL.createObjectURL(file);
    });

    // Insert into database
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        filename,
        original_name: file.name,
        url,
        alt: imageData.alt,
        category: imageData.category,
        tags: imageData.tags || [],
        uploaded_by: imageData.uploadedBy,
        size: file.size,
        dimensions
      })
      .select()
      .single();

    if (error) {
      throw new SecureError(
        'Erreur lors de l\'ajout de l\'image',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      filename: data.filename,
      originalName: data.original_name,
      url: data.url,
      alt: data.alt,
      category: data.category,
      tags: data.tags || [],
      uploadedAt: new Date(data.uploaded_at),
      uploadedBy: data.uploaded_by || '',
      size: data.size || 0,
      dimensions: data.dimensions || { width: 0, height: 0 }
    };
  } catch (error) {
    console.error('Error adding gallery image:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return null;
  }
};

// Collections CRUD with Supabase integration
export const getCollections = async (): Promise<Collection[]> => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_images (
          order_index,
          gallery_images (
            url
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new SecureError(
        'Erreur lors du chargement des collections',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      coverImage: item.cover_image_url || '',
      images: item.collection_images
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((ci: any) => ci.gallery_images.url),
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      isActive: item.is_active
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement des collections',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const getAllCollections = async (): Promise<Collection[]> => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_images (
          order_index,
          gallery_images (
            url
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new SecureError(
        'Erreur lors du chargement des collections',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      coverImage: item.cover_image_url || '',
      images: item.collection_images
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((ci: any) => ci.gallery_images.url),
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      isActive: item.is_active
    }));
  } catch (error) {
    console.error('Error fetching all collections:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement des collections',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const getCollectionById = async (id: string): Promise<Collection | undefined> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_images (
          order_index,
          gallery_images (
            url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      throw new SecureError(
        'Erreur lors du chargement de la collection',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      coverImage: data.cover_image_url || '',
      images: data.collection_images
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((ci: any) => ci.gallery_images.url),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    throw new SecureError(
      'Erreur lors du chargement de la collection',
      `Unexpected error: ${error}`,
      500
    );
  }
};

export const addCollection = async (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collection | null> => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        name: collection.name,
        description: collection.description,
        cover_image_url: collection.coverImage,
        is_active: collection.isActive
      })
      .select()
      .single();

    if (error) {
      throw new SecureError(
        'Erreur lors de la création de la collection',
        `Supabase error: ${error.message}`,
        500
      );
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      coverImage: data.cover_image_url || '',
      images: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error adding collection:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return null;
  }
};

export const updateCollection = async (id: string, updates: Partial<Collection>): Promise<boolean> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.coverImage) updateData.cover_image_url = updates.coverImage;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { error } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la mise à jour de la collection',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error updating collection:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

export const deleteCollection = async (id: string): Promise<boolean> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new SecureError('ID invalide', 'Invalid UUID format', 400);
    }

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      throw new SecureError(
        'Erreur lors de la suppression de la collection',
        `Supabase error: ${error.message}`,
        500
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting collection:', error);
    if (error instanceof SecureError) {
      throw error;
    }
    return false;
  }
};

// Statistics with enhanced error handling
export const getCMSStats = async (): Promise<CMSStats> => {
  try {
    const [testimonialsResult, appointmentsResult, galleryResult, collectionsResult] = await Promise.all([
      supabase.from('testimonials2').select('*', { count: 'exact' }),
      supabase.from('appointments').select('status', { count: 'exact' }),
      supabase.from('gallery_images').select('size', { count: 'exact' }),
      supabase.from('collections').select('*', { count: 'exact' })
    ]);

    const testimonials = testimonialsResult.data || [];
    const appointments = appointmentsResult.data || [];
    const images = galleryResult.data || [];
    const collections = collectionsResult.data || [];

    return {
      totalTestimonials: testimonials.length,
      pendingTestimonials: testimonials.filter(t => t.status === 'pending').length,
      totalAppointments: appointments.length,
      upcomingAppointments: appointments.filter(a => 
        a.status === 'scheduled' || a.status === 'confirmed'
      ).length,
      totalImages: images.length,
      storageUsed: images.reduce((total, img) => total + (img.size || 0), 0)
    };
  } catch (error) {
    console.error('Error fetching CMS stats:', error);
    return {
      totalTestimonials: 0,
      pendingTestimonials: 0,
      totalAppointments: 0,
      upcomingAppointments: 0,
      totalImages: 0,
      storageUsed: 0
    };
  }
};