"use client";
import styles from "../page.module.css";

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className={styles.title}>{children}</h1>;
}


