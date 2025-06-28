import { supabase } from './supabaseClient';
import { Testimonial, Appointment, GalleryImage, CMSStats } from '../types/cms';

// Testimonials CRUD
export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      date: item.date,
      quote: item.quote,
      avatar: item.avatar,
      status: item.status,
      submittedAt: new Date(item.submitted_at),
      reviewedAt: item.reviewed_at ? new Date(item.reviewed_at) : undefined,
      reviewedBy: item.reviewed_by
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const getTestimonialById = async (id: string): Promise<Testimonial | undefined> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      date: data.date,
      quote: data.quote,
      avatar: data.avatar,
      status: data.status,
      submittedAt: new Date(data.submitted_at),
      reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
      reviewedBy: data.reviewed_by
    };
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return undefined;
  }
};

export const updateTestimonialStatus = async (
  id: string, 
  status: 'approved' | 'rejected', 
  reviewedBy: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    return false;
  }
};

export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'submittedAt'>): Promise<Testimonial | null> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name: testimonial.name,
        email: testimonial.email,
        date: testimonial.date,
        quote: testimonial.quote,
        avatar: testimonial.avatar,
        status: testimonial.status || 'pending',
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      date: data.date,
      quote: data.quote,
      avatar: data.avatar,
      status: data.status,
      submittedAt: new Date(data.submitted_at),
      reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
      reviewedBy: data.reviewed_by
    };
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return null;
  }
};

// Appointments CRUD
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) throw error;

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
    return [];
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

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
    return undefined;
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<boolean> => {
  try {
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

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating appointment:', error);
    return false;
  }
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
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

    if (error) throw error;

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

// Statistics
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