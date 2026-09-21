'use client';

import { ReactNode, useState } from 'react';

// A trading card: click (or Enter/Space) turns it over, and it tilts toward the mouse.
// The flip and tilt are plain CSS (see .flip-card in globals.css); this only toggles classes and variables.

function FlipIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5">
      <path d="M3.5 8.5A6.5 6.5 0 0 1 15 5.2M16.5 11.5A6.5 6.5 0 0 1 5 14.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 2v3.5H12M4.5 18v-3.5H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Tilts the card toward the pointer and moves the light with it; plain CSS variables, no re-renders
const MAX_TILT = 9;

function handleTilt(e: React.PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== 'mouse') return;
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  card.classList.add('is-hovering');
  card.style.setProperty('--rx', `${((0.5 - y) * MAX_TILT * 2).toFixed(2)}deg`);
  card.style.setProperty('--ry', `${((x - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
  card.style.setProperty('--lift', '1.03');
  card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
  card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
}

function resetTilt(e: React.PointerEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  card.classList.remove('is-hovering');
  ['--rx', '--ry', '--lift'].forEach((name) => card.style.removeProperty(name));
}

// Keyboard/screen readers must not reach the face that's turned away
const hiddenFace = { inert: '', 'aria-hidden': true } as Record<string, unknown>;

interface FlipCardProps {
  label: string;
  front: ReactNode;
  back: ReactNode;
  padding?: string;
}

export default function FlipCard({ label, front, back, padding = 'p-4 sm:p-6' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card h-full cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
      onPointerMove={handleTilt}
      onPointerLeave={resetTilt}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${label}: ${isFlipped ? 'hide' : 'show'} details`}
      onClick={() => {
        if (window.getSelection && window.getSelection() && window.getSelection()!.toString()) return;
        setIsFlipped((flipped) => !flipped);
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped((flipped) => !flipped);
        }
      }}
    >
      <div className="flip-card-tilt">
        <div className="flip-card-inner">
          <div
            className={`flip-card-face relative h-full bg-[var(--card-bg)] rounded-xl shadow-card ${padding}`}
            {...(isFlipped ? hiddenFace : {})}
          >
            {front}
            <span className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-light-accent dark:text-dark-accent pointer-events-none">
              <FlipIcon />
            </span>
          </div>

          <div
            className="flip-card-face flip-card-back bg-[var(--card-bg)] rounded-xl shadow-card"
            {...(isFlipped ? {} : hiddenFace)}
          >
            <div className={`custom-scrollbar h-full overflow-y-auto flex flex-col ${padding}`}>
              {back}
              <span className="sticky bottom-0 self-end -mb-1 sm:-mb-3 -mr-1 sm:-mr-2 text-light-accent dark:text-dark-accent pointer-events-none">
                <FlipIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
