"use client";
import styles from "../page.module.css";

export function CloseButton({ onClick }: { onClick?: () => void }) {
  return (
    <button className={styles.closeButton} type="button" onClick={onClick}>
      ✕
    </button>
  );
}


