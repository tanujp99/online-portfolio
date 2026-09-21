'use client';

import { ReactNode, useEffect, useRef } from 'react';

// Fades content in as it scrolls into view. Starts slightly before an item is visible, so a fast
// scroll never lands on empty space. Only items that arrive together get a short ripple delay.
// The animation itself is plain CSS (.reveal in globals.css).

const REVEAL_EARLY = '0px 0px 20% 0px';
const RIPPLE_MS = 70;
const MAX_RIPPLE_STEPS = 5;

function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let parent = el.parentElement; parent; parent = parent.parentElement) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') return parent;
  }
  return null;
}

// One observer per scroll container, shared by every Reveal inside it
const containerObservers = new WeakMap<HTMLElement, IntersectionObserver>();
let viewportObserver: IntersectionObserver | null = null;

function createObserver(root: HTMLElement | null) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_RIPPLE_STEPS) * RIPPLE_MS}ms`);
          el.classList.add('is-revealed');
          observer.unobserve(el);
        });
    },
    { root, rootMargin: REVEAL_EARLY },
  );
  return observer;
}

function observerFor(root: HTMLElement | null) {
  if (!root) return (viewportObserver ??= createObserver(null));
  let observer = containerObservers.get(root);
  if (!observer) {
    observer = createObserver(root);
    containerObservers.set(root, observer);
  }
  return observer;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  from?: 'up' | 'left';
}

export default function Reveal({ children, className = '', from = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed');
      return;
    }
    const observer = observerFor(scrollParent(el));
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <div ref={ref} className={`reveal reveal-${from} ${className}`}>
      {children}
    </div>
  );
}
