
import React, { useEffect } from 'react';

const LuxuryAnimations = () => {
  useEffect(() => {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.25,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with fade-slide-up class
    const animatedElements = document.querySelectorAll('.fade-slide-up');
    animatedElements.forEach((el) => observer.observe(el));

    // Observe animated separators
    const separators = document.querySelectorAll('.animated-separator');
    separators.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default LuxuryAnimations;
