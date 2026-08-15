"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./ThemeRankingWheel.module.css";

type Theme = {
  rank: number;
  name: string;
  metadata: string;
  value: string;
};

type ThemeRankingWheelProps = {
  themes: Theme[];
  onSelect: (theme: Theme) => void;
};

export function ThemeRankingWheel({ themes, onSelect }: ThemeRankingWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ pointerId: -1, startY: 0, startTop: 0, moved: false });
  const frameRef = useRef<number | undefined>(undefined);
  const introRafRef = useRef<number | undefined>(undefined);
  const hasPlayedIntroRef = useRef(false);
  const introCancelledRef = useRef(false);
  const introTimersRef = useRef<number[]>([]);
  const orderedThemes = themes.length > 0 ? [themes[themes.length - 1], ...themes.slice(0, -1)] : [];
  const repeatedThemes = [...orderedThemes, ...orderedThemes, ...orderedThemes];

  useLayoutEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || themes.length === 0) return;

    const cards = Array.from(wheel.querySelectorAll<HTMLElement>("[data-theme-card]"));
    const step = (cards[0]?.offsetHeight ?? 64) + 8;
    const cycleHeight = step * themes.length;
    let baseTop = 0;

    const paint = () => {
      frameRef.current = undefined;
      const bounds = wheel.getBoundingClientRect();
      const focusY = bounds.top + bounds.height / 2;

      cards.forEach((card) => {
        const cardBounds = card.getBoundingClientRect();
        const signedDistance = (cardBounds.top + cardBounds.height / 2 - focusY) / step;
        const distance = Math.abs(signedDistance);
        const boundedDistance = Math.max(-2.2, Math.min(2.2, signedDistance));
        const emphasis = Math.max(0, 1 - distance);
        // Treat the list like the front arc of a vertical cylinder: cards
        // above/below the focus rotate away and recede in Z, rather than only
        // sliding sideways with a flat curve.
        const visualDistance = Math.min(distance, 2.2);
        const rotate = Math.max(-17, Math.min(17, -boundedDistance * 8));
        const depth = Math.max(-26, 12 - visualDistance * 17);
        const curve = Math.sign(boundedDistance) * Math.min(2, visualDistance * 0.8);
        card.style.setProperty("--wheel-scale", String(0.985 + emphasis * 0.015));
        card.style.setProperty("--wheel-opacity", String(Math.max(0.34, 1 - Math.max(0, distance - 1) * 0.16)));
        card.style.setProperty("--wheel-rotate", `${rotate}deg`);
        card.style.setProperty("--wheel-depth", `${depth}px`);
        card.style.setProperty("--wheel-curve", `${curve}px`);
        card.dataset.focused = distance < 0.72 ? "true" : "false";
      });
    };

    const schedulePaint = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(paint);
    };

    const keepPrimaryCopy = () => {
      // Keep the visible range in the middle copy. Shift by one full cycle so
      // the duplicated cards stay in the exact same visual position instead
      // of jumping to an unrelated rank when the user flicks past an end.
      const wrapThreshold = step * 0.65;
      const nextCycleTop = baseTop + cycleHeight;
      if (wheel.scrollTop > nextCycleTop + wrapThreshold) wheel.scrollTop -= cycleHeight;
      else if (wheel.scrollTop < baseTop - wrapThreshold) wheel.scrollTop += cycleHeight;
    };

    const handleScroll = () => {
      keepPrimaryCopy();
      schedulePaint();
    };

    const firstVisibleCard = cards[themes.length + 1];
    introCancelledRef.current = false;
    const introTimers = introTimersRef.current;
    introTimers.splice(0, introTimers.length);
    if (firstVisibleCard) {
      baseTop = Math.max(0, firstVisibleCard.offsetTop - (wheel.clientHeight - firstVisibleCard.offsetHeight) / 2);
      wheel.scrollTop = baseTop;
    }

    const shouldPlayIntro = !hasPlayedIntroRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (shouldPlayIntro && firstVisibleCard) {
      // Advance one card at a time — rank 1 to rank 2 to rank 3 — pausing on
      // each so it reads as the wheel clicking through the ranking rather than
      // one continuous sweep. The list is tripled, so stepping through exactly
      // one cycle lands on an identical rank 1 card and the scroll position can
      // be reset afterwards without a visible jump. Driving it per frame keeps
      // each hop gliding instead of stuttering against smooth-scroll targets.
      const stepGlide = 400;
      const stepHold = 260;
      const stepCycle = stepGlide + stepHold;
      const totalSteps = themes.length;
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      let introStart = 0;
      const spin = (now: number) => {
        if (introCancelledRef.current) return;
        if (!introStart) introStart = now;
        const elapsed = now - introStart;
        const stepIndex = Math.floor(elapsed / stepCycle);
        if (stepIndex >= totalSteps) {
          introRafRef.current = undefined;
          wheel.scrollTop = baseTop;
          delete wheel.dataset.intro;
          return;
        }
        const glide = Math.min(1, (elapsed - stepIndex * stepCycle) / stepGlide);
        wheel.scrollTop = baseTop + step * (stepIndex + ease(glide));
        introRafRef.current = window.requestAnimationFrame(spin);
      };
      introTimers.push(window.setTimeout(() => {
        if (introCancelledRef.current) return;
        // Mark the intro as spent only once it actually starts. Marking it at
        // schedule time meant Strict Mode's double-invoked effect burned the
        // flag on the first pass, whose cleanup then cancelled the timer, so
        // the second pass skipped the spin entirely and it never played.
        hasPlayedIntroRef.current = true;
        wheel.dataset.intro = "true";
        introRafRef.current = window.requestAnimationFrame(spin);
      }, 420));
    }
    paint();
    wheel.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      wheel.removeEventListener("scroll", handleScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (introRafRef.current) window.cancelAnimationFrame(introRafRef.current);
      introRafRef.current = undefined;
      introTimers.forEach((timer) => window.clearTimeout(timer));
      introTimers.splice(0, introTimers.length);
      delete wheel.dataset.intro;
    };
  }, [themes]);

  const cancelIntro = () => {
    introCancelledRef.current = true;
    introTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    introTimersRef.current.splice(0, introTimersRef.current.length);
    if (introRafRef.current) {
      window.cancelAnimationFrame(introRafRef.current);
      introRafRef.current = undefined;
    }
    if (wheelRef.current) {
      delete wheelRef.current.dataset.intro;
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    cancelIntro();
    if (event.pointerType !== "mouse" || event.button !== 0 || !wheelRef.current) return;
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY, startTop: wheelRef.current.scrollTop, moved: false };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const wheel = wheelRef.current;
    const drag = dragRef.current;
    if (!wheel || event.pointerId !== drag.pointerId) return;
    const delta = event.clientY - drag.startY;
    if (Math.abs(delta) > 12 && !drag.moved) {
      drag.moved = true;
      wheel.setPointerCapture(event.pointerId);
      wheel.dataset.dragging = "true";
    }
    if (drag.moved) wheel.scrollTop = drag.startTop - delta;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const wheel = wheelRef.current;
    if (!wheel || event.pointerId !== dragRef.current.pointerId) return;
    if (wheel.hasPointerCapture(event.pointerId)) wheel.releasePointerCapture(event.pointerId);
    delete wheel.dataset.dragging;
    dragRef.current.pointerId = -1;
  };

  return (
    <div
      ref={wheelRef}
      className={styles.wheel}
      aria-label="오늘 많이 오른 테마 순위"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={cancelIntro}
    >
      {repeatedThemes.map((theme, index) => (
        <button
          data-theme-card
          data-top={theme.rank <= 3 ? "true" : "false"}
          type="button"
          className={styles.card}
          key={`${Math.floor(index / themes.length)}-${theme.rank}`}
          onClick={(event) => {
            if (dragRef.current.moved) {
              event.preventDefault();
              dragRef.current.moved = false;
              return;
            }
            onSelect(theme);
          }}
        >
          <span className={styles.rank}>{theme.rank}</span>
          <span className={styles.copy}><strong>{theme.name}</strong><small>{theme.metadata}</small></span>
          <b>{theme.value}</b>
        </button>
      ))}
    </div>
  );
}
