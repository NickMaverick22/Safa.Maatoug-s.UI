import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const AppointmentConfirmation = () => {
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
                Confirmé
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <div className="fade-slide-up mb-8">
                <svg className="w-20 h-20 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                Rendez-vous réservé
              </h1>
              <div className="animated-separator mx-auto"></div>
              
              <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto mt-8">
                Votre demande de rendez-vous a été enregistrée avec succès.
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
                Confirmation en cours
              </h2>
              
              <div className="fade-slide-up space-y-6 text-lg text-navy/80 leading-relaxed">
                <p className="font-sans">
                  Nous avons bien reçu votre demande de rendez-vous et nous vous en remercions. 
                  Notre équipe va examiner votre demande et vous contacter très prochainement 
                  pour confirmer les détails de votre consultation.
                </p>
                
                <p className="font-sans font-medium text-navy">
                  Vous recevrez un email de confirmation ou un appel téléphonique 
                  dans les 24 heures suivant votre demande.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="fade-slide-up bg-ivory rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-sans text-navy font-medium">Prochaines étapes</span>
              </div>
              <div className="text-sm text-navy/70 font-sans space-y-2">
                <p>• Vérification de votre demande par notre équipe</p>
                <p>• Confirmation par email ou téléphone sous 24h</p>
                <p>• Préparation personnalisée de votre consultation</p>
                <p>• Rappel 24h avant votre rendez-vous</p>
              </div>
            </div>

            {/* What to Expect */}
            <div className="fade-slide-up bg-ivory rounded-xl p-6 mb-8">
              <h3 className="font-sans font-semibold text-navy mb-4">À quoi s'attendre lors de votre consultation</h3>
              <div className="text-sm text-navy/70 font-sans space-y-2 text-left max-w-2xl mx-auto">
                <p>• <strong>Accueil personnalisé</strong> dans notre atelier privé</p>
                <p>• <strong>Discussion approfondie</strong> sur vos envies et votre vision</p>
                <p>• <strong>Présentation de nos créations</strong> et échantillons de tissus</p>
                <p>• <strong>Prise de mesures préliminaires</strong> si nécessaire</p>
                <p>• <strong>Devis personnalisé</strong> et planning de création</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fade-slide-up flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/collection"
                className="bg-navy text-ivory px-8 py-3 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-champagne hover:text-navy hover:scale-105 shadow-lg"
              >
                Découvrir la collection
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

      {/* Contact Information */}
      <section className="py-16 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-slide-up">
            <h3 className="font-serif text-2xl md:text-3xl text-navy mb-6">
              Une question en attendant ?
            </h3>
            <p className="font-sans text-lg text-navy/70 leading-relaxed mb-8 max-w-2xl mx-auto">
              Si vous avez des questions urgentes ou souhaitez modifier votre demande, 
              n'hésitez pas à nous contacter directement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-champagne text-navy px-8 py-3 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-gold hover:scale-105 shadow-lg"
              >
                Nous contacter
              </Link>
              <a
                href="https://wa.me/21651519222"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-8 py-3 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-[#20BA5A] hover:scale-105 shadow-lg inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AppointmentConfirmation;