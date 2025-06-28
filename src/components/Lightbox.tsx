import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface LightboxProps {
  images: Array<{
    id: number;
    image: string;
    name: string;
    fabric: string;
    colors: string;
    description: string;
  }>;
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNavigate
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
      } else if (e.key === 'ArrowRight') {
        onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <div className={`lightbox ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-ivory hover:text-champagne transition-colors duration-300 text-2xl"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <img
              src={currentImage.image}
              alt={currentImage.name}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>

          {/* Details */}
          <div className="text-ivory space-y-6 flex flex-col justify-center lightbox-caption">
            <div>
              <h2 className="font-serif text-3xl mb-4">
                {currentImage.name}
              </h2>
              <p className="font-sans text-lg leading-relaxed mb-6">
                {currentImage.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-sans font-semibold text-champagne uppercase tracking-wide text-sm mb-2">
                  Matières
                </h3>
                <p className="font-sans text-ivory/90">
                  {currentImage.fabric}
                </p>
              </div>

              <div>
                <h3 className="font-sans font-semibold text-champagne uppercase tracking-wide text-sm mb-2">
                  Couleurs disponibles
                </h3>
                <p className="font-sans text-ivory/90">
                  {currentImage.colors}
                </p>
              </div>

              <div>
                <h3 className="font-sans font-semibold text-champagne uppercase tracking-wide text-sm mb-2">
                  Personnalisation
                </h3>
                <p className="font-sans text-ivory/90">
                  Toutes nos créations peuvent être adaptées à vos mesures et préférences.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/book-appointment"
                className="luxury-button"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ivory hover:text-champagne transition-colors duration-300 opacity-0 hover:opacity-100"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-ivory hover:text-champagne transition-colors duration-300 opacity-0 hover:opacity-100"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Lightbox;