import type { ReactNode } from "react";
import styles from "./ui.module.css";

export function StatusLabel({ children }: { children: ReactNode }) {
  return <span className={styles.statusLabel}>{children}</span>;
}

