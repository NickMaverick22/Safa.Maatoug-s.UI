
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const Contact = () => {
  const [showToast, setShowToast] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('contact@safamaatoug.com');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/21629646000', '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <LuxuryAnimations />
      
      {/* Header Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative mb-12">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <span className="font-serif text-6xl md:text-[8rem] lg:text-[10rem] text-champagne/5 font-bold select-none">
                Style & beauté
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                Service Client
              </h1>
              <div className="animated-separator mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-soft-beige rounded-lg p-12 md:p-16 text-center">
            <div className="mb-12">
              <h2 className="fade-slide-up font-serif text-3xl md:text-4xl text-navy mb-8">
                Prenez rendez-vous
              </h2>
              <p className="fade-slide-up font-sans text-lg md:text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto">
                Pour toute demande d'information, prise de rendez-vous ou essayage sur mesure, 
                contactez-nous directement via WhatsApp ou par email.
              </p>
            </div>

            {/* Contact Options */}
            <div className="fade-slide-up mb-12 space-y-6">
              <button 
                onClick={handleWhatsAppContact}
                className="luxury-button block w-full max-w-md mx-auto mb-4"
              >
                📱 Contactez-nous sur WhatsApp
              </button>
              
              <div className="text-navy/60">ou</div>
              
              <button 
                onClick={handleEmailClick}
                className="email-button text-lg px-12 py-4"
              >
                contact@safamaatoug.com
              </button>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <div className="fade-slide-up">
                <div className="mb-6">
                  <svg className="w-8 h-8 mx-auto mb-4 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-serif text-xl text-navy mb-3">
                    Horaires d'ouverture
                  </h3>
                  <div className="font-sans text-navy/70 space-y-1">
                    <p>Lundi - Vendredi: 9h00 - 18h00</p>
                    <p>Samedi: 10h00 - 17h00</p>
                    <p>Dimanche: Sur rendez-vous uniquement</p>
                  </div>
                </div>
              </div>

              <div className="fade-slide-up">
                <div className="mb-6">
                  <svg className="w-8 h-8 mx-auto mb-4 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="font-serif text-xl text-navy mb-3">
                    Atelier
                  </h3>
                  <div className="font-sans text-navy/70 space-y-1">
                    <p>Paris, France</p>
                    <p>Rendez-vous sur demande</p>
                    <p>Essayages privés disponibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Information */}
      <section className="py-24 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="fade-slide-up font-serif text-4xl md:text-5xl text-navy mb-8">
              Nos Services
            </h2>
            <div className="animated-separator mx-auto mb-8"></div>
            <p className="fade-slide-up font-sans text-lg text-navy/70 max-w-3xl mx-auto">
              Découvrez notre gamme complète de services haute couture, 
              conçus pour vous offrir une expérience exceptionnelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Création sur mesure",
                description: "Conception entièrement personnalisée selon vos désirs et morphologie unique."
              },
              {
                icon: (
                  <svg className="w-12 h-12 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Essayages privés",
                description: "Séances d'essayage exclusives dans notre atelier pour un service personnalisé."
              },
              {
                icon: (
                  <svg className="w-12 h-12 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Retouches finales",
                description: "Ajustements de dernière minute pour une coupe parfaite le jour J."
              }
            ].map((service, index) => (
              <div key={index} className="fade-slide-up text-center bg-soft-beige p-8 rounded-lg hover:shadow-lg transition-shadow duration-300" style={{animationDelay: `${index * 200}ms`}}>
                <div className="transform hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-serif text-xl text-navy mb-4">
                  {service.title}
                </h3>
                <p className="font-sans text-navy/70 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="fade-slide-up font-serif text-4xl md:text-5xl text-navy mb-8">
              Questions fréquentes
            </h2>
            <div className="animated-separator mx-auto"></div>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "Quel est le délai de création d'une robe sur mesure ?",
                answer: "Le processus de création prend généralement entre 4 à 6 mois, incluant les consultations, la conception, la confection et les essayages."
              },
              {
                question: "Combien d'essayages sont nécessaires ?",
                answer: "Nous prévoyons généralement 3 à 5 séances d'essayage pour garantir un ajustement parfait, selon la complexité de la création."
              },
              {
                question: "Proposez-vous des retouches après livraison ?",
                answer: "Oui, nous incluons les retouches mineures dans nos services. Des ajustements plus importants peuvent être facturés séparément."
              },
              {
                question: "Puis-je voir des échantillons de tissus avant de commencer ?",
                answer: "Absolument. Lors de votre première consultation, nous vous présenterons une sélection de tissus et matériaux premium."
              }
            ].map((faq, index) => (
              <div key={index} className="fade-slide-up border-b border-champagne/20 pb-6" style={{animationDelay: `${index * 150}ms`}}>
                <h3 className="font-serif text-xl text-navy mb-3">
                  {faq.question}
                </h3>
                <p className="font-sans text-navy/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        Email copié!
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
