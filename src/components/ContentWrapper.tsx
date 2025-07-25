'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Profile from '@/components/Profile';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import About from './About';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function ContentWrapper() {
  const [activeTab, setActiveTab] = useState('Profile');
  
  // Memoize the tabs to prevent recreation on every render
  const TABS = useMemo(() => [
    { name: 'Profile', component: Profile },
    { name: 'Experience', component: Experience },
    { name: 'Projects', component: Projects },
    { name: 'Awards', component: Awards },
    { name: 'About', component: About },
  ], []);

  const currentTab = TABS.find(tab => tab.name === activeTab);
  const CurrentComponent = currentTab?.component;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Navigation - More refined */}
      <div className="flex-shrink-0 mb-4">
        <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
      
      {/* Content Area - Better scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="w-full pr-full">
          <ErrorBoundary>
            {CurrentComponent && <CurrentComponent />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}