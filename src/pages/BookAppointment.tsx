import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const BookAppointment = () => {
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    // Listen for HubSpot meeting booking events
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmit') {
        // Show thank you message after booking
        setTimeout(() => {
          setShowThankYou(true);
        }, 1000);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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
                Rendez-vous
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                Schedule Your Fitting
              </h1>
              <div className="animated-separator mx-auto"></div>
              
              <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto mt-8">
                Réservez votre consultation privée pour découvrir nos créations exceptionnelles 
                et commencer votre voyage vers la robe de vos rêves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Scheduler Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showThankYou ? (
            <div className="bg-white rounded-2xl shadow-xl border border-champagne/10 overflow-hidden">
              {/* HubSpot Meeting Scheduler Embed */}
              <div className="fade-slide-up">
                <iframe
                  src="https://meetings-eu1.hubspot.com/ssoussi"
                  width="100%"
                  height="800"
                  frameBorder="0"
                  style={{ border: 'none', minHeight: '800px' }}
                  title="Schedule a Meeting"
                  className="w-full"
                  onLoad={() => {
                    // Listen for booking completion
                    const iframe = document.querySelector('iframe[src*="meetings-eu1.hubspot.com"]');
                    if (iframe) {
                      iframe.addEventListener('load', () => {
                        // Check for booking completion periodically
                        const checkBooking = setInterval(() => {
                          try {
                            // This is a simple check - in a real implementation, you'd use HubSpot's API
                            // For now, we'll show the thank you message after 30 seconds as a demo
                            if (window.location.hash === '#booked') {
                              setShowThankYou(true);
                              clearInterval(checkBooking);
                            }
                          } catch (e) {
                            // Ignore cross-origin errors
                          }
                        }, 1000);

                        // Clear interval after 5 minutes
                        setTimeout(() => clearInterval(checkBooking), 300000);
                      });
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-champagne/10 text-center fade-slide-up">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-champagne mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-serif text-3xl text-navy mb-6">
                Thank You for Booking!
              </h2>
              <p className="font-sans text-lg text-navy/70 leading-relaxed mb-8">
                Thank you for booking your appointment! Please check your email to confirm the meeting. Looking forward to connecting.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="luxury-button"
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-soft-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="fade-slide-up font-serif text-3xl text-navy mb-4">
              À quoi s'attendre
            </h3>
            <div className="animated-separator mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="fade-slide-up">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-serif text-xl text-navy mb-3">Durée</h4>
              <p className="font-sans text-navy/70">60-90 minutes de consultation personnalisée</p>
            </div>
            
            <div className="fade-slide-up">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-serif text-xl text-navy mb-3">Lieu</h4>
              <p className="font-sans text-navy/70">Atelier privé à Tunis, environnement luxueux</p>
            </div>
            
            <div className="fade-slide-up">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-serif text-xl text-navy mb-3">Consultation</h4>
              <p className="font-sans text-navy/70">Gratuite et sans engagement, découverte de vos goûts</p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="fade-slide-up font-serif text-3xl text-navy mb-4">
              Votre Expérience
            </h3>
            <div className="animated-separator mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="fade-slide-up">
              <h4 className="font-serif text-xl text-navy mb-4">Première Consultation</h4>
              <ul className="font-sans text-navy/70 space-y-2">
                <li>• Discussion de votre vision et style</li>
                <li>• Présentation de nos collections</li>
                <li>• Prise de mesures préliminaires</li>
                <li>• Sélection des tissus et détails</li>
              </ul>
            </div>
            
            <div className="fade-slide-up">
              <h4 className="font-serif text-xl text-navy mb-4">Processus de Création</h4>
              <ul className="font-sans text-navy/70 space-y-2">
                <li>• Design personnalisé selon vos goûts</li>
                <li>• Essayages réguliers pour ajustements</li>
                <li>• Finitions haute couture à la main</li>
                <li>• Livraison de votre robe de rêve</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookAppointment;