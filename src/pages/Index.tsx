import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';
import OptimizedImage from '../components/OptimizedImage';

const Index = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/lovable-uploads/6254dd8b-8e1d-44e8-af43-adb58b41fa97.png',
      '/lovable-uploads/88c2ef1d-431e-419a-ba66-607284097b92.png',
      '/lovable-uploads/b7d5454b-f7aa-42e9-a591-a5636043dad3.png',
      '/lovable-uploads/4c0ac742-ef06-42c2-b9f0-b01290af4dd2.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Add hero text animation classes on load
    const heroLines = document.querySelectorAll('.hero-text-line');
    heroLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('animate');
      }, 100 + index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <LuxuryAnimations />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with static positioning */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/lovable-uploads/6254dd8b-8e1d-44e8-af43-adb58b41fa97.png')`,
            backgroundPosition: 'center top'
          }}
        >
          <div className="hero-overlay"></div>
        </div>
        
        {/* Hero Content with larger text */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }} 
            className="hero-text-line font-serif text-8xl md:text-[12rem] font-bold text-ivory mb-6"
          >
            élégance
          </h1>
          <h2 
            style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.6)' }} 
            className="hero-text-line font-serif text-6xl md:text-8xl text-ivory/95 mb-8"
          >
            intemporelle
          </h2>
          <h3 
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }} 
            className="hero-text-line font-serif text-4xl md:text-6xl text-ivory/90 mb-12"
          >
            incarnée
          </h3>
          
          <div className="hero-text-line space-y-4">
            <div className="inline-block">
              <p className="font-sans text-2xl md:text-3xl text-ivory mb-8 italic">
                Robes de mariée conçues pour vous.
              </p>
              <div className="space-y-4">
                <Link to="/collection" className="inline-block luxury-button mr-4">
                  Découvrez la collection
                </Link>
                <Link 
                  to="/book-appointment" 
                  className="inline-block bg-champagne text-navy px-8 py-4 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-gold hover:scale-105 shadow-lg"
                >
                  Book Your Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-24 bg-soft-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-serif text-9xl md:text-[12rem] text-champagne/10 font-bold select-none">
                Lien
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10 max-w-4xl mx-auto">
              <blockquote className="fade-slide-up font-serif text-2xl md:text-3xl lg:text-4xl text-navy leading-relaxed mb-12">
                "Chaque robe raconte une histoire d'amour unique, et nous sommes honorés de 
                participer à la vôtre."
              </blockquote>
              
              <div className="animated-separator mb-8"></div>
              
              <p className="fade-slide-up font-sans text-lg text-navy/70 mb-8 max-w-2xl mx-auto tracking-[1.2px] uppercase">
                Histoire
              </p>
              
              <div className="fade-slide-up">
                <Link to="/histoire" className="inline-block luxury-button-outline">
                  Notre Histoire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-6">collection</h2>
            <p className="fade-slide-up font-sans text-lg text-navy/70 max-w-3xl mx-auto leading-relaxed">
              Un univers de grâce et de beauté, Découvrez notre collection, une symphonie enchantée. 
              Des robes qui célèbrent l'amour et l'élégance, Laissez-vous séduire par leur magie, sans résistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: "/lovable-uploads/88c2ef1d-431e-419a-ba66-607284097b92.png",
                title: "Étoile Azure - Plumes et Éclats"
              },
              {
                image: "/lovable-uploads/b7d5454b-f7aa-42e9-a591-a5636043dad3.png",
                title: "Symphonie Dorée - Éclat Halter"
              },
              {
                image: "/lovable-uploads/4c0ac742-ef06-42c2-b9f0-b01290af4dd2.png",
                title: "Romance Printanière - Dentelle Pure"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="fade-slide-up gallery-card group relative overflow-hidden bg-white shadow-lg" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <OptimizedImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  aspectRatio="[3/4]"
                  priority={index === 0}
                />
                <div className="overlay">
                  <div className="overlay-content">
                    <h3 className="font-serif text-xl text-ivory mb-2">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm text-ivory/80 uppercase tracking-wide">
                      Découvrez
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="fade-slide-up">
              <Link to="/collection" className="inline-block luxury-button">
                Découvrez la collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;