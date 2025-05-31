
import { useEffect } from 'react';

const LuxuryAnimations = () => {
  useEffect(() => {
    // SCROLL TO TOP ON PAGE LOAD
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Initialize scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    // Observe all fade-slide-up elements
    const animatedElements = document.querySelectorAll('.fade-slide-up');
    animatedElements.forEach((element) => observer.observe(element));

    // Observe animated separators
    const separators = document.querySelectorAll('.animated-separator');
    separators.forEach((separator) => observer.observe(separator));

    return () => observer.disconnect();
  }, []);

  return null;
};

export default LuxuryAnimations;
