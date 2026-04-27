import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Load non-critical CSS after page load
    const loadNonCriticalCSS = () => {
      const nonCriticalCSS = [
        // Add paths to non-critical CSS files here
        '/assets/css/animate.css',
        '/assets/css/disable-navbar-hover.css',
        // Add more non-critical CSS files as needed
      ];

      nonCriticalCSS.forEach((cssPath) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.media = 'print';
        link.onload = function() {
          this.media = 'all';
        };
        document.head.appendChild(link);
      });
    };

    // Load non-critical CSS after a delay
    const timer = setTimeout(loadNonCriticalCSS, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default CriticalCSS;
