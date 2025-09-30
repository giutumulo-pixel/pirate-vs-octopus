"use client";
import styles from "../page.module.css";
import type { FishSprite, LaneConfig, HookState } from "./types";
import { Environment } from "./Environment";
import { Ship } from "./Ship";
import { TrajectoryPreview } from "./TrajectoryPreview";
import { FishLayer } from "./FishLayer";
import { FishingRig } from "./FishingRig";
import { BonusAnchor } from "./BonusAnchor";

export function Ocean({
  lanes,
  fish,
  indicatorDeg,
  hook,
  bonusSpawn,
  bonusActive,
  level,
  gameWidth,
  gameHeight,
}: {
  lanes: LaneConfig[];
  fish: FishSprite[];
  indicatorDeg: number;
  hook: HookState | null;
  bonusSpawn?: { xPx: number; yPx: number; isCaught?: boolean; xOverridePx?: number; yOverridePx?: number };
  bonusActive: boolean;
  level: number;
  gameWidth: number;
  gameHeight: number;
}) {
  return (
    <div className={styles.ocean} style={{ width: "100%", height: "100%", position: "relative" }}>
      <Environment level={level} />
      
      <Ship bonusActive={bonusActive} />

      <TrajectoryPreview 
        indicatorDeg={indicatorDeg} 
        gameWidth={gameWidth} 
        gameHeight={gameHeight} 
      />

      <FishLayer 
        fish={fish} 
        lanes={lanes} 
        gameWidth={gameWidth} 
        gameHeight={gameHeight} 
      />

      <FishingRig 
        hook={hook} 
        gameWidth={gameWidth} 
        gameHeight={gameHeight} 
      />

      <BonusAnchor 
        bonusSpawn={bonusSpawn} 
        gameWidth={gameWidth} 
        gameHeight={gameHeight} 
      />
    </div>
  );
}


