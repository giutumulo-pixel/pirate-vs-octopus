/* ========== LOCKED POSITIONS - DO NOT MODIFY ========== */
/* All visual elements are anchored together as a single unit */
/* Ship is at 35% waterline + 18px offset */

// Ship base position (reference point for all elements)
export const SHIP_BASE_PERCENT = 35; // waterline position
export const SHIP_OFFSET_PX = 18; // pixels below waterline

// Pirate position (CSS: bottom: 370px, left: 50%, transform: translateX(-15%))
// LOCKED - matches page.module.css .pirateOnDeck

// Fishing rod / indicator / line start position
export const ROD_TIP_X_PERCENT = 57.375; // horizontal position (% of gameWidth)
export const ROD_TIP_Y_PERCENT = 17.6666; // vertical position (% of gameHeight)
// LOCKED - these coordinates position the rod tip on the pirate's fishing rod

// Hook offsets (applied to hook.xPx and hook.yPx during casting)
export const HOOK_Y_OFFSET_PX = 100; // vertical offset
export const HOOK_X_OFFSET_PX = 53;  // horizontal offset
export const HOOK_SIZE_PX = 28;      // must match CSS .hook size
export const ATTACH_EPS_PX = -7;     // line attachment point behind hook

// IMPORTANT: Do not modify these values unless recalibrating the entire unit
/* ====================================================== */
