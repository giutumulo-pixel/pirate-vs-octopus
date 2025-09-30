"use client";
import styles from "../page.module.css";

export function HUD({ score, timeLeft, level }: { score: number; timeLeft: number; level: number }) {
  const levelTargets = [0, 3000, 5000, 7000, 9000, 12000, 15000, 18000, 22000, 26000, 30000];
  const target = levelTargets[level] || 30000;
  
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


