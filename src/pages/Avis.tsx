import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';

const Avis = () => {
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "L. Dupont",
      date: "Juin 2024",
      quote: "Merci pour la robe parfaite ! Chaque détail était pensé, la qualité exceptionnelle. Je me suis sentie comme une princesse le jour J.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "M. Rousseau",
      date: "Mai 2024",
      quote: "Une expérience magique du premier essayage au jour du mariage. L'équipe a su comprendre mes envies et créer la robe de mes rêves.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "S. Martin",
      date: "Avril 2024",
      quote: "Artisanat d'exception, service impeccable. Ma robe était unique, comme moi. Merci pour avoir rendu mon mariage inoubliable.",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "A. Moreau",
      date: "Mars 2024",
      quote: "De la première consultation aux retouches finales, tout était parfait. L'attention aux détails et la passion se ressentent dans chaque couture.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "C. Bernard",
      date: "Février 2024",
      quote: "Une robe qui m'a fait vibrer dès le premier regard. L'équipe a su transformer ma vision en réalité avec une élégance incomparable.",
      avatar: "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=200&auto=format&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "E. Dubois",
      date: "Janvier 2024", 
      quote: "Un service personnalisé exceptionnel. Chaque détail de ma robe reflétait parfaitement ma personnalité et mes goûts.",
      avatar: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=200&auto=format&fit=crop&crop=face"
    }
  ];

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
                éternelle
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8 stroke-fill-animation">
                Avis
              </h1>
              <div className="animated-separator mx-auto"></div>
              
              <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto mt-8">
                Les témoignages de nos mariées nous touchent profondément. 
                Découvrez leurs expériences et laissez-vous inspirer par leurs histoires d'amour uniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Testimonials Carousel */}
      <section className="py-24 bg-soft-beige overflow-hidden">
        <div className="max-w-full">
          <div 
            className="testimonials-scroll flex gap-8 animate-scroll"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="testimonial-card flex-shrink-0 w-80 md:w-96">
                <div className="bg-ivory rounded-lg p-8 shadow-lg h-full flex flex-col">
                  {/* Avatar */}
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-champagne mr-4"
                    />
                    <div>
                      <p className="font-sans font-semibold text-navy text-lg">
                        {testimonial.name}
                      </p>
                      <p className="font-sans text-navy/60 text-sm uppercase tracking-[1.2px]">
                        {testimonial.date}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="font-serif text-lg text-navy leading-relaxed italic flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="fade-slide-up font-serif text-4xl md:text-5xl text-navy mb-8">
            Votre histoire commence ici
          </h2>
          <div className="animated-separator mx-auto mb-8"></div>
          <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed mb-12">
            Rejoignez nos mariées comblées et vivez l'expérience d'une création sur mesure. 
            Chaque robe raconte une histoire d'amour unique.
          </p>
          <div className="fade-slide-up">
            <a
              href="/book-appointment"
              className="bg-champagne text-navy px-8 py-4 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-gold hover:scale-105 shadow-lg inline-block"
            >
              Book Your Appointment
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Avis;