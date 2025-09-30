"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BonusState, Direction, FishKind, FishSprite, HookState, LaneConfig } from "../components/types";

const GAME_WIDTH_PX = 800; // logical width for layout calculations
const GAME_HEIGHT_PX = 600;
// Visual offsets used when rendering hook in Ocean.tsx; use same for collisions
// These must match constants.ts: HOOK_X_OFFSET_PX = 53, HOOK_Y_OFFSET_PX = 100
const HOOK_VISUAL_OFFSET_X_PX = 53;
const HOOK_VISUAL_OFFSET_Y_PX = 100;

function generateLanes(): LaneConfig[] {
  // 8 lanes from near-surface to abyssal depths, faster at top, legendary monsters at bottom
  const lanes: Array<{ kind: FishKind; points: number }> = [
    { kind: "small", points: 30 },
    { kind: "small", points: 45 },
    { kind: "medium", points: 80 },
    { kind: "large", points: 150 },
    { kind: "shark", points: 300 },
    { kind: "monster", points: 1000 },
    { kind: "kraken", points: 2000 },      // Legendary deep sea beast
    { kind: "leviathan", points: 5000 },   // Ultimate mythical creature
  ];
  return lanes.map((lane, i) => {
    const direction: Direction = i % 2 === 0 ? 1 : -1;
    // Deep ocean: start at 40%, then increase spacing from lane 1 onwards
    // Lane 0: 40% (unchanged, near surface)
    // Lane 1-7: progressively deeper with 8.5% spacing (fits all within 100%)
    const yPercent = i === 0 ? 40 : 40 + i * 8.5; // Balanced spacing to fit all lanes
    // Slightly slower overall movement
    const speedPxPerSec = 30 + (7 - i) * 6; // adjusted for 8 lanes, slower deep monsters
    // Reduce spawn/density by increasing spacing, rarest at bottom
    const spacingPx = 160 - i * 3 + (i >= 6 ? 50 : 0); // legendary monsters are rarer
    return {
      id: i,
      yPercent,
      speedPxPerSec,
      direction,
      spacingPx,
      kind: lane.kind,
      points: lane.points,
    } satisfies LaneConfig;
  });
}

function wrapX(x: number): number {
  // wrap around horizontally so fish never bounce, they re-enter
  if (x < -200) return GAME_WIDTH_PX + x % GAME_WIDTH_PX;
  if (x > GAME_WIDTH_PX + 200) return x % GAME_WIDTH_PX - 200;
  return x;
}

export function useGameEngine() {
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds - more time for harder levels
  const [level, setLevel] = useState(1);
  const [levelComplete, setLevelComplete] = useState(false);
  const [maxLevelReached, setMaxLevelReached] = useState(1);

  const lanes = useMemo(() => generateLanes(), []);
  const [fish, setFish] = useState<FishSprite[]>([]);

  // Load saved progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMaxLevel = localStorage.getItem('pirateMaxLevel');
      if (savedMaxLevel) {
        const maxLevel = parseInt(savedMaxLevel, 10);
        if (maxLevel > 1 && maxLevel <= 10) {
          setMaxLevelReached(maxLevel);
          setLevel(maxLevel); // Start from saved level
        }
      }
    }
  }, []);

  const [indicatorDeg, setIndicatorDeg] = useState(0);
  const indicatorDir = useRef<Direction>(1);

  const [hook, setHook] = useState<HookState | null>(null);
  const hookRef = useRef<HookState | null>(null);
  const [bonus, setBonus] = useState<BonusState>({ active: false });
  const bonusSpawnRef = useRef<BonusState["spawn"]>(undefined);
  
  // Track fish that have already been scored this cast to prevent duplicate scoring
  const scoredFishIds = useRef<Set<string>>(new Set());

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // keep refs in sync to avoid loop dependency churn
  useEffect(() => { hookRef.current = hook; }, [hook]);
  useEffect(() => { bonusSpawnRef.current = bonus.spawn; }, [bonus.spawn]);

  // Initialize fish sprites spaced across lanes
  useEffect(() => {
    const initial: FishSprite[] = [];
    for (const lane of lanes) {
      // distribute fish across width with spacing
      const count = Math.max(3, Math.floor(GAME_WIDTH_PX / lane.spacingPx));
      for (let i = 0; i < count; i++) {
        const base = i * lane.spacingPx + (lane.direction === 1 ? -200 : 0);
        initial.push({
          id: `${lane.id}-${i}`,
          laneId: lane.id,
          kind: lane.kind,
          xPx: base,
        });
      }
    }
    setFish(initial);
  }, [lanes]);

  // Indicator oscillation
  useEffect(() => {
    if (!started || over || hook || paused) return; // stop oscillating when hook is active or paused
    const id = setInterval(() => {
      setIndicatorDeg(prev => {
        let next = prev + indicatorDir.current * 0.5; // very slow oscillation
        const LIMIT = 60;
        if (next > LIMIT) {
          next = LIMIT;
          indicatorDir.current = -1;
        } else if (next < -LIMIT) {
          next = -LIMIT;
          indicatorDir.current = 1;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(id);
  }, [started, over, hook]);

  // Bonus spawn timer - spawn anchor on second lane
  useEffect(() => {
    if (!started || over) return;
    
    const lane = lanes[1]; // second lane (index 1)
    const direction = lane.direction;
    
    // Spawn anchor immediately at game start if not present AND bonus not active
    if (!bonus.spawn && !bonus.active) {
      const startX = direction === 1 ? -100 : GAME_WIDTH_PX + 100; // start off-screen
      setBonus(b => ({ ...b, spawn: { 
        id: `${Date.now()}`, 
        xPx: startX, 
        yPx: (lane.yPercent / 100) * GAME_HEIGHT_PX,
        direction
      } }));
    }
    
    const id = setInterval(() => {
      setBonus(b => {
        // Only respawn if no spawn and no active bonus
        if (!b.spawn && !b.active) {
          const startX = direction === 1 ? -100 : GAME_WIDTH_PX + 100;
          return { 
            ...b, 
            spawn: { 
              id: `${Date.now()}`, 
              xPx: startX, 
              yPx: (lane.yPercent / 100) * GAME_HEIGHT_PX,
              direction
            } 
          };
        }
        return b;
      });
    }, 10000);
    return () => clearInterval(id);
  }, [started, over, lanes]);

  // Main loop
  const loop = useCallback((ts: number) => {
    if (!started || over || paused) return;
    const last = lastTsRef.current ?? ts;
    const dt = Math.min(0.05, (ts - last) / 1000); // clamp dt
    lastTsRef.current = ts;

    // move fish
    setFish(prev => prev.map(f => {
      const lane = lanes.find(l => l.id === f.laneId)!;
      const dx = lane.speedPxPerSec * dt * lane.direction;
      return { ...f, xPx: wrapX(f.xPx + dx) };
    }));

    // move anchor bonus
    setBonus(prev => {
      if (!prev.spawn) return prev;
      const hookNow = hookRef.current;
      
      // If caught, follow the hook
      if (prev.spawn.isCaught && hookNow) {
        const followX = hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX;
        const followY = hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX;
        
        // When hook returns to top, remove anchor (it disappears)
        if (!hookNow.isCasting && hookNow.isReturning && followY <= 0) {
          return {
            active: prev.active, // Keep bonus active
            spawn: undefined // Remove anchor, it disappears
          };
        }
        
        return {
          ...prev,
          spawn: { ...prev.spawn, xOverridePx: followX, yOverridePx: followY }
        };
      }
      
      // Normal movement when not caught
      const lane = lanes[1]; // second lane
      const dx = lane.speedPxPerSec * dt * prev.spawn.direction;
      const newX = wrapX(prev.spawn.xPx + dx);
      return {
        ...prev,
        spawn: { ...prev.spawn, xPx: newX }
      };
    });

    // move hook
    setHook(prev => {
      if (!prev) return prev;
      // Slower descent, faster ascent
      const speedDown = 140; // px/sec
      const speedUp = 320;
      let { xPx, yPx, isCasting, isReturning } = prev;
      if (isCasting) {
        // move along angle downwards
        const rad = (prev.angleDeg * Math.PI) / 180;
        const newX = xPx + Math.sin(rad) * speedDown * dt;
        const newY = yPx + Math.cos(rad) * speedDown * dt;
        // Clamp to screen edges and trigger return if hitting sides
        const clampedX = Math.max(0, Math.min(GAME_WIDTH_PX, newX));
        const clampedY = Math.max(0, Math.min(GAME_HEIGHT_PX, newY));
        
        // If hitting left/right edge, start returning
        if (clampedX !== newX) {
          isCasting = false;
          isReturning = true;
        }
        
        xPx = clampedX;
        yPx = clampedY;
        // bottom reached -> start return (clamp to screen edge)
        if (yPx >= GAME_HEIGHT_PX) {
          yPx = GAME_HEIGHT_PX;
          isCasting = false;
          isReturning = true;
        }
      } else if (isReturning) {
        const rad = (prev.angleDeg * Math.PI) / 180;
        const newX = xPx - Math.sin(rad) * speedUp * dt;
        const newY = yPx - Math.cos(rad) * speedUp * dt;
        // Clamp to screen edges during return
        xPx = Math.max(0, Math.min(GAME_WIDTH_PX, newX));
        yPx = Math.max(0, Math.min(GAME_HEIGHT_PX, newY));
        if (yPx <= 0) return null; // finished
      }
      return { ...prev, xPx, yPx, isCasting, isReturning };
    });

    // collisions fish-hook and anchor-hook
    setFish(prev => {
      const hookNow = hookRef.current;
      if (!hookNow) return prev;
      
      // Different behavior for normal vs powered hook
      const isNormalHook = !hookNow.usingAnchor;
      const isPoweredHook = hookNow.usingAnchor;
      
      // Base catch radius - powered hook is more forgiving overall
      const baseCatchRadius = isPoweredHook ? 65 : 35;
      
      // Function to get catch radius based on fish depth (lane)
      // Deeper fish (more points) = smaller radius = harder to catch
      // Powered hook has much less difficulty penalty on deep fish!
      const getCatchRadiusForLane = (laneId: number) => {
        if (isPoweredHook) {
          // Powered hook: much gentler difficulty curve
          // Lane 0-1: 100% radius
          // Lane 2: 95% radius
          // Lane 3: 90% radius  
          // Lane 4: 85% radius
          // Lane 5: 80% radius (monsters)
          // Lane 6: 75% radius (kraken - legendary)
          // Lane 7: 70% radius (leviathan - mythical)
          const difficultyMultiplier = Math.max(0.7, 1 - (laneId * 0.05));
          return baseCatchRadius * difficultyMultiplier;
        } else {
          // Normal hook: steep difficulty curve
          // Lane 0-1: 100% radius
          // Lane 2: 85% radius
          // Lane 3: 70% radius
          // Lane 4: 55% radius
          // Lane 5: 40% radius (monsters very hard)
          // Lane 6: 30% radius (kraken - extremely hard)
          // Lane 7: 25% radius (leviathan - nearly impossible)
          const difficultyMultiplier = Math.max(0.25, 1 - (laneId * 0.15));
          return baseCatchRadius * difficultyMultiplier;
        }
      };
      
      const canCatch = isPoweredHook 
        ? (hookNow.isCasting || hookNow.isReturning) // Powered: catches both ways
        : hookNow.isCasting; // Normal: only during descent
      
      const updated: FishSprite[] = [];
      let normalHookHasCaught = false; // Track if normal hook already caught a fish
      
      // Check collision with anchor bonus
      if (bonusSpawnRef.current && !bonusSpawnRef.current.isCaught) {
        // Use actual position (xOverridePx if exists, otherwise xPx)
        const anchorX = bonusSpawnRef.current.xOverridePx ?? bonusSpawnRef.current.xPx;
        const anchorY = bonusSpawnRef.current.yOverridePx ?? bonusSpawnRef.current.yPx;
        const dx = (hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX) - anchorX;
        const dy = (hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX) - anchorY;
        const dist2 = dx * dx + dy * dy;
        const anchorCatchRadius = 40; // Larger radius for anchor (easier to catch)
        if (dist2 < anchorCatchRadius * anchorCatchRadius) {
          // Anchor caught! Mark it to follow hook up and STOP hook immediately
          const attachX = hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX;
          const attachY = hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX;
          setBonus(prev => ({
            active: true, // Bonus available for next cast
            spawn: prev.spawn ? { ...prev.spawn, isCaught: true, xOverridePx: attachX, yOverridePx: attachY } : undefined
          }));
          // Stop casting and start returning immediately
          setHook(h => h ? { ...h, isCasting: false, isReturning: true } : h);
        }
      }
      
      // For normal hook, find closest fish to avoid "passing through" issue
      // For powered hook, catch all fish in radius
      if (isNormalHook && canCatch) {
        // Find the closest fish in radius for normal hook
        let closestFish: { fish: FishSprite; dist2: number } | null = null;
        
        for (const f of prev) {
          if (f.isCaught) continue;
          
          // Get difficulty-adjusted catch radius for this fish's lane
          const catchRadius = getCatchRadiusForLane(f.laneId);
          
          const yLanePx = (lanes.find(l => l.id === f.laneId)!.yPercent / 100) * GAME_HEIGHT_PX;
          const dx = ((hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX) - f.xPx);
          const dy = ((hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX) - yLanePx);
          const dist2 = dx * dx + dy * dy;
          
          if (dist2 < catchRadius * catchRadius) {
            if (!closestFish || dist2 < closestFish.dist2) {
              closestFish = { fish: f, dist2 };
            }
          }
        }
        
        // If found a fish, catch only that one
        if (closestFish) {
          // Only score if this fish hasn't been scored yet
          if (!scoredFishIds.current.has(closestFish.fish.id)) {
            const lane = lanes.find(l => l.id === closestFish.fish.laneId)!;
            setScore(s => s + lane.points);
            scoredFishIds.current.add(closestFish.fish.id);
          }
          setHook(h => h ? { ...h, isCasting: false, isReturning: true } : h);
          
          const attachX = hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX;
          const attachY = hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX;
          
          for (const f of prev) {
            if (f.id === closestFish.fish.id) {
              updated.push({ ...f, isCaught: true, xOverridePx: attachX, yOverridePx: attachY });
            } else {
              updated.push(f);
            }
          }
        } else {
          // No fish caught, return all as-is
          updated.push(...prev);
        }
      } else {
        // Powered hook OR not in catching phase: check all fish
        for (const f of prev) {
          // Skip if this fish is already caught
          if (f.isCaught) {
            updated.push(f);
            continue;
          }
          
          // Skip catching if not in correct phase
          if (!canCatch) {
            updated.push(f);
            continue;
          }
          
          // Get difficulty-adjusted catch radius for this fish's lane
          const catchRadius = getCatchRadiusForLane(f.laneId);
          
          const yLanePx = (lanes.find(l => l.id === f.laneId)!.yPercent / 100) * GAME_HEIGHT_PX;
          const dx = ((hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX) - f.xPx);
          const dy = ((hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX) - yLanePx);
          const dist2 = dx * dx + dy * dy;
          
          if (dist2 < catchRadius * catchRadius) {
            // Powered hook caught a fish!
            // Only score if this fish hasn't been scored yet
            if (!scoredFishIds.current.has(f.id)) {
              const lane = lanes.find(l => l.id === f.laneId)!;
              setScore(s => s + lane.points);
              scoredFishIds.current.add(f.id);
            }
            
            // mark as caught and start rising animation (stick to hook position)
            const attachX = hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX;
            const attachY = hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX;
            updated.push({ ...f, isCaught: true, xOverridePx: attachX, yOverridePx: attachY });
          } else {
            updated.push(f);
          }
        }
      }
      return updated;
    });

    // if any fish are marked caught, make them follow hook up and remove at top
    setFish(prev => {
      const hookNow = hookRef.current;
      if (!hookNow) return prev.map(p => ({ ...p, isCaught: false, xOverridePx: undefined, yOverridePx: undefined }));
      return prev.map(p => {
        if (!p.isCaught) return p;
        const followX = hookNow.xPx + HOOK_VISUAL_OFFSET_X_PX;
        const followY = hookNow.yPx + HOOK_VISUAL_OFFSET_Y_PX;
        // When hook returns to top, remove fish (respawn off-screen)
        if (!hookNow.isCasting && hookNow.isReturning && followY <= 0) {
          const lane = lanes.find(l => l.id === p.laneId)!;
          const respawnX = lane.direction === 1 ? -200 : GAME_WIDTH_PX + 200;
          return { ...p, isCaught: false, xOverridePx: undefined, yOverridePx: undefined, xPx: respawnX };
        }
        return { ...p, xOverridePx: followX, yOverridePx: followY };
      });
    });

    rafRef.current = requestAnimationFrame(loop);
  }, [started, over, lanes]);

  useEffect(() => {
    if (!started || over || paused) return;
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [started, over, paused, loop]);

  // countdown timer and level progression
  useEffect(() => {
    if (!started || over || paused) return;
    if (timeLeft <= 0) {
      setOver(true);
      return;
    }
    // Check level completion - progressive targets (adjusted for legendary monsters)
    // Targets rebalanced for 90 second timer and new deep sea creatures
    const levelTargets = [0, 2000, 4000, 6000, 8000, 12000, 16000, 20000, 25000, 30000, 40000];
    const levelTarget = levelTargets[level] || 40000;
    if (score >= levelTarget && !levelComplete) {
      setLevelComplete(true);
      setOver(true);
      // Save progress if reached new max level
      const nextLevel = level + 1;
      if (nextLevel > maxLevelReached && nextLevel <= 10) {
        setMaxLevelReached(nextLevel);
        if (typeof window !== 'undefined') {
          localStorage.setItem('pirateMaxLevel', nextLevel.toString());
        }
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [started, over, paused, timeLeft, score, level, levelComplete, maxLevelReached]);

  const start = useCallback(() => {
    // Start from current level (could be saved level)
    setScore(0);
    setTimeLeft(90);
    setOver(false);
    setLevelComplete(false);
    setStarted(true);
    setBonus({ active: false, spawn: undefined });
    setHook(null);
  }, []);

  const startFromBeginning = useCallback(() => {
    setLevel(1); // Explicitly start from level 1
    setScore(0);
    setTimeLeft(90);
    setOver(false);
    setLevelComplete(false);
    setStarted(true);
    setBonus({ active: false, spawn: undefined });
    setHook(null);
  }, []);

  const startFromLevel = useCallback((targetLevel: number) => {
    setLevel(targetLevel);
    setScore(0);
    setTimeLeft(90);
    setOver(false);
    setLevelComplete(false);
    setStarted(true);
    setBonus({ active: false, spawn: undefined });
    setHook(null);
  }, []);

  const resetProgress = useCallback(() => {
    setMaxLevelReached(1);
    setLevel(1);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pirateMaxLevel');
    }
  }, []);

  const nextLevel = useCallback(() => {
    setLevel(prev => Math.min(prev + 1, 10)); // Max 10 levels
    setScore(0);
    setTimeLeft(90);
    setOver(false);
    setLevelComplete(false);
    setStarted(true);
    setBonus({ active: false, spawn: undefined });
    setHook(null);
  }, []);

  const cast = useCallback(() => {
    if (!started || over || paused) return;
    if (hook) return; // only one at a time
    const angleSnapshot = indicatorDeg;
    const usingAnchor = !!bonus.active;
    
    // Clear scored fish tracking for new cast
    scoredFishIds.current.clear();
    
    // If using anchor bonus, consume it and prepare for respawn
    if (usingAnchor) {
      setBonus({ active: false, spawn: undefined });
    }
    
    setHook({
      isCasting: true,
      isReturning: false,
      xPx: GAME_WIDTH_PX / 2,
      yPx: 0,
      angleDeg: angleSnapshot,
      usingAnchor,
    });
    // Stop indicator oscillation when casting
    setIndicatorDeg(angleSnapshot);
  }, [started, over, paused, hook, indicatorDeg, bonus.active]);

  const togglePause = useCallback(() => {
    if (!started || over) return;
    setPaused(prev => !prev);
  }, [started, over]);

  const reset = useCallback(() => {
    setStarted(false);
    setOver(false);
    setLevel(1);
    setLevelComplete(false);
    setHook(null);
    setBonus({ active: false, spawn: undefined });
  }, []);

  return {
    // state
    started,
    over,
    paused,
    score,
    timeLeft,
    level,
    levelComplete,
    maxLevelReached,
    lanes,
    fish,
    indicatorDeg,
    hook,
    bonus,
    // actions
    start,
    startFromBeginning,
    startFromLevel,
    nextLevel,
    cast,
    reset,
    resetProgress,
    togglePause,
    constants: { GAME_WIDTH_PX, GAME_HEIGHT_PX },
  };
}


