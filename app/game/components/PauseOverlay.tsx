"use client";
import styles from "../page.module.css";

interface PauseOverlayProps {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ onResume, onQuit }: PauseOverlayProps) {
  return (
    <div className={styles.pauseOverlay}>
      <div className={styles.pauseModal}>
        <h2 className={styles.pauseTitle}>⏸️ PAUSA</h2>
        
        <div className={styles.pauseInfo}>
          <p>Il gioco è in pausa</p>
          <p className={styles.pauseHint}>Premi ESC o clicca Riprendi per continuare</p>
        </div>
        
        <div className={styles.pauseButtons}>
          <button 
            className={styles.resumeButton} 
            onClick={onResume}
          >
            ▶️ Riprendi
          </button>
          
          <button 
            className={styles.quitButton} 
            onClick={onQuit}
          >
            🏠 Esci
          </button>
        </div>
      </div>
    </div>
  );
}
