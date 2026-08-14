import styles from "./ui.module.css";

export function ThemeRow({ rank, name, metadata, value, direction, onSelect }: { rank: number; name: string; metadata: string; value: string; direction: "up" | "down"; onSelect?: () => void }) {
  return <button type="button" className={`${styles.themeRow} ${rank <= 2 ? styles.themeRowTop : ""}`} onClick={onSelect}><span className={`${styles.rank} ${rank <= 3 ? styles.rankTop : ""}`}>{rank}</span><span className={styles.themeCopy}><strong>{name}</strong><small>{metadata}</small></span><b className={direction === "up" ? styles.up : styles.down}>{value}</b><span aria-hidden="true">›</span></button>;
}
