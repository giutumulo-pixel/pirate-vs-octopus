import styles from "../page.module.css";
import type { FishSprite, LaneConfig } from "./types";

interface FishLayerProps {
  fish: FishSprite[];
  lanes: LaneConfig[];
  gameWidth: number;
  gameHeight: number;
}

export function FishLayer({ fish, lanes, gameWidth, gameHeight }: FishLayerProps) {
  return (
    <>
      {fish.map(f => {
        const lane = lanes.find(l => l.id === f.laneId)!;
        const yPx = (lane.yPercent / 100) * gameHeight;
        const xRenderPx = f.xOverridePx ?? f.xPx;
        const yRenderPx = f.yOverridePx ?? yPx;
        const left = `${(xRenderPx / gameWidth) * 100}%`;
        const top = `${(yRenderPx / gameHeight) * 100}%`;
        // Flip fish horizontally based on movement direction
        const scaleX = lane.direction === 1 ? 1 : -1;
        return (
          <div 
            key={f.id} 
            className={styles.fishSprite} 
            data-kind={f.kind} 
            style={{ 
              left, 
              top, 
              transform: `translate(-50%, -50%) scaleX(${scaleX})`,
              filter: f.isCaught ? 'brightness(1.2) saturate(1.3)' : 'none'
            }} 
          />
        );
      })}
    </>
  );
}
