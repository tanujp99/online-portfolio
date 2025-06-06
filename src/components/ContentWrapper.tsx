'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import GitHubProfile from '@/components/GitHubProfile';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import Contact from '@/components/Contact';

const TABS = [
  { name: 'GitHub', component: <GitHubProfile /> },
  { name: 'Experience', component: <Experience /> },
  { name: 'Projects', component: <Projects /> },
  { name: 'Awards', component: <Awards /> },
  { name: 'Contact', component: <Contact /> },
];

export default function ContentWrapper() {
  const [activeTab, setActiveTab] = useState('GitHub');
  const currentTab = TABS.find(tab => tab.name === activeTab);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Navigation - More refined */}
      <div className="flex-shrink-0 mb-4">
        <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
      
      {/* Content Area - Better scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="w-full pr-1"> {/* Small right padding to account for scrollbar */}
          {currentTab?.component}
        </div>
      </div>
    </div>
  );
}