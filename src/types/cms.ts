export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  lastLogin?: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  avatar?: string;
  submittedAt: Date;
  userId?: string | null;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
  service: 'consultation' | 'fitting' | 'final-fitting' | 'delivery';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  alt: string;
  category: 'collection' | 'atelier' | 'hero' | 'testimonials';
  tags: string[];
  uploadedAt: Date;
  uploadedBy: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface CMSStats {
  totalTestimonials: number;
  pendingTestimonials: number;
  totalAppointments: number;
  upcomingAppointments: number;
  totalImages: number;
  storageUsed: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CollectionImage {
  id: string;
  collectionId: string;
  url: string;
  alt: string;
  order: number;
  uploadedAt: Date;
}