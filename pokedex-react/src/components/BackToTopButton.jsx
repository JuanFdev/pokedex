import { useEffect, useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/solid'; // Asegúrate de tener @heroicons/react instalado

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-800 text-white p-3 rounded-full shadow-lg transition-all"
        aria-label="Volver arriba"
      >
        <ChevronUpIcon className="w-5 h-5" />
      </button>
    )
  );
}
