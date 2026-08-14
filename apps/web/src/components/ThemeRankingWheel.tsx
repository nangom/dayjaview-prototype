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
  const snapTimerRef = useRef<number | undefined>(undefined);
  const frameRef = useRef<number | undefined>(undefined);
  const repeatedThemes = [...themes, ...themes, ...themes];

  useLayoutEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || themes.length === 0) return;

    const cards = Array.from(wheel.querySelectorAll<HTMLElement>("[data-theme-card]"));
    const step = (cards[0]?.offsetHeight ?? 64) + 8;
    const cycleHeight = step * themes.length;
    let baseTop = 0;
    let hasInteracted = false;

    const paint = () => {
      frameRef.current = undefined;
      const bounds = wheel.getBoundingClientRect();
      const focusY = bounds.top + bounds.height / 2;

      cards.forEach((card) => {
        const cardBounds = card.getBoundingClientRect();
        const distance = Math.abs(cardBounds.top + cardBounds.height / 2 - focusY) / step;
        const emphasis = Math.max(0, 1 - distance);
        card.style.setProperty("--wheel-scale", String(0.94 + emphasis * 0.06));
        card.style.setProperty("--wheel-opacity", String(Math.max(0.24, 1 - Math.max(0, distance - 1) * 0.2)));
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

    const snap = () => {
      const target = baseTop + Math.round((wheel.scrollTop - baseTop) / step) * step;
      wheel.scrollTo({ top: target, behavior: "smooth" });
    };

    const handleScroll = () => {
      keepMiddleCopy();
      schedulePaint();
      if (!hasInteracted) return;
      window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = window.setTimeout(snap, 150);
    };

    const markInteraction = () => { hasInteracted = true; };

    const firstMiddleCard = cards[themes.length];
    if (firstMiddleCard) {
      baseTop = firstMiddleCard.offsetTop - wheel.clientHeight / 2 + firstMiddleCard.offsetHeight / 2;
      wheel.scrollTop = baseTop + step / 2;
    }
    paint();
    wheel.addEventListener("scroll", handleScroll, { passive: true });
    wheel.addEventListener("wheel", markInteraction, { passive: true });
    wheel.addEventListener("touchstart", markInteraction, { passive: true });
    wheel.addEventListener("pointerdown", markInteraction, { passive: true });

    return () => {
      wheel.removeEventListener("scroll", handleScroll);
      wheel.removeEventListener("wheel", markInteraction);
      wheel.removeEventListener("touchstart", markInteraction);
      wheel.removeEventListener("pointerdown", markInteraction);
      window.clearTimeout(snapTimerRef.current);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [themes]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !wheelRef.current) return;
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY, startTop: wheelRef.current.scrollTop, moved: false };
    wheelRef.current.setPointerCapture(event.pointerId);
    wheelRef.current.dataset.dragging = "true";
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const wheel = wheelRef.current;
    const drag = dragRef.current;
    if (!wheel || event.pointerId !== drag.pointerId) return;
    const delta = event.clientY - drag.startY;
    if (Math.abs(delta) > 5) drag.moved = true;
    if (drag.moved) wheel.scrollTop = drag.startTop - delta;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const wheel = wheelRef.current;
    if (!wheel || event.pointerId !== dragRef.current.pointerId) return;
    wheel.releasePointerCapture(event.pointerId);
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
    >
      {repeatedThemes.map((theme, index) => (
        <button
          data-theme-card
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
          <span className={styles.chevron}>›</span>
        </button>
      ))}
    </div>
  );
}
