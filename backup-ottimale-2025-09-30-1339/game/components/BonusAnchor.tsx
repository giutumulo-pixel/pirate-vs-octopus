import styles from "../page.module.css";

interface BonusAnchorProps {
  bonusSpawn?: { xPx: number; yPx: number; isCaught?: boolean; xOverridePx?: number; yOverridePx?: number };
  gameWidth: number;
  gameHeight: number;
}

export function BonusAnchor({ bonusSpawn, gameWidth, gameHeight }: BonusAnchorProps) {
  if (!bonusSpawn) return null;
  
  return (
    <div
      className={styles.anchorBonus}
      style={{
        left: `${((bonusSpawn.xOverridePx ?? bonusSpawn.xPx) / gameWidth) * 100}%`,
        top: `${((bonusSpawn.yOverridePx ?? bonusSpawn.yPx) / gameHeight) * 100}%`,
        filter: bonusSpawn.isCaught 
          ? 'drop-shadow(0 0 12px rgba(255, 215, 0, 1)) drop-shadow(2px 2px 4px rgba(0,0,0,0.4)) brightness(1.3)' 
          : 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)) drop-shadow(2px 2px 4px rgba(0,0,0,0.4))'
      }}
    />
  );
}
