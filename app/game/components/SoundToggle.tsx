"use client";
import styles from "../page.module.css";

interface SoundToggleProps {
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

export function SoundToggle({ isMuted, volume, onToggleMute, onVolumeChange }: SoundToggleProps) {
  return (
    <div className={styles.soundControls}>
      <button 
        className={styles.soundButton} 
        onClick={onToggleMute}
        title={isMuted ? "Attiva Audio" : "Disattiva Audio"}
      >
        {isMuted ? "🔇" : volume > 0.5 ? "🔊" : volume > 0 ? "🔉" : "🔈"}
      </button>
      <input
        type="range"
        className={styles.volumeSlider}
        min="0"
        max="100"
        value={isMuted ? 0 : volume * 100}
        onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
        title="Volume"
      />
    </div>
  );
}
