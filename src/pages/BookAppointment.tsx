import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const BookAppointment = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Load HubSpot form script
    const script = document.createElement('script');
    script.src = '//js-eu1.hsforms.net/forms/embed/v2.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Create HubSpot form
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "eu1",
          portalId: "146366517",
          formId: "c5367ce7-eba0-4545-9742-8750f02c7159",
          target: '#hubspot-form',
          onFormSubmit: () => {
            setTimeout(() => {
              setFormSubmitted(true);
            }, 1000);
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
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

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {!formSubmitted ? (
            <div className="bg-soft-beige rounded-lg p-8 md:p-12 shadow-lg">
              <div className="fade-slide-up">
                <div id="hubspot-form" className="hubspot-form-container">
                  {/* HubSpot form will be injected here */}
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne mx-auto"></div>
                    <p className="font-sans text-navy/70 mt-4">Chargement du formulaire...</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-soft-beige rounded-lg p-8 md:p-12 shadow-lg text-center fade-slide-up">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-champagne mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-serif text-3xl text-navy mb-6">
                Merci pour votre réservation
              </h2>
              <p className="font-sans text-lg text-navy/70 leading-relaxed mb-8">
                Thanks for booking an appointment. You will receive a confirmation text or call shortly. Enjoy your day!
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
      <section className="py-16 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="fade-slide-up">
              <div className="mb-4">
                <svg className="w-8 h-8 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-navy mb-2">Durée</h3>
              <p className="font-sans text-navy/70 text-sm">60-90 minutes</p>
            </div>
            
            <div className="fade-slide-up">
              <div className="mb-4">
                <svg className="w-8 h-8 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-navy mb-2">Lieu</h3>
              <p className="font-sans text-navy/70 text-sm">Atelier privé, Tunis</p>
            </div>
            
            <div className="fade-slide-up">
              <div className="mb-4">
                <svg className="w-8 h-8 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-navy mb-2">Consultation</h3>
              <p className="font-sans text-navy/70 text-sm">Gratuite et sans engagement</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookAppointment;