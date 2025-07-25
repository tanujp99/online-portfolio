'use client';

import { useState } from 'react';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import About from '../components/About';

const TABS = [
  { name: 'Experience', component: <Experience /> },
  { name: 'Projects', component: <Projects /> },
  { name: 'Awards', component: <Awards /> },
  { name: 'About', component: <About /> },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('Experience');

  const currentTab = TABS.find(tab => tab.name === activeTab);

  return (
    <main className="min-h-screen">
      <div className="flex flex-col flex-1 w-full h-full">
        {currentTab?.component}
      </div>
    </main>
  );
} 