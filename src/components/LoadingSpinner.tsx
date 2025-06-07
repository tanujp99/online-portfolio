'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <motion.div
        className="w-8 h-8 border-4 border-light-accent/20 dark:border-gumroad-pink/20 border-t-light-accent dark:border-t-gumroad-pink rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
} 