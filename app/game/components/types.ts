export type Direction = 1 | -1;

export type FishKind = "small" | "medium" | "large" | "shark" | "monster" | "kraken" | "leviathan" | "coin";

export interface LaneConfig {
  id: number;
  yPercent: number; // vertical position as percentage of game area height
  speedPxPerSec: number;
  direction: Direction; // 1 → left to right, -1 → right to left
  spacingPx: number; // minimal spacing between fish to avoid overlaps
  kind: FishKind;
  points: number;
}

export interface FishSprite {
  id: string;
  laneId: number;
  kind: FishKind;
  xPx: number; // horizontal position in pixels
  // Animation/capture state
  isCaught?: boolean;
  xOverridePx?: number;
  yOverridePx?: number;
}

export interface HookState {
  isCasting: boolean;
  isReturning: boolean;
  xPx: number;
  yPx: number;
  angleDeg: number; // snapshot of indicator at cast time
  usingAnchor: boolean; // bonus active for this cast
}

export interface BonusState {
  active: boolean; // anchor mode active for current cast
  spawn?: { xPx: number; yPx: number; id: string; direction: Direction; isCaught?: boolean; xOverridePx?: number; yOverridePx?: number };
}


