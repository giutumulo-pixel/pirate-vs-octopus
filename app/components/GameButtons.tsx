"use client";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export function GameButtons() {
  const router = useRouter();
  return (
    <div className={styles.gameButtons}>
      <button 
        onClick={() => router.push("/game")} 
        className={styles.playButton}
      >
        🎮 PLAY GAME! 🏴‍☠️
      </button>
      <button 
        onClick={() => router.push("/waitlist")} 
        className={styles.waitlistButton}
      >
        📧 JOIN WAITLIST
      </button>
    </div>
  );
}


