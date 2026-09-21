'use client';

import { useEffect, useState } from 'react';

// Each letter cycles through random letters, then locks on the real one, left to right.
// The accent dot pops in (.hero-dot in globals.css) just after the last letter locks.
const START_MS = 150;
const STAGGER_MS = 70;
const CYCLE_MS = 260;
const TICK_MS = 50;

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';

function randomLike(letter: string) {
  const pool = letter === letter.toUpperCase() ? UPPER : LOWER;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface ScrambleNameProps {
  firstName: string;
  lastName: string;
}

export default function ScrambleName({ firstName, lastName }: ScrambleNameProps) {
  const letters = (firstName + lastName).split('');
  // null = not started yet (hidden); otherwise what the slot shows and whether it has locked
  const [shown, setShown] = useState<({ char: string; locked: boolean } | null)[]>(() => letters.map(() => null));
  const lastLockMs = START_MS + (letters.length - 1) * STAGGER_MS + CYCLE_MS;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(letters.map((char) => ({ char, locked: true })));
      return;
    }
    const start = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - start;
      setShown(
        letters.map((letter, i) => {
          const begins = START_MS + i * STAGGER_MS;
          if (elapsed < begins) return null;
          if (elapsed >= begins + CYCLE_MS) return { char: letter, locked: true };
          return { char: randomLike(letter), locked: false };
        }),
      );
      if (elapsed >= lastLockMs) window.clearInterval(timer);
    }, TICK_MS);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName]);

  const slot = (letter: string, i: number) => (
    // The real letter (invisible) keeps each slot's width fixed while random letters cycle over it
    <span key={i} aria-hidden className="relative inline-block">
      <span className="invisible">{letter}</span>
      {/* Cycling letters are faint (close to the background); they take the name's colour when they lock */}
      <span
        className={`absolute inset-0 text-center transition-colors duration-150 ${
          shown[i]?.locked ? '' : 'text-black/20 dark:text-white/20'
        }`}
      >
        {shown[i]?.char ?? ''}
      </span>
    </span>
  );

  return (
    <>
      <span className="whitespace-nowrap">{firstName.split('').map((l, i) => slot(l, i))}</span>
      <span className="whitespace-nowrap">
        {lastName.split('').map((l, i) => slot(l, firstName.length + i))}
        <span
          aria-hidden
          className="hero-dot text-light-accent dark:text-dark-accent"
          style={{ animationDelay: `${lastLockMs + 60}ms` }}
        >
          .
        </span>
      </span>
    </>
  );
}
