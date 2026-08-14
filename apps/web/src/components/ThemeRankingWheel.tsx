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
        const boundedDistance = Math.max(-2.6, Math.min(2.6, signedDistance));
        const emphasis = Math.max(0, 1 - distance);
        // Treat the list like the front arc of a vertical cylinder: cards
        // above/below the focus rotate away and recede in Z, rather than only
        // sliding sideways with a flat curve.
        const rotate = Math.max(-30, Math.min(30, -boundedDistance * 15));
        const depth = Math.max(-56, 22 - distance * 32);
        const curve = Math.sign(boundedDistance) * Math.min(4, distance * 1.4);
        card.style.setProperty("--wheel-scale", String(0.97 + emphasis * 0.03));
        card.style.setProperty("--wheel-opacity", String(Math.max(0.24, 1 - Math.max(0, distance - 1) * 0.2)));
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

    const keepMiddleCopy = () => {
      if (wheel.scrollTop < cycleHeight * 0.5) wheel.scrollTop += cycleHeight;
      if (wheel.scrollTop > cycleHeight * 1.5) wheel.scrollTop -= cycleHeight;
    };

    const handleScroll = () => {
      keepMiddleCopy();
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
      hasPlayedIntroRef.current = true;
      wheel.dataset.intro = "true";
      const introStepDelay = 800;
      [baseTop + step, baseTop + step * 2].forEach((targetTop, index) => {
        introTimers.push(window.setTimeout(() => {
          if (introCancelledRef.current) return;
          wheel.scrollTo({ top: targetTop, behavior: "smooth" });
          wheel.dataset.introStep = String(index + 1);
        }, introStepDelay * (index + 1)));
      });
      // After the three quick beats, pause for three beats before revealing
      // rank 4, and only do so if the user has not touched the wheel.
      introTimers.push(window.setTimeout(() => {
        if (introCancelledRef.current) return;
        wheel.scrollTo({ top: baseTop + step * 3, behavior: "smooth" });
        wheel.dataset.introStep = "3";
      }, introStepDelay * 5));
      introTimers.push(window.setTimeout(() => {
        delete wheel.dataset.intro;
        delete wheel.dataset.introStep;
      }, introStepDelay * 6));
    }
    paint();
    wheel.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      wheel.removeEventListener("scroll", handleScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      introTimers.forEach((timer) => window.clearTimeout(timer));
      introTimers.splice(0, introTimers.length);
      delete wheel.dataset.intro;
      delete wheel.dataset.introStep;
    };
  }, [themes]);

  const cancelIntro = () => {
    introCancelledRef.current = true;
    introTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    introTimersRef.current.splice(0, introTimersRef.current.length);
    if (wheelRef.current) {
      delete wheelRef.current.dataset.intro;
      delete wheelRef.current.dataset.introStep;
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
