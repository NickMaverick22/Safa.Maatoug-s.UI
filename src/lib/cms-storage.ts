import { Testimonial, Appointment, GalleryImage, CMSStats } from '../types/cms';

// Mock data storage - in production, this would be a real database
let testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'L. Dupont',
    email: 'l.dupont@email.com',
    date: 'Juin 2024',
    quote: 'Merci pour la robe parfaite ! Chaque détail était pensé, la qualité exceptionnelle. Je me suis sentie comme une princesse le jour J.',
    status: 'approved',
    submittedAt: new Date('2024-06-15'),
    reviewedAt: new Date('2024-06-16'),
    reviewedBy: 'admin@safamaatoug.com'
  },
  {
    id: '2',
    name: 'M. Rousseau',
    email: 'm.rousseau@email.com',
    date: 'Mai 2024',
    quote: 'Une expérience magique du premier essayage au jour du mariage. L\'équipe a su comprendre mes envies et créer la robe de mes rêves.',
    status: 'approved',
    submittedAt: new Date('2024-05-20'),
    reviewedAt: new Date('2024-05-21'),
    reviewedBy: 'admin@safamaatoug.com'
  },
  {
    id: '3',
    name: 'S. Martin',
    email: 's.martin@email.com',
    date: 'Avril 2024',
    quote: 'Artisanat d\'exception, service impeccable. Ma robe était unique, comme moi. Merci pour avoir rendu mon mariage inoubliable.',
    status: 'pending',
    submittedAt: new Date('2024-12-20')
  }
];

let appointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Marie Dubois',
    clientEmail: 'marie.dubois@email.com',
    clientPhone: '+33 6 12 34 56 78',
    appointmentDate: new Date('2024-12-28'),
    appointmentTime: '14:00',
    service: 'consultation',
    status: 'confirmed',
    notes: 'Première consultation pour robe de mariée',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: '2',
    clientName: 'Sophie Laurent',
    clientEmail: 'sophie.laurent@email.com',
    clientPhone: '+33 6 98 76 54 32',
    appointmentDate: new Date('2024-12-30'),
    appointmentTime: '10:00',
    service: 'fitting',
    status: 'scheduled',
    notes: 'Premier essayage',
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18')
  }
];

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

// Testimonials CRUD
export const getTestimonials = (): Testimonial[] => testimonials;

export const getTestimonialById = (id: string): Testimonial | undefined => {
  return testimonials.find(t => t.id === id);
};

export const updateTestimonialStatus = (id: string, status: 'approved' | 'rejected', reviewedBy: string): boolean => {
  const testimonial = testimonials.find(t => t.id === id);
  if (testimonial) {
    testimonial.status = status;
    testimonial.reviewedAt = new Date();
    testimonial.reviewedBy = reviewedBy;
    return true;
  }
  return false;
};

export const deleteTestimonial = (id: string): boolean => {
  const index = testimonials.findIndex(t => t.id === id);
  if (index > -1) {
    testimonials.splice(index, 1);
    return true;
  }
  return false;
};

export const addTestimonial = (testimonial: Omit<Testimonial, 'id' | 'submittedAt'>): Testimonial => {
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: Date.now().toString(),
    submittedAt: new Date()
  };
  testimonials.push(newTestimonial);
  return newTestimonial;
};

// Appointments CRUD
export const getAppointments = (): Appointment[] => appointments;

export const getAppointmentById = (id: string): Appointment | undefined => {
  return appointments.find(a => a.id === id);
};

export const updateAppointment = (id: string, updates: Partial<Appointment>): boolean => {
  const appointment = appointments.find(a => a.id === id);
  if (appointment) {
    Object.assign(appointment, { ...updates, updatedAt: new Date() });
    return true;
  }
  return false;
};

export const deleteAppointment = (id: string): boolean => {
  const index = appointments.findIndex(a => a.id === id);
  if (index > -1) {
    appointments.splice(index, 1);
    return true;
  }
  return false;
};

export const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment => {
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  appointments.push(newAppointment);
  return newAppointment;
};

// Gallery Images CRUD
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
export const getCMSStats = (): CMSStats => {
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
};