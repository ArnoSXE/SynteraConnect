import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import logoImage from '@assets/generated_images/minimalist_geometric_purple_logo_for_syntera.png';

export default function LoadingScreen() {
  const [, setLocation] = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 3500); // Animation duration
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (redirect) {
      setLocation('/home');
    }
  }, [redirect, setLocation]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative"
      >
        <img src={logoImage} alt="Syntera Logo" className="w-32 h-32 object-contain" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-6"
      >
        <h1 className="text-4xl font-bold tracking-tighter text-primary">Syntera</h1>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="h-1 bg-gradient-to-r from-primary to-purple-300 mt-4 rounded-full"
      />
    </div>
  );
}
