
import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const Histoire = () => {
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/21629646000', '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <LuxuryAnimations />
      
      {/* Hero Banner */}
      <section className="relative h-96 md:h-[60vh] flex items-center justify-center overflow-hidden mt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <h1 className="fade-slide-up font-serif text-5xl md:text-7xl text-ivory font-bold">
            Histoire
          </h1>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-20">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <span className="font-serif text-8xl md:text-[10rem] lg:text-[12rem] text-champagne/5 font-bold select-none whitespace-nowrap">
                Lien Éternel
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="fade-slide-up mb-12">
                <h2 className="font-serif text-4xl md:text-5xl text-navy mb-4">
                  Lien Éternel
                </h2>
                <div className="animated-separator mx-auto"></div>
              </div>
              
              <div className="space-y-8 text-lg md:text-xl text-navy/80 leading-relaxed">
                <p className="fade-slide-up font-sans">
                  Née d'une passion pour l'excellence artisanale et l'élégance intemporelle, 
                  notre maison de couture célèbre l'art de sublimer chaque femme en sa plus 
                  belle version. Chaque création naît d'un dialogue unique entre la mariée 
                  et notre vision créative, où tradition et modernité se rencontrent pour 
                  donner naissance à des pièces d'exception.
                </p>
                
                <p className="fade-slide-up font-sans">
                  Dans notre atelier, chaque point, chaque perle, chaque détail est pensé 
                  et exécuté à la main par nos artisans d'exception. Nous croyons que derrière 
                  chaque robe se cache une histoire d'amour unique, et c'est cette philosophie 
                  qui guide notre création depuis nos débuts. L'excellence n'est pas un 
                  objectif, c'est notre engagement quotidien.
                </p>
              </div>
            </div>
          </div>

          {/* Atelier Images Grid - Updated with proper couture images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {[
              {
                image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2070&auto=format&fit=crop",
                title: "Couture à la main"
              },
              {
                image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?q=80&w=2070&auto=format&fit=crop",
                title: "Création artisanale"
              },
              {
                image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop",
                title: "Sélection des tissus nobles"
              },
              {
                image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2070&auto=format&fit=crop",
                title: "Broderie fine"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="fade-slide-up atelier-card group relative overflow-hidden bg-white shadow-lg rounded-lg"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-serif text-lg text-ivory">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mission & Values */}
          <div className="text-center mb-12">
            <h3 className="fade-slide-up font-serif text-3xl md:text-4xl text-navy mb-16">
              Nos Valeurs
            </h3>
            <div className="animated-separator mx-auto mb-16"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Qualité Artisanale",
                description: "Chaque robe est confectionnée à la main par nos maîtres artisans, perpétuant un savoir-faire ancestral."
              },
              {
                icon: (
                  <svg className="w-12 h-12 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3" />
                  </svg>
                ),
                title: "Écoresponsabilité",
                description: "Nous privilégions les matières nobles et durables, dans le respect de notre environnement."
              },
              {
                icon: (
                  <svg className="w-12 h-12 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Exigence du détail",
                description: "Notre obsession du détail fait de chaque création une œuvre unique et intemporelle."
              }
            ].map((value, index) => (
              <div key={index} className="fade-slide-up text-center" style={{animationDelay: `${index * 200}ms`}}>
                <div className="transform hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h4 className="font-serif text-xl text-navy mb-4">
                  {value.title}
                </h4>
                <p className="font-sans text-navy/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contact CTA with WhatsApp */}
          <div className="text-center mt-16">
            <div className="fade-slide-up">
              <button
                onClick={handleWhatsAppContact}
                className="luxury-button"
              >
                Prendre rendez-vous
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Histoire;
