import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Lightbox from '../components/Lightbox';
import LuxuryAnimations from '../components/LuxuryAnimations';

const Collection = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState('toutes');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const collections = [
    {
      id: 1,
      name: "Robe 'Étoile d'Auréole'",
      category: "haute-couture",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=2070&auto=format&fit=crop",
      fabric: "Dentelle française et soie sauvage",
      colors: "Ivoire, Champagne, Blush",
      description: "Une création d'exception alliant la délicatesse de la dentelle française à l'éclat d'un bustier brodé de perles. Cette robe incarne l'élégance absolue."
    },
    {
      id: 2,
      name: "Robe 'Romance Éternelle'",
      category: "ceremonie",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop",
      fabric: "Tulle brodé et mikado",
      colors: "Ivoire, Perle, Nude",
      description: "Cette robe sublime allie modernité et tradition avec son bustier structuré et sa jupe vaporeuse en tulle brodé de motifs floraux."
    },
    {
      id: 3,
      name: "Robe 'Lumière Dorée'",
      category: "mariage-civil",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2070&auto=format&fit=crop",
      fabric: "Satin duchesse et organza",
      colors: "Champagne, Or pâle, Ivoire",
      description: "D'une élégance raffinée, cette robe courte en satin duchesse révèle une silhouette moderne parfaite pour un mariage civil."
    },
    {
      id: 4,
      name: "Robe 'Cristal Céleste'",
      category: "haute-couture",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070&auto=format&fit=crop",
      fabric: "Mousseline et cristaux Swarovski",
      colors: "Bleu ciel, Argenté, Blanc nacré",
      description: "Une pièce d'exception ornée de milliers de cristaux Swarovski qui captent la lumière à chaque mouvement."
    },
    {
      id: 5,
      name: "Robe 'Grâce Impériale'",
      category: "ceremonie",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
      fabric: "Dentelle de Calais et soie",
      colors: "Ivoire classique, Écru, Blanc pur",
      description: "Cette robe majestueuse avec sa traîne cathédrale en dentelle de Calais incarne la grandeur et l'élégance absolue."
    },
    {
      id: 6,
      name: "Robe 'Perle d'Orient'",
      category: "mariage-civil",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop",
      fabric: "Crêpe et perles d'eau douce",
      colors: "Rose poudré, Perle, Champagne rosé",
      description: "Une création délicate ornée de perles d'eau douce, parfaite pour une cérémonie intime et raffinée."
    }
  ];

  const filteredCollections = filter === 'toutes' 
    ? collections 
    : collections.filter(item => item.category === filter);

  const categories = [
    { key: 'toutes', label: 'Toutes' },
    { key: 'mariage-civil', label: 'Mariage Civil' },
    { key: 'ceremonie', label: 'Cérémonie' },
    { key: 'haute-couture', label: 'Haute Couture' }
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateLightbox = (index: number) => {
    setSelectedImage(index);
  };

  useEffect(() => {
    // Typing animation for intro text
    const introText = document.querySelector('.typing-text');
    if (introText) {
      setTimeout(() => {
        introText.classList.remove('typing-text');
        introText.style.borderRight = 'none';
      }, 2000);
    }
  }, []);

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
              <span className="font-serif text-8xl md:text-[10rem] lg:text-[12rem] text-champagne/5 font-bold select-none">
                collection
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                collection
              </h1>
              
              <div className="typing-text font-serif text-xl md:text-2xl text-navy/80 leading-relaxed max-w-4xl mx-auto italic">
                Un univers de grâce et de beauté, Découvrez notre collection, une symphonie enchantée. 
                Des robes qui célèbrent l'amour et l'élégance, Laissez-vous séduire par leur magie, sans résistance.
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="fade-slide-up hidden md:flex justify-center space-x-8 mb-16">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setFilter(category.key)}
                className={`nav-link font-sans font-medium text-sm tracking-[1.2px] uppercase transition-colors duration-300 pb-2 ${
                  filter === category.key 
                    ? 'text-champagne' 
                    : 'text-navy hover:text-champagne'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Mobile Filter */}
          <div className="fade-slide-up md:hidden mb-8">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full max-w-xs mx-auto bg-ivory border border-champagne rounded-lg px-4 py-2 font-sans text-navy"
            >
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCollections.map((item, index) => (
              <div 
                key={item.id} 
                className="fade-slide-up gallery-card group relative overflow-hidden bg-white shadow-lg cursor-pointer"
                style={{animationDelay: `${index * 150}ms`}}
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="overlay">
                  <div className="overlay-content">
                    <h3 className="font-serif text-xl text-ivory mb-2">
                      {item.name}
                    </h3>
                    <p className="font-sans text-sm text-ivory/80 uppercase tracking-wide">
                      Découvrez
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isLightboxOpen && selectedImage !== null && (
        <Lightbox
          images={filteredCollections}
          isOpen={isLightboxOpen}
          currentIndex={selectedImage}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}

      <Footer />
    </div>
  );
};

export default Collection;
