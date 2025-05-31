
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-soft-beige border-t border-champagne/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* La Marque */}
          <div>
            <h3 className="font-sans font-semibold text-navy text-sm tracking-wide uppercase mb-4">
              La Marque
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/histoire" 
                  className="text-navy/70 hover:text-champagne transition-colors duration-300 font-sans text-sm"
                >
                  histoire
                </Link>
              </li>
            </ul>
          </div>

          {/* La Collection */}
          <div>
            <h3 className="font-sans font-semibold text-navy text-sm tracking-wide uppercase mb-4">
              La Collection
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/collection" 
                  className="text-navy/70 hover:text-champagne transition-colors duration-300 font-sans text-sm"
                >
                  collection
                </Link>
              </li>
              <li>
                <Link 
                  to="/avis" 
                  className="text-navy/70 hover:text-champagne transition-colors duration-300 font-sans text-sm"
                >
                  avis
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h3 className="font-sans font-semibold text-navy text-sm tracking-wide uppercase mb-4">
              Service Client
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-navy/70 hover:text-champagne transition-colors duration-300 font-sans text-sm"
                >
                  termes et conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-navy/70 hover:text-champagne transition-colors duration-300 font-sans text-sm"
                >
                  politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-navy/60 font-sans text-sm mb-4 md:mb-0">
            Copyright © 2025 Safa Maatoug. Tous droits réservés.
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-navy hover:text-champagne transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="text-navy hover:text-champagne transition-colors duration-300"
              aria-label="Pinterest"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.244-2.84 3.244-1.232 0-2.41-.632-2.41-1.996 0-.734.263-1.321.669-1.781.33-.373.903-.634 1.436-.634.99 0 1.409.816 1.409 1.585 0 1.205-.816 2.013-2.003 2.013-.721 0-1.286-.4-1.286-1.004 0-.721.486-1.425 1.124-1.425.357 0 .598.188.598.598 0 .304-.263.486-.598.486-.188 0-.304-.082-.304-.263 0-.082.082-.188.188-.188.082 0 .188.082.188.188 0 .357-.263.598-.598.598-.598 0-.998-.486-.998-1.082 0-.816.598-1.425 1.425-1.425.998 0 1.781.816 1.781 1.996 0 1.425-1.124 2.474-2.685 2.474-1.858 0-3.244-1.321-3.244-3.321 0-2.216 1.781-4.003 4.003-4.003 2.216 0 4.003 1.787 4.003 4.003 0 .411-.082.816-.188 1.205z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
