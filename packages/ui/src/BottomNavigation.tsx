import type { ReactNode } from "react";
import styles from "./ui.module.css";

export type NavigationItem = { id: string; label: string; icon: ReactNode };

export function BottomNavigation({ items, activeId, onSelect }: { items: NavigationItem[]; activeId: string; onSelect: (id: string) => void }) {
  return <nav className={styles.bottomNavigation} aria-label="주요 메뉴">{items.map(item => <button key={item.id} type="button" className={item.id === activeId ? styles.navigationActive : ""} onClick={() => onSelect(item.id)} aria-current={item.id === activeId ? "page" : undefined}>{item.icon}<span>{item.label}</span></button>)}</nav>;
}

