'use client';

import { motion } from 'framer-motion';

const navItems = [
  { name: 'Experience' },
  { name: 'Projects' },
  { name: 'Awards' },
  { name: 'Contact' },
];

interface NavbarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

export default function Navbar({ setActiveTab, activeTab }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-3 sm:py-4 px-3 sm:px-4"
    >
      <div className="bg-gray-100 dark:bg-gumroad-dark rounded-full px-3 sm:px-4 md:px-6 lg:px-10 py-2 sm:py-3 md:py-4 shadow-2xl border border-neutral-200 dark:border-neutral-800 inline-block w-full md:w-auto">
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 md:gap-4 lg:gap-12">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`text-xs sm:text-sm md:text-base font-medium transition-colors duration-200 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-gumroad-pink/50 ${
                activeTab === item.name
                  ? 'text-light-accent dark:text-gumroad-pink' : 'text-neutral-900 dark:text-white hover:text-light-accent dark:hover:text-gumroad-pink'
              }`}
              style={{ background: 'none', border: 'none' }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
} 