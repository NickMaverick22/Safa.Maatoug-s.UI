
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const Index = () => {
  useEffect(() => {
    // Add hero text animation classes on load
    const heroLines = document.querySelectorAll('.hero-text-line');
    heroLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('animate');
      }, 200 + (index * 200));
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <LuxuryAnimations />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Ken Burns effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=2070&auto=format&fit=crop')`,
            animation: 'ken-burns 20s ease-in-out infinite alternate'
          }}
        >
          <div className="hero-overlay"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="hero-text-line font-serif text-6xl md:text-8xl font-bold text-ivory mb-6">
            élégance
          </h1>
          <h2 className="hero-text-line font-serif text-4xl md:text-6xl text-ivory/90 mb-8">
            intemporelle
          </h2>
          <h3 className="hero-text-line font-serif text-2xl md:text-4xl text-ivory/80 mb-12">
            incarnée
          </h3>
          
          <div className="hero-text-line space-y-4">
            <p className="font-sans text-xl md:text-2xl text-ivory/90 mb-8 italic">
              Robes de mariée conçues pour vous.
            </p>
            <Link 
              to="/collection"
              className="inline-block luxury-button"
            >
              Découvrez la collection
            </Link>
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
                <Link 
                  to="/histoire"
                  className="inline-block luxury-button-outline"
                >
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
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop",
                title: "Élégance intemporelle incarnée"
              },
              {
                image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2070&auto=format&fit=crop",
                title: "Romance sublimée"
              },
              {
                image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=2070&auto=format&fit=crop",
                title: "Une robe qui captivera tous les regards"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="fade-slide-up gallery-card group relative overflow-hidden bg-white shadow-lg"
                style={{animationDelay: `${index * 200}ms`}}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
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
              <Link 
                to="/collection"
                className="inline-block luxury-button"
              >
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
