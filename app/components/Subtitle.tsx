"use client";
import styles from "../page.module.css";

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <p className={styles.subtitle}>{children}</p>;
}


