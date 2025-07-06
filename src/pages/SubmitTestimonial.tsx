import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';
import { addTestimonial } from '../lib/cms-storage';
import { toast } from '../components/ui/sonner';
import { testimonialSchema, formRateLimiter, sanitizeInput, SecureError } from '../lib/security';
import { useDebounce } from '../lib/performance';

const SubmitTestimonial = () => {
  const [formData, setFormData] = useState({
    name: '',
    quote: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRateLimited, setIsRateLimited] = useState(false);
  const navigate = useNavigate();

  // Debounced validation
  const debouncedValidation = useDebounce((field: string, value: string) => {
    try {
      const fieldSchema = testimonialSchema.shape[field as keyof typeof testimonialSchema.shape];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || 'Erreur de validation' }));
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Trigger debounced validation
    debouncedValidation(name, sanitizedValue);
  };

  const validateForm = (): boolean => {
    try {
      testimonialSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const userIdentifier = `${formData.name}-testimonial`;
    if (!formRateLimiter.isAllowed(userIdentifier)) {
      const remainingTime = Math.ceil(formRateLimiter.getRemainingTime(userIdentifier) / 1000 / 60);
      setIsRateLimited(true);
      toast.error(`Trop de tentatives. Veuillez attendre ${remainingTime} minutes.`);
      return;
    }

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Additional validation for required fields and lengths
    const trimmedName = formData.name.trim();
    const trimmedQuote = formData.quote.trim();

    if (!trimmedName || !trimmedQuote) {
      toast.error('Le nom et le témoignage sont requis');
      return;
    }

    if (trimmedName.length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return;
    }

    if (trimmedQuote.length < 10) {
      toast.error('Le témoignage doit contenir au moins 10 caractères');
      return;
    }

    if (trimmedName.length > 100) {
      toast.error('Le nom ne peut pas dépasser 100 caractères');
      return;
    }

    if (trimmedQuote.length > 1000) {
      toast.error('Le témoignage ne peut pas dépasser 1000 caractères');
      return;
    }

    setIsSubmitting(true);

    try {
      const testimonial = await addTestimonial({
        name: trimmedName,
        quote: trimmedQuote,
        status: 'pending'
      });

      if (testimonial) {
        navigate('/thank-you-testimonial');
      } else {
        throw new SecureError(
          'Erreur lors de la soumission. Veuillez réessayer.',
          'Failed to create testimonial in database'
        );
      }
    } catch (error) {
      if (error instanceof SecureError) {
        toast.error(error.userMessage);
      } else {
        toast.error('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim().length >= 2 && formData.quote.trim().length >= 10;

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <LuxuryAnimations />
      
      {/* Header Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative mb-12">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <span className="font-serif text-6xl md:text-[8rem] lg:text-[10rem] text-champagne/5 font-bold select-none">
                Témoignage
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                Partagez votre expérience
              </h1>
              <div className="animated-separator mx-auto"></div>
              
              <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto mt-8">
                Votre témoignage nous aide à améliorer nos services et inspire d'autres futures mariées. 
                Partagez votre expérience avec nous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-soft-beige rounded-2xl p-8 md:p-12 shadow-xl">
            {isRateLimited && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-800 font-sans text-sm">
                    Trop de tentatives de soumission. Veuillez attendre avant de réessayer.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block font-sans text-sm font-medium text-navy mb-2">
                  Votre nom * (minimum 2 caractères)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans transition-colors duration-200 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-champagne/30'
                  }`}
                  placeholder="Marie Dupont"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                <div className="mt-1 text-xs text-navy/60 flex justify-between">
                  <span>{formData.name.length}/100 caractères</span>
                  {formData.name.length >= 2 && (
                    <span className="text-green-600">✓ Valide</span>
                  )}
                </div>
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 font-sans">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="quote" className="block font-sans text-sm font-medium text-navy mb-2">
                  Votre témoignage * (minimum 10 caractères)
                </label>
                <textarea
                  id="quote"
                  name="quote"
                  value={formData.quote}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={6}
                  maxLength={1000}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans resize-none transition-colors duration-200 ${
                    errors.quote ? 'border-red-300 bg-red-50' : 'border-champagne/30'
                  }`}
                  placeholder="Partagez votre expérience avec Safa Maatoug..."
                  aria-describedby={errors.quote ? 'quote-error' : undefined}
                />
                <div className="mt-1 text-xs text-navy/60 flex justify-between">
                  <span>{formData.quote.length}/1000 caractères</span>
                  {formData.quote.length >= 10 && (
                    <span className="text-green-600">✓ Valide</span>
                  )}
                </div>
                {errors.quote && (
                  <p id="quote-error" className="mt-1 text-sm text-red-600 font-sans">
                    {errors.quote}
                  </p>
                )}
              </div>

              <div className="bg-ivory rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-champagne mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-navy/70 font-sans">
                    <p className="font-medium text-navy mb-1">Note importante :</p>
                    <p>Votre témoignage sera examiné par notre équipe avant publication. Nous nous réservons le droit de modifier ou de ne pas publier certains témoignages.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/avis')}
                  className="flex-1 bg-ivory text-navy px-6 py-3 rounded-lg font-sans font-medium border-2 border-navy hover:bg-soft-beige transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isRateLimited || Object.values(errors).some(error => error) || !isFormValid}
                  className="flex-1 bg-navy text-ivory px-6 py-3 rounded-lg font-sans font-medium hover:bg-champagne hover:text-navy transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon témoignage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubmitTestimonial;