import { useEffect } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';

const LuxuryAnimations = () => {
  // Use the scroll to top hook
  useScrollToTop();

  useEffect(() => {
    // Initialize scroll-triggered animations with enhanced performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add staggered animation delay
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' // Trigger animation earlier
      }
    );

    // Observe all fade-slide-up elements
    const animatedElements = document.querySelectorAll('.fade-slide-up');
    animatedElements.forEach((element) => observer.observe(element));

    // Observe animated separators
    const separators = document.querySelectorAll('.animated-separator');
    separators.forEach((separator) => observer.observe(separator));

    // Enhanced scroll reveal for other elements
    const scrollRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            scrollRevealObserver.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    // Observe scroll reveal elements
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    scrollRevealElements.forEach((element) => scrollRevealObserver.observe(element));

    // Cleanup
    return () => {
      observer.disconnect();
      scrollRevealObserver.disconnect();
    };
  }, []);

  return null;
};

export default LuxuryAnimations;