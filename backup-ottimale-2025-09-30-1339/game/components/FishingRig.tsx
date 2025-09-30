import styles from "../page.module.css";
import type { HookState } from "./types";
import { 
  ROD_TIP_X_PERCENT, 
  ROD_TIP_Y_PERCENT, 
  HOOK_X_OFFSET_PX, 
  HOOK_Y_OFFSET_PX, 
  HOOK_SIZE_PX, 
  ATTACH_EPS_PX 
} from "./constants";

interface FishingRigProps {
  hook: HookState | null;
  gameWidth: number;
  gameHeight: number;
}

export function FishingRig({ hook, gameWidth, gameHeight }: FishingRigProps) {
  if (!hook) return null;
  
  // Line starts from fishing rod (locked coordinates)
  const startXpx = (ROD_TIP_X_PERCENT / 100) * gameWidth;
  const startYpx = (ROD_TIP_Y_PERCENT / 100) * gameHeight;
  
  const hookXpx = hook.xPx + HOOK_X_OFFSET_PX;
  // Clamp hook Y so it never goes beyond the bottom edge
  const rawHookYpx = hook.yPx + HOOK_Y_OFFSET_PX;
  const hookYpx = Math.min(rawHookYpx, gameHeight - HOOK_SIZE_PX / 2);
  const dxPx = hookXpx - startXpx;
  const dyPx = hookYpx - startYpx;
  const overlapPx = (HOOK_SIZE_PX / 2) + ATTACH_EPS_PX;
  const lengthPx = Math.max(0, Math.hypot(dxPx, dyPx) + overlapPx);
  // Screen Y grows downward; flip horizontal component to match CSS rotation
  const angleRad = Math.atan2(-dxPx, dyPx);
  const angleDeg = (angleRad * 180) / Math.PI;
  
  return (
    <>
      {/* Fishing line */}
      <div
        className={styles.fishingLine}
        style={{
          left: `${startXpx}px`,
          top: `${startYpx}px`,
          height: `${lengthPx}px`,
          transform: `translate(-50%, 0) rotate(${angleDeg}deg)`,
        }}
      />
      {/* Hook */}
      <div
        className={hook.usingAnchor ? styles.anchorHook : styles.hook}
        style={{
          left: `${hook.xPx + HOOK_X_OFFSET_PX}px`,
          top: `${Math.min(hook.yPx + HOOK_Y_OFFSET_PX, gameHeight - HOOK_SIZE_PX / 2)}px`,
        }}
      />
    </>
  );
}
