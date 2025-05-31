
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';
import Lightbox from '../components/Lightbox';

const Collection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('Toutes');

  const dresses = [
    {
      id: 1,
      image: '/placeholder.svg',
      name: 'Étoile d\'Auréole',
      fabric: 'Dentelle française, soie sauvage',
      colors: 'Ivoire, Champagne, Blush',
      description: 'Une création délicate alliant tradition et modernité, ornée de perles fines et de broderies d\'exception.'
    },
    {
      id: 2,
      image: '/placeholder.svg',
      name: 'Rêve de Lumière',
      fabric: 'Tulle brodé, organza',
      colors: 'Ivory, Nude',
      description: 'Silhouette romantique aux détails précieux, sublimée par des applications de cristaux Swarovski.'
    },
    {
      id: 3,
      image: '/placeholder.svg',
      name: 'Grâce Éternelle',
      fabric: 'Crêpe de soie, dentelle Chantilly',
      colors: 'Blanc pur, Champagne',
      description: 'Élégance intemporelle dans une coupe épurée, rehaussée de broderies ton sur ton.'
    },
    {
      id: 4,
      image: '/placeholder.svg',
      name: 'Symphonie Dorée',
      fabric: 'Mikado, dentelle dorée',
      colors: 'Champagne, Or pâle',
      description: 'Une ode à la féminité avec ses lignes fluides et ses détails métallisés subtilement intégrés.'
    }
  ];

  useEffect(() => {
    // Scroll reveal animation setup
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, index * 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (index: number) => {
    setCurrentImageIndex(index);
  };

  const filteredDresses = selectedFilter === 'Toutes' ? dresses : 
    dresses.filter(dress => dress.name.includes(selectedFilter));

  const filters = ['Toutes', 'Mariage Civil', 'Cérémonie', 'Haute Couture'];

  return (
    <>
      <Navigation />
      <LuxuryAnimations />
      
      <main className="min-h-screen bg-ivory pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-soft-beige to-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6 fade-slide-up">
              collection
            </h1>
            <div className="animated-separator mb-8"></div>
            <p className="font-sans text-lg md:text-xl text-navy/80 max-w-4xl mx-auto leading-relaxed fade-slide-up typing-text">
              Un univers de grâce et de beauté. Découvrez notre collection, une symphonie enchantée. 
              Des robes qui célèbrent l'amour et l'élégance, laissez-vous séduire par leur magie, sans résistance.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-20 z-30 bg-ivory/95 backdrop-blur-sm border-b border-champagne/20 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-8">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`font-sans font-medium text-sm tracking-[1.2px] uppercase transition-all duration-300 relative ${
                    selectedFilter === filter 
                      ? 'text-champagne' 
                      : 'text-navy hover:text-champagne'
                  }`}
                >
                  {filter}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
                    selectedFilter === filter ? 'w-full' : 'w-0'
                  }`}></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {filteredDresses.map((dress, index) => (
                <div
                  key={dress.id}
                  className="gallery-card fade-slide-up cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={dress.image}
                      alt={dress.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="overlay">
                      <div className="overlay-content">
                        <h3 className="font-serif text-2xl mb-2">{dress.name}</h3>
                        <p className="font-sans text-sm tracking-wide">Voir les détails</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-navy mb-2">{dress.name}</h3>
                    <p className="font-sans text-sm text-navy/70 tracking-wide">{dress.fabric}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-soft-beige">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-6 fade-slide-up">
              Créons ensemble votre robe de rêve
            </h2>
            <p className="font-sans text-lg text-navy/80 mb-8 fade-slide-up">
              Chaque création est unique et réalisée sur mesure selon vos désirs et votre morphologie.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="luxury-button fade-slide-up"
            >
              Prendre rendez-vous
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <Lightbox
        images={filteredDresses}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  );
};

export default Collection;
