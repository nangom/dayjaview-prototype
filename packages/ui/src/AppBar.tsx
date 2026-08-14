import type { ReactNode } from "react";
import styles from "./ui.module.css";

export function AppBar({ title, leading, trailing }: { title: string; leading?: ReactNode; trailing?: ReactNode }) {
  return <header className={styles.appBar}><div>{leading}</div><strong>{title}</strong><div>{trailing}</div></header>;
}

