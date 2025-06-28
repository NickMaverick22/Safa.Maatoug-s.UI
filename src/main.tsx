import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { addResourceHints, registerServiceWorker } from './lib/performance'

// Add performance optimizations
addResourceHints();

// Register service worker for caching
registerServiceWorker();

// Performance monitoring
if (import.meta.env.DEV) {
  // Web Vitals monitoring in development
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

createRoot(document.getElementById("root")!).render(<App />);