import styles from "../page.module.css";
import { ROD_TIP_X_PERCENT, ROD_TIP_Y_PERCENT } from "./constants";

interface TrajectoryPreviewProps {
  indicatorDeg: number;
  gameWidth: number;
  gameHeight: number;
}

export function TrajectoryPreview({ indicatorDeg, gameWidth, gameHeight }: TrajectoryPreviewProps) {
  // Use locked rod tip coordinates
  const startXpx = (ROD_TIP_X_PERCENT / 100) * gameWidth;
  const startYpx = (ROD_TIP_Y_PERCENT / 100) * gameHeight;
  const rad = (indicatorDeg * Math.PI) / 180;
  const dots = [];
  
  // Calculate trajectory points
  for (let i = 1; i <= 8; i++) {
    const distance = i * 40; // 40px intervals
    const x = startXpx + Math.sin(rad) * distance;
    const y = startYpx + Math.cos(rad) * distance;
    
    // Stop if would go off screen
    if (x < 0 || x > gameWidth || y > gameHeight) break;
    
    dots.push(
      <div
        key={i}
        className={styles.trajectoryDot}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          opacity: Math.max(0, 1 - (i * 0.1)), // fade out with distance
          transform: 'translate(-50%, -50%)'
        }}
      />
    );
  }
  
  return <>{dots}</>;
}
