"use client";
import styles from "../page.module.css";
import { Shop } from "./Shop";
import { SoundToggle } from "./SoundToggle";

interface PauseOverlayProps {
  onResume: () => void;
  onQuit: () => void;
  coins: number;
  onBuyRadius: () => void;
  onBuyTime: () => void;
  onBuySpeed: () => void;
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

export function PauseOverlay({ 
  onResume, 
  onQuit, 
  coins,
  onBuyRadius,
  onBuyTime,
  onBuySpeed,
  isMuted,
  volume,
  onToggleMute,
  onVolumeChange
}: PauseOverlayProps) {
  return (
    <div className={styles.pauseOverlay}>
      <div className={styles.pauseModal}>
        <h2 className={styles.pauseTitle}>⏸️ PAUSA</h2>
        
        <div className={styles.pauseInfo}>
          <p>Il gioco è in pausa</p>
          <p className={styles.pauseHint}>Premi ESC o clicca Riprendi per continuare</p>
        </div>
        
        {/* Shop in Pause */}
        <div className={styles.pauseShop}>
          <Shop 
            coins={coins}
            onBuyRadius={onBuyRadius}
            onBuyTime={onBuyTime}
            onBuySpeed={onBuySpeed}
          />
        </div>
        
        {/* Sound Controls in Pause */}
        <div className={styles.pauseSound}>
          <SoundToggle 
            isMuted={isMuted}
            volume={volume}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
          />
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
