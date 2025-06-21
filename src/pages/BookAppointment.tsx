import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const BookAppointment = () => {
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  const handleBookingClick = () => {
    setShowRedirectMessage(true);
    
    // Show redirect message for 2 seconds, then open external link
    setTimeout(() => {
      window.open('https://meetings-eu1.hubspot.com/ssoussi', '_blank');
      setShowRedirectMessage(false);
    }, 2000);
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
                Rendez-vous
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                Planifiez votre rendez-vous gratuitement
              </h1>
              <div className="animated-separator mx-auto"></div>
              
              <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto mt-8">
                Choisissez l'heure qui vous convient pour discuter avec Safa. Vous recevrez une confirmation par email après la réservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {!showRedirectMessage ? (
            <div className="fade-slide-up">
              <button
                onClick={handleBookingClick}
                className="bg-navy text-ivory px-12 py-6 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-lg transition-all duration-300 hover:bg-champagne hover:text-navy hover:scale-105 shadow-xl"
              >
                Réserver maintenant
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-champagne/10 fade-slide-up">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-champagne mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="font-serif text-3xl text-navy mb-6">
                Redirection en cours...
              </h2>
              <p className="font-sans text-lg text-navy/70 leading-relaxed">
                Vous serez redirigé(e) vers notre page de réservation sécurisée...
              </p>
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

      {/* Process Overview */}
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