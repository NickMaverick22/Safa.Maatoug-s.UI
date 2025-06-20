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
      image: '/lovable-uploads/88c2ef1d-431e-419a-ba66-607284097b92.png',
      name: 'Étoile Azure',
      fabric: 'Plumes véritables, paillettes brodées main',
      colors: 'Bleu céleste, Argent',
      description: 'Une création audacieuse aux manches plumes spectaculaires, sublimée par des broderies perlées d\'exception.',
      category: 'Haute Couture'
    },
    {
      id: 2,
      image: '/lovable-uploads/6254dd8b-8e1d-44e8-af43-adb58b41fa97.png',
      name: 'Lumière Champagne',
      fabric: 'Tulle brodé, paillettes dorées',
      colors: 'Champagne, Or pâle',
      description: 'Silhouette majestueuse aux détails scintillants, rehaussée de broderies précieuses ton sur ton.',
      category: 'Cérémonie'
    },
    {
      id: 3,
      image: '/lovable-uploads/2c7222b1-a23a-4739-8373-3dfadc9633e5.png',
      name: 'Grâce Perlée',
      fabric: 'Dentelle française, perles fines',
      colors: 'Blanc nacré, Ivoire',
      description: 'Élégance intemporelle dans une silhouette épaules dénudées, ornée de perles délicates.',
      category: 'Mariage Civil'
    },
    {
      id: 4,
      image: '/lovable-uploads/1e066b73-bcc6-4941-89b2-4fccd4acdc32.png',
      name: 'Constellation Dorée',
      fabric: 'Mikado, broderies métallisées',
      colors: 'Champagne doré, Bronze',
      description: 'Une ode à la sophistication avec ses lignes épurées et ses détails géométriques raffinés.',
      category: 'Haute Couture'
    },
    {
      id: 5,
      image: '/lovable-uploads/8630b707-80e4-4ccb-a99e-6ab29491ce9e.png',
      name: 'Éclat Noir',
      fabric: 'Crêpe stretch, ceinture cristal',
      colors: 'Noir profond, Argent',
      description: 'Sophistication moderne dans une silhouette épurée, rehaussée d\'une ceinture ornementée.',
      category: 'Cérémonie'
    },
    {
      id: 6,
      image: '/lovable-uploads/4c0ac742-ef06-42c2-b9f0-b01290af4dd2.png',
      name: 'Romance Printanière',
      fabric: 'Dentelle Chantilly, tulle brodé',
      colors: 'Blanc pur, Ivoire',
      description: 'Fraîcheur romantique dans une création mi-longue, parfaite pour une cérémonie intime.',
      category: 'Mariage Civil'
    },
    {
      id: 7,
      image: '/lovable-uploads/751c5221-23b0-45db-ae85-970443bf024e.png',
      name: 'Soleil d\'Or',
      fabric: 'Tulle volumé, broderies dorées',
      colors: 'Jaune soleil, Or',
      description: 'Création spectaculaire aux volumes généreux, illuminée de broderies précieuses.',
      category: 'Haute Couture'
    },
    {
      id: 8,
      image: '/lovable-uploads/b7d5454b-f7aa-42e9-a591-a5636043dad3.png',
      name: 'Symphonie Argentée',
      fabric: 'Brocart métallisé, col halter',
      colors: 'Argent, Platine',
      description: 'Sophistication moderne dans une silhouette halter, rehaussée de motifs géométriques précieux.',
      category: 'Cérémonie'
    },
    {
      id: 9,
      image: '/lovable-uploads/f231d151-f79a-45c9-99b4-aff96b6b9a6b.png',
      name: 'Royauté Scintillante',
      fabric: 'Brocart doré, col montant brodé',
      colors: 'Argent, Or, Platine',
      description: 'Création royale aux détails somptueux, incarnant l\'excellence de la haute couture.',
      category: 'Haute Couture'
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
    dresses.filter(dress => dress.category === selectedFilter);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <p className="font-sans text-sm text-navy/70 tracking-wide mb-1">{dress.fabric}</p>
                    <p className="font-sans text-xs text-champagne uppercase tracking-wider">{dress.category}</p>
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
            <a
              href="/book-appointment"
              className="bg-champagne text-navy px-8 py-4 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-gold hover:scale-105 shadow-lg inline-block fade-slide-up"
            >
              Book Your Appointment
            </a>
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