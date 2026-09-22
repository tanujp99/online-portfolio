'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

// A floating scroll rail for the content panel. The native bar sat against the panel's edge and the
// rounded corners clipped it, so the panel hides its own bar and this one takes over: the pill bar in
// miniature, stood on end. Sunken track, raised pill, no size changes and nothing animated but the
// pill's travel. It runs half the height of the content area, centred in it, floating in the gutter
// between the content and the panel's wall. The styles are under "Scroll rail" in globals.css.

interface ScrollRailProps {
  targetRef: RefObject<HTMLElement>;
  // re-measures when the panel swaps its contents
  resetKey?: string;
}

export default function ScrollRail({ targetRef, resetKey }: ScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [progress, setProgress] = useState(0);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    const room = el.scrollHeight - el.clientHeight;
    setScrollable(room > 1);
    setProgress(room > 1 ? el.scrollTop / room : 0);
  }, [targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    measure();

    return () => {
      el.removeEventListener('scroll', onScroll);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetRef, measure, resetKey]);

  // Turns a pointer's position on the rail into a scroll position. The track's ends are where the pill's
  // centre reaches, so it overhangs them at the extremes, like a fader's cap.
  const scrollToPointer = useCallback(
    (clientY: number, grab: number) => {
      const el = targetRef.current;
      const rail = railRef.current;
      if (!el || !rail) return;
      const bounds = rail.getBoundingClientRect();
      if (bounds.height <= 0) return;
      const at = (clientY - bounds.top - grab) / bounds.height;
      el.scrollTop = Math.min(Math.max(at, 0), 1) * (el.scrollHeight - el.clientHeight);
    },
    [targetRef],
  );

  const startDrag = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail) return;
    e.preventDefault();
    const thumb = rail.firstElementChild as HTMLElement | null;
    const onThumb = thumb ? e.target === thumb || thumb.contains(e.target as Node) : false;
    // grabbing the pill keeps the point under the pointer; clicking the track takes the pill there
    const bounds = thumb?.getBoundingClientRect();
    const grab = onThumb && bounds ? e.clientY - (bounds.top + bounds.height / 2) : 0;
    scrollToPointer(e.clientY, grab);

    const move = (ev: PointerEvent) => scrollToPointer(ev.clientY, grab);
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  // The rail belongs to the shell, not to what happens to be in it: it is there from the moment the page
  // is, and simply has nothing to do while a tab fits on one screen.
  return (
    <div
      ref={railRef}
      className={`scroll-rail ${scrollable ? '' : 'is-idle'}`}
      onPointerDown={scrollable ? startDrag : undefined}
      aria-hidden
    >
      <div
        className="scroll-rail-thumb"
        style={{ top: `calc(100% * ${progress.toFixed(4)} - var(--rail-thumb) / 2)` }}
      />
    </div>
  );
}
