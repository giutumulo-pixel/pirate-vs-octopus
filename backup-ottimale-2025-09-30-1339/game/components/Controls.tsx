"use client";
import styles from "../page.module.css";

export function Controls({ onCast }: { onCast: () => void }) {
  return (
    <div className={styles.controls}>
      <button className={styles.startButton} onClick={onCast}>Cast Hook</button>
      <div className={styles.hint}>Press SPACE to cast</div>
    </div>
  );
}


