'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import Contact from '@/components/Contact';

const TABS = [
  { name: 'Experience', component: <Experience /> },
  { name: 'Projects', component: <Projects /> },
  { name: 'Awards', component: <Awards /> },
  { name: 'Contact', component: <Contact /> },
];

export default function ContentWrapper() {
  const [activeTab, setActiveTab] = useState('Experience');
  const currentTab = TABS.find(tab => tab.name === activeTab);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gumroad-dark rounded-t-3xl border-b border-neutral-200 dark:border-neutral-800">
        <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-gumroad-dark">
        <div className="w-full">
          {currentTab?.component}
        </div>
      </div>
    </div>
  );
} 