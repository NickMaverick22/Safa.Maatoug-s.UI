import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';
import { addTestimonial } from '../lib/cms-storage';
import { toast } from '../components/ui/sonner';

const SubmitTestimonial = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    quote: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const testimonial = await addTestimonial({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        quote: formData.quote,
        status: 'pending'
      });

      if (testimonial) {
        toast.success('Votre témoignage a été soumis avec succès !');
        setTimeout(() => {
          navigate('/avis');
        }, 2000);
      } else {
        toast.error('Erreur lors de la soumission. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-sans text-sm font-medium text-navy mb-2">
                    Votre nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                    placeholder="Marie Dupont"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-sans text-sm font-medium text-navy mb-2">
                    Votre email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                    placeholder="marie@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block font-sans text-sm font-medium text-navy mb-2">
                  Date de votre mariage *
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                  placeholder="Juin 2024"
                />
              </div>

              <div>
                <label htmlFor="quote" className="block font-sans text-sm font-medium text-navy mb-2">
                  Votre témoignage *
                </label>
                <textarea
                  id="quote"
                  name="quote"
                  value={formData.quote}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans resize-none"
                  placeholder="Partagez votre expérience avec Safa Maatoug..."
                />
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
                  disabled={isSubmitting}
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