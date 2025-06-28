import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // Scroll to top immediately when route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Update children after a brief delay for smooth transition
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : 'visible'}`}>
      {displayChildren}
    </div>
  );
};

export default PageTransition;