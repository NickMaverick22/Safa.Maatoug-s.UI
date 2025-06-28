import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';
import { getTestimonials } from '../lib/cms-storage';
import { Testimonial } from '../types/cms';

const Avis = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getTestimonials();
        // Only show approved testimonials
        const approvedTestimonials = data.filter(t => t.status === 'approved');
        setTestimonials(approvedTestimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        // Fallback to mock data if Supabase fails
        setTestimonials([
          {
            id: '1',
            name: 'L. Dupont',
            email: 'l.dupont@email.com',
            date: 'Juin 2024',
            quote: 'Merci pour la robe parfaite ! Chaque détail était pensé, la qualité exceptionnelle. Je me suis sentie comme une princesse le jour J.',
            status: 'approved',
            submittedAt: new Date('2024-06-15')
          },
          {
            id: '2',
            name: 'M. Rousseau',
            email: 'm.rousseau@email.com',
            date: 'Mai 2024',
            quote: 'Une expérience magique du premier essayage au jour du mariage. L\'équipe a su comprendre mes envies et créer la robe de mes rêves.',
            status: 'approved',
            submittedAt: new Date('2024-05-20')
          },
          {
            id: '3',
            name: 'S. Martin',
            email: 's.martin@email.com',
            date: 'Avril 2024',
            quote: 'Artisanat d\'exception, service impeccable. Ma robe était unique, comme moi. Merci pour avoir rendu mon mariage inoubliable.',
            status: 'approved',
            submittedAt: new Date('2024-04-15')
          },
          {
            id: '4',
            name: 'A. Moreau',
            email: 'a.moreau@email.com',
            date: 'Mars 2024',
            quote: 'De la première consultation aux retouches finales, tout était parfait. L\'attention aux détails et la passion se ressentent dans chaque couture.',
            status: 'approved',
            submittedAt: new Date('2024-03-20')
          },
          {
            id: '5',
            name: 'C. Bernard',
            email: 'c.bernard@email.com',
            date: 'Février 2024',
            quote: 'Une robe qui m\'a fait vibrer dès le premier regard. L\'équipe a su transformer ma vision en réalité avec une élégance incomparable.',
            status: 'approved',
            submittedAt: new Date('2024-02-15')
          },
          {
            id: '6',
            name: 'E. Dubois',
            email: 'e.dubois@email.com',
            date: 'Janvier 2024',
            quote: 'Un service personnalisé exceptionnel. Chaque détail de ma robe reflétait parfaitement ma personnalité et mes goûts.',
            status: 'approved',
            submittedAt: new Date('2024-01-20')
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  // Generate avatar URLs for testimonials
  const getAvatarUrl = (index: number) => {
    const avatars = [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=200&auto=format&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=200&auto=format&fit=crop&crop=face"
    ];
    return avatars[index % avatars.length];
  };

  // Split testimonials into two rows for animation
  const firstRowTestimonials = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRowTestimonials = testimonials.slice(Math.ceil(testimonials.length / 2));

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-64 pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne mx-auto mb-4"></div>
            <p className="font-sans text-navy/70">Chargement des témoignages...</p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Two-Row Animated Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-soft-beige overflow-hidden">
          <div className="space-y-8">
            {/* First Row - Scrolling Left to Right */}
            {firstRowTestimonials.length > 0 && (
              <div 
                className="testimonials-scroll-right flex gap-6"
                style={{
                  animationPlayState: isPaused ? 'paused' : 'running'
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Duplicate testimonials for seamless loop */}
                {[...firstRowTestimonials, ...firstRowTestimonials, ...firstRowTestimonials].map((testimonial, index) => (
                  <div key={`row1-${testimonial.id}-${index}`} className="testimonial-card flex-shrink-0 w-72">
                    <div className="bg-ivory rounded-lg p-6 shadow-lg h-full flex flex-col">
                      {/* Avatar */}
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.avatar || getAvatarUrl(index)}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-champagne mr-3"
                        />
                        <div>
                          <p className="font-sans font-semibold text-navy text-base">
                            {testimonial.name}
                          </p>
                          <p className="font-sans text-navy/60 text-xs uppercase tracking-[1.2px]">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="font-serif text-base text-navy leading-relaxed italic flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Second Row - Scrolling Right to Left */}
            {secondRowTestimonials.length > 0 && (
              <div 
                className="testimonials-scroll-left flex gap-6"
                style={{
                  animationPlayState: isPaused ? 'paused' : 'running'
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Duplicate testimonials for seamless loop */}
                {[...secondRowTestimonials, ...secondRowTestimonials, ...secondRowTestimonials].map((testimonial, index) => (
                  <div key={`row2-${testimonial.id}-${index}`} className="testimonial-card flex-shrink-0 w-72">
                    <div className="bg-ivory rounded-lg p-6 shadow-lg h-full flex flex-col">
                      {/* Avatar */}
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.avatar || getAvatarUrl(index + firstRowTestimonials.length)}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-champagne mr-3"
                        />
                        <div>
                          <p className="font-sans font-semibold text-navy text-base">
                            {testimonial.name}
                          </p>
                          <p className="font-sans text-navy/60 text-xs uppercase tracking-[1.2px]">
                            {testimonial.date}
                          </p>
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="font-serif text-base text-navy leading-relaxed italic flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Add Testimonial Section */}
      <section className="py-16 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-soft-beige rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="mb-8">
              <svg className="w-16 h-16 mx-auto mb-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              
              <h3 className="fade-slide-up font-serif text-3xl md:text-4xl text-navy mb-4">
                Partagez votre expérience
              </h3>
              <div className="animated-separator mx-auto mb-6"></div>
              
              <p className="fade-slide-up font-sans text-lg text-navy/70 leading-relaxed max-w-2xl mx-auto mb-8">
                Vous avez vécu une expérience exceptionnelle avec nous ? Nous serions honorés de connaître votre histoire 
                et de la partager avec nos futures mariées.
              </p>
            </div>

            <div className="fade-slide-up">
              <Link
                to="/submit-testimonial"
                className="bg-navy text-ivory px-8 py-4 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-champagne hover:text-navy hover:scale-105 shadow-lg inline-flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter mon témoignage
              </Link>
            </div>

            <div className="mt-6 text-sm text-navy/60 font-sans">
              <p>Votre témoignage sera examiné avant publication</p>
            </div>
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
            <Link
              to="/book-appointment"
              className="bg-champagne text-navy px-8 py-4 rounded-full font-sans font-medium tracking-[1.2px] uppercase text-sm transition-all duration-300 hover:bg-gold hover:scale-105 shadow-lg inline-block"
            >
              Book Your Appointment
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Avis;