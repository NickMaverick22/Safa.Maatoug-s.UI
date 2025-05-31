
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Avis = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "L. Dupont",
      date: "Juin 2024",
      quote: "Merci pour la robe parfaite ! Chaque détail était pensé, la qualité exceptionnelle. Je me suis sentie comme une princesse le jour J.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "M. Rousseau",
      date: "Mai 2024",
      quote: "Une expérience magique du premier essayage au jour du mariage. L'équipe a su comprendre mes envies et créer la robe de mes rêves.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "S. Martin",
      date: "Avril 2024",
      quote: "Artisanat d'exception, service impeccable. Ma robe était unique, comme moi. Merci pour avoir rendu mon mariage inoubliable.",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "A. Moreau",
      date: "Mars 2024",
      quote: "De la première consultation aux retouches finales, tout était parfait. La attention aux détails et la passion se ressentent dans chaque couture.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "C. Bernard",
      date: "Février 2024",
      quote: "Une robe qui m'a fait vibrer dès le premier regard. L'équipe a su transformer ma vision en réalité avec une élégance incomparable.",
      avatar: "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative mb-12">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <span className="font-serif text-8xl md:text-[10rem] lg:text-[12rem] text-champagne/5 font-bold select-none">
                éternelle
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="font-serif text-5xl md:text-6xl text-navy mb-8">
                Avis
              </h1>
              
              <p className="font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto">
                Les témoignages de nos mariées nous touchent profondément. 
                Découvrez leurs expériences et laissez-vous inspirer par leurs histoires d'amour uniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-24 bg-soft-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <div className="max-w-4xl mx-auto text-center">
                      {/* Avatar */}
                      <div className="mb-8">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-champagne shadow-lg"
                        />
                      </div>

                      {/* Quote */}
                      <blockquote className="font-serif text-2xl md:text-3xl text-navy leading-relaxed mb-8 italic">
                        "{testimonial.quote}"
                      </blockquote>

                      {/* Attribution */}
                      <div className="space-y-2">
                        <p className="font-sans font-semibold text-champagne text-lg">
                          {testimonial.name}
                        </p>
                        <p className="font-sans text-navy/60 text-sm uppercase tracking-wide">
                          {testimonial.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-navy hover:text-champagne transition-colors duration-300 bg-ivory/80 backdrop-blur-sm rounded-full p-3 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-navy hover:text-champagne transition-colors duration-300 bg-ivory/80 backdrop-blur-sm rounded-full p-3 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-12 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-champagne' : 'bg-champagne/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-8">
            Votre histoire commence ici
          </h2>
          <p className="font-sans text-xl text-navy/70 leading-relaxed mb-12">
            Rejoignez nos mariées comblées et vivez l'expérience d'une création sur mesure. 
            Chaque robe raconte une histoire d'amour unique.
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="luxury-button"
          >
            Contactez-nous
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Avis;
