"use client";
import styles from "../page.module.css";

export function HUD({ score, timeLeft, level }: { score: number; timeLeft: number; level: number }) {
  // Must match the targets in useGameEngine.ts
  const levelTargets = [0, 2000, 4000, 6000, 8000, 12000, 16000, 20000, 25000, 30000, 40000];
  const target = levelTargets[level] || 40000;
  
  // Level names
  const levelNames = [
    "", "Alba", "Mattino", "Sole Alto", "Pomeriggio", 
    "Tramonto", "Sera", "Notte", "Tempesta", "Nebbia", "Aurora"
  ];
  
  return (
    <div className={styles.hud}>
      <div className={styles.score}>Score: {score}</div>
      <div className={styles.time}>Time: {timeLeft}s</div>
      <div style={{ fontSize: '0.9rem', marginTop: '5px', opacity: 0.8 }}>
        Livello {level}: {levelNames[level]} - Target: {target} punti
      </div>
    </div>
  );
}


