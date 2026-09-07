import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down more than 250px
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // Initial check
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <button
        id="floating-back-to-top-btn"
        onClick={scrollToTop}
        type="button"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 border-2 border-white/20 active:scale-95 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400/50 cursor-pointer"
        aria-label="Kembali ke atas halaman"
        title="Kembali ke atas"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-200" strokeWidth={2.5} />
        
        {/* Tooltip on desktop hover */}
        <span className="hidden md:group-hover:block absolute -top-10 right-0 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-lg border border-slate-800 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          Kembali ke atas
        </span>
      </button>
    </div>
  );
};
