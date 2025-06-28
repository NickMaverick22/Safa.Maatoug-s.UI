import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/histoire', label: 'Histoire' },
    { href: '/collection', label: 'Collection' },
    { href: '/avis', label: 'Avis' },
    { href: '/contact', label: 'Contact' }
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    // Ensure scroll to top on navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? 'bg-ivory/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)]' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex-shrink-0 transition-all duration-300 hover:scale-105"
              onClick={handleLinkClick}
            >
              <img 
                src="/lovable-uploads/bdb13012-59ce-422b-8158-5a780a8fa555.png" 
                alt="Safa Maatoug Logo" 
                className="h-12 w-auto transition-all duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={`nav-link font-sans font-medium text-sm tracking-[1.2px] uppercase transition-all duration-300 ${
                      location.pathname === item.href ? 'text-champagne' : 'text-navy hover:text-champagne'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-navy hover:text-champagne transition-all duration-300 p-2"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-ivory/95 backdrop-blur-sm border-t border-champagne/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`block px-3 py-3 font-sans font-medium text-sm tracking-[1.2px] uppercase transition-all duration-300 rounded-lg ${
                    location.pathname === item.href ? 'text-champagne bg-soft-beige' : 'text-navy hover:text-champagne hover:bg-soft-beige'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Contact Button */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Link
          to="/contact"
          onClick={handleLinkClick}
          className="bg-navy text-ivory p-4 rounded-full shadow-lg hover:bg-champagne hover:text-navy transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-[0_0_20px_rgba(199,166,122,0.4)]"
          aria-label="Contact"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default Navigation;