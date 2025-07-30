'use client';

import { motion } from 'framer-motion';

interface NavbarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const tabs = ['Profile', 'Experience', 'Projects', 'Awards', 'About'];

export default function Navbar({ setActiveTab, activeTab }: NavbarProps) {
  return (
    <nav className="w-full">
      <div className="flex items-center justify-center">
        <div className="flex bg-[var(--background)] rounded-full p-1.5 backdrop-blur-md shadow-navbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab 
                  ? 'text-light-accent dark:text-dark-accent' 
                  : 'text-[var(--foreground)] text-neutral-700 dark:text-gray-400 hover:text-[var(--foreground)]'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[var(--button-bg)] rounded-full shadow-pill"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}