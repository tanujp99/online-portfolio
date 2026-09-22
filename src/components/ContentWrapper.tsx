'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navbar from '@/components/Navbar';
import Profile from '@/components/Profile';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import About from './About';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ScrollRail from '@/components/ScrollRail';

// The loading animation plays alongside the hero's name scramble on page load, then hands off to the
// content. It lands on the spinner's resting pose (its loop holds still from 1.5s to 2s).
const INTRO_MS = 1500;

export default function ContentWrapper() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [intro, setIntro] = useState(true);
  // The rail is drawn on the page beside the panel, not inside it, so it goes to the anchor the layout
  // leaves out there
  const [railAnchor, setRailAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntro(false);
      return;
    }
    // Warm the browser cache so the Profile tab's GitHub numbers are ready when it appears
    fetch('https://api.github.com/users/tanujp99').catch(() => {});
    const timer = window.setTimeout(() => setIntro(false), INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Picking a tab during the intro skips straight to it
  const selectTab = (tab: string) => {
    setIntro(false);
    setActiveTab(tab);
  };
  
  // Memoize the tabs to prevent recreation on every render
  const TABS = useMemo(() => [
    { name: 'Profile', component: Profile },
    { name: 'Experience', component: Experience },
    { name: 'Projects', component: Projects },
    { name: 'Awards', component: Awards },
    { name: 'About', component: About },
  ], []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // The rail is drawn on the page beside the panel, not inside it, so it goes to the anchor the layout
  // leaves out there
  useEffect(() => {
    const shell = panelRef.current?.closest('[data-shell]');
    setRailAnchor(shell?.parentElement?.querySelector<HTMLElement>('[data-rail-anchor]') ?? null);
  }, []);

  // A new tab starts at the top, not wherever the last one was scrolled to
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  const currentTab = TABS.find(tab => tab.name === activeTab);
  const CurrentComponent = currentTab?.component;

  return (
    <div ref={panelRef} className="flex flex-col h-full min-h-0">
      {/* Navigation - More refined */}
      <div className="flex-shrink-0 mb-4">
        <Navbar setActiveTab={selectTab} activeTab={activeTab} />
      </div>
      
      {/* Content Area - Better scrolling */}
      <div className="flex-1 min-h-0">
        <div ref={scrollRef} className="scroll-host h-full overflow-y-auto overflow-x-hidden">
        {intro ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div key={activeTab} className="w-full pr-full fade-in">
            <ErrorBoundary>
              {CurrentComponent && <CurrentComponent />}
            </ErrorBoundary>
          </div>
        )}
        </div>
      </div>
      {railAnchor &&
        createPortal(<ScrollRail targetRef={scrollRef} resetKey={intro ? 'intro' : activeTab} />, railAnchor)}
    </div>
  );
}