import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const ThankYouTestimonial = () => {
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
                Merci
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <div className="fade-slide-up mb-8">
                <svg className="w-20 h-20 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                Merci infiniment
              </h1>
              <div className="animated-separator mx-auto"></div>
              
              <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto mt-8">
                Votre témoignage nous touche profondément et nous honore de votre confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-soft-beige rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <div className="mb-8">
              <h2 className="fade-slide-up font-serif text-3xl md:text-4xl text-navy mb-6">
                Votre témoignage a été reçu
              </h2>
              
              <div className="fade-slide-up space-y-6 text-lg text-navy/80 leading-relaxed">
                <p className="font-sans">
                  Nous avons bien reçu votre précieux témoignage et nous vous en remercions du fond du cœur. 
                  Chaque mot que vous partagez nous inspire et nous motive à continuer d'offrir l'excellence 
                  que vous méritez.
                </p>
                
                <p className="font-sans">
                  Votre témoignage est maintenant visible sur notre page d'avis, permettant à d'autres 
                  futures mariées de découvrir votre expérience unique avec nous.
                </p>
              </div>
            </div>

            {/* Process Information */}
            <div className="fade-slide-up bg-ivory rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-sans text-navy font-medium">Votre témoignage est publié</span>
              </div>
              <div className="text-sm text-navy/70 font-sans space-y-2">
                <p>• Votre témoignage est maintenant visible sur notre site</p>
                <p>• Il apparaît sur notre page d'avis</p>
                <p>• Merci de partager votre expérience avec nous</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fade-slide-up flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/avis"
                className="bg-navy text-ivory px-8 py-3 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-champagne hover:text-navy hover:scale-105 shadow-lg"
              >
                Voir tous les avis
              </Link>
              <Link
                to="/"
                className="bg-ivory text-navy px-8 py-3 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm border-2 border-navy transition-all duration-300 hover:bg-soft-beige hover:scale-105"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Message */}
      <section className="py-16 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-slide-up">
            <h3 className="font-serif text-2xl md:text-3xl text-navy mb-6">
              Continuons à créer ensemble
            </h3>
            <p className="font-sans text-lg text-navy/70 leading-relaxed mb-8 max-w-2xl mx-auto">
              Votre satisfaction est notre plus belle récompense. N'hésitez pas à nous contacter 
              si vous avez d'autres projets ou si vous souhaitez recommander nos services.
            </p>
            <Link
              to="/contact"
              className="bg-champagne text-navy px-8 py-3 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-gold hover:scale-105 shadow-lg inline-block"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYouTestimonial;