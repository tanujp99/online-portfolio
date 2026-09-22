'use client';

import { useEffect, useRef, useState } from 'react';

// The round control in a card's bottom-right corner. It is one element everywhere, with the same traits:
//   look   - a neutral circle with the accent-coloured glyph
//   hover  - while its card is hovered, the glyph springs to hint at what a click does
//   use    - the glyph moves to show the new state
//   nudge  - once on screen it bobs every few seconds, until the visitor uses any control in its group
// Only the glyph differs between kinds. Put it inside the clickable card, and give that card the
// .card-control-host class. The styles are under "Card control" in globals.css.

export type CardControlKind = 'expand' | 'flip';

interface CardControlProps {
  kind: CardControlKind;
  // expanded or flipped
  active: boolean;
  // controls in the same group stop nudging together once any one of them is used, remembered across visits
  group: string;
  // only when the control is its own button; otherwise the whole card takes the click
  onClick?: () => void;
  label?: string;
}

const GLYPHS: Record<CardControlKind, JSX.Element> = {
  expand: <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  flip: (
    <>
      <path d="M3.5 8.5A6.5 6.5 0 0 1 15 5.2M16.5 11.5A6.5 6.5 0 0 1 5 14.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 2v3.5H12M4.5 18v-3.5H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

// ---- nudge bookkeeping, shared by every control on the page ----
const USED_EVENT = 'card-control-used';
const usedKey = (group: string) => `card-control-used:${group}`;

function groupUsed(group: string) {
  try {
    return localStorage.getItem(usedKey(group)) === '1';
  } catch {
    return false;
  }
}

function markGroupUsed(group: string) {
  try {
    localStorage.setItem(usedKey(group), '1');
  } catch {}
  window.dispatchEvent(new CustomEvent(USED_EVENT, { detail: group }));
}

let seenObserver: IntersectionObserver | null = null;

// Starts the nudge once the control is (all but) fully on screen
function nudgeWhenSeen(el: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return;
  seenObserver ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-nudging');
        seenObserver?.unobserve(entry.target);
      }),
    { threshold: 0.9 },
  );
  seenObserver.observe(el);
}

export default function CardControl({ kind, active, group, onClick, label }: CardControlProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [nudging, setNudging] = useState(false);
  // Flip glyph: half a turn clockwise when the pointer arrives on the card, another half on each flip,
  // and half a turn back (anticlockwise) when the pointer leaves
  const [turns, setTurns] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (groupUsed(group)) return;
    setNudging(true);
    const stop = (e: Event) => (e as CustomEvent).detail === group && setNudging(false);
    window.addEventListener(USED_EVENT, stop);
    return () => window.removeEventListener(USED_EVENT, stop);
  }, [group]);

  useEffect(() => {
    if (nudging && ref.current) nudgeWhenSeen(ref.current);
  }, [nudging]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTurns((t) => t + 1);
    if (active) markGroupUsed(group);
  }, [active, group]);

  useEffect(() => {
    if (kind !== 'flip') return;
    const host = ref.current?.closest('.card-control-host');
    if (!host) return;
    const onEnter = (e: Event) => (e as PointerEvent).pointerType === 'mouse' && setTurns((t) => t + 1);
    const onLeave = (e: Event) => (e as PointerEvent).pointerType === 'mouse' && setTurns((t) => t - 1);
    host.addEventListener('pointerenter', onEnter);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [kind]);

  const rotation = kind === 'flip' ? turns * 180 : active ? 180 : 0;
  const className = `card-control ${nudging ? '' : 'nudge-done'}`;
  const glyph = (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="card-control-glyph"
      style={{ '--cc-rot': `${rotation}deg` } as React.CSSProperties}
      aria-hidden
    >
      {GLYPHS[kind]}
    </svg>
  );

  if (onClick) {
    return (
      <button
        ref={(el) => {
          ref.current = el;
        }}
        type="button"
        data-kind={kind}
        data-active={active}
        aria-expanded={kind === 'expand' ? active : undefined}
        aria-label={label}
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {glyph}
      </button>
    );
  }

  return (
    <span
      ref={(el) => {
        ref.current = el;
      }}
      data-kind={kind}
      data-active={active}
      aria-hidden
      className={`${className} pointer-events-none`}
    >
      {glyph}
    </span>
  );
}
