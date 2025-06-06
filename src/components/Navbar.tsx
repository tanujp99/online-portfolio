'use client';

import { motion } from 'framer-motion';

interface NavbarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const tabs = ['GitHub', 'Experience', 'Projects', 'Awards', 'Contact'];

export default function Navbar({ setActiveTab, activeTab }: NavbarProps) {
  return (
    <nav className="w-full">
      <div className="flex items-center justify-center">
        <div className="flex bg-[rgb(var(--card-bg))] rounded-full p-1.5 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] border border-[rgb(var(--border-color))]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === tab
                  ? 'text-light-accent dark:text-gumroad-pink'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[rgb(var(--card-bg))] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.1)] border border-[rgb(var(--border-color))]"
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