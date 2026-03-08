import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

const OVERLAY_KEY = 'overlay-hidden';

export const Layout = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(() => {
    const stored = localStorage.getItem(OVERLAY_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '*') {
        setIsOverlayVisible((prev) => {
          const newValue = !prev;
          localStorage.setItem(OVERLAY_KEY, String(newValue));
          return newValue;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 relative">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.main>
        
        {/* Overlay blanco */}
        {isOverlayVisible && (
          <div className="fixed inset-0 top-16 bg-white z-50" />
        )}
      </div>
    </div>
  );
};
