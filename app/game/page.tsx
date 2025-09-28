"use client";
import { useState, useEffect, useCallback } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import styles from "./page.module.css";

interface Fish {
  id: number;
  x: number;
  y: number;
  type: 'small' | 'medium' | 'dolphin' | 'shark' | 'swordfish' | 'monster';
  emoji: string;
  points: number;
  speed: number;
  direction: number; // 1 for right, -1 for left
}

interface Hook {
  x: number;
  y: number;
  isCasting: boolean;
  isReeling: boolean;
  oscillationAngle: number; // Angle of oscillation (-30 to 30 degrees)
  oscillationSpeed: number; // Speed of oscillation
  oscillationDirection: number; // 1 or -1 for direction
}

export default function PirateGame() {
  const { context } = useMiniKit();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fish, setFish] = useState<Fish[]>([]);
  const [hook, setHook] = useState<Hook>({ 
    x: 50, 
    y: 15, 
    isCasting: false, 
    isReeling: false, 
    oscillationAngle: 0, 
    oscillationSpeed: 2, 
    oscillationDirection: 1 
  });
  const [caughtFish, setCaughtFish] = useState<Fish | null>(null);

  const fishTypes = [
    { type: 'small' as const, emoji: '🐟', points: 10, speed: 1 },
    { type: 'medium' as const, emoji: '🐠', points: 25, speed: 0.8 },
    { type: 'dolphin' as const, emoji: '🐬', points: 50, speed: 0.7 },
    { type: 'shark' as const, emoji: '🦈', points: 75, speed: 0.6 },
    { type: 'swordfish' as const, emoji: '🐡', points: 100, speed: 0.5 },
    { type: 'monster' as const, emoji: '🐙', points: 500, speed: 0.4 },
  ];

  const populateOcean = useCallback(() => {
    const levels = [
      { y: 35, type: 'small', direction: 1 },      // Level 1: Small fish (10 pts) - Right
      { y: 45, type: 'medium', direction: -1 },    // Level 2: Medium fish (25 pts) - Left
      { y: 55, type: 'dolphin', direction: 1 },    // Level 3: Dolphins (50 pts) - Right
      { y: 65, type: 'shark', direction: -1 },     // Level 4: Sharks (75 pts) - Left
      { y: 75, type: 'swordfish', direction: 1 },  // Level 5: Swordfish (100 pts) - Right
      { y: 90, type: 'monster', direction: -1 }    // Level 6: Deep sea monsters (500 pts) - Left
    ];
    
    const initialFish: Fish[] = [];
    
    levels.forEach(level => {
      const fishType = fishTypes.find(ft => ft.type === level.type) || fishTypes[0];
      // Random number of fish per level (2-5 for normal fish, 1-2 for monsters)
      const maxFish = level.type === 'monster' ? 2 : 5;
      const minFish = level.type === 'monster' ? 1 : 2;
      const fishPerLevel = Math.floor(Math.random() * (maxFish - minFish + 1)) + minFish;
      
      for (let i = 0; i < fishPerLevel; i++) {
        // Random spacing and position for more natural distribution
        const randomSpacing = Math.random() * 25 + 15; // 15-40% spacing
        const randomOffset = (Math.random() - 0.5) * 10; // ±5% random offset
        const startX = level.direction === 1 ? 
          -15 + (i * randomSpacing) + randomOffset : 
          115 - (i * randomSpacing) + randomOffset;
        
        // Random Y position within level range (±2%)
        const randomY = level.y + (Math.random() - 0.5) * 4;
        
        initialFish.push({
          id: Date.now() + Math.random() + i,
          x: startX,
          y: randomY,
          direction: level.direction,
          ...fishType
        });
      }
    });
    
    setFish(initialFish);
  }, []);

  const spawnFish = useCallback(() => {
    // Dynamic spawn based on current fish population and game time
    const maxFish = 25; // Increased max fish
    const currentTime = Date.now() * 0.001;
    
    if (fish.length < maxFish) {
      const levels = [
        { y: 35, type: 'small', direction: 1, weight: 3 },      // More common
        { y: 45, type: 'medium', direction: -1, weight: 3 },    // More common
        { y: 55, type: 'dolphin', direction: 1, weight: 2 },    // Less common
        { y: 65, type: 'shark', direction: -1, weight: 2 },     // Less common
        { y: 75, type: 'swordfish', direction: 1, weight: 1 },  // Rare
        { y: 90, type: 'monster', direction: -1, weight: 1 }    // Rare
      ];
      
      // Weighted random selection
      const totalWeight = levels.reduce((sum, level) => sum + level.weight, 0);
      let randomWeight = Math.random() * totalWeight;
      let selectedLevel = levels[0];
      
      for (const level of levels) {
        randomWeight -= level.weight;
        if (randomWeight <= 0) {
          selectedLevel = level;
          break;
        }
      }
      
      const existingFishOnLevel = fish.filter(f => Math.abs(f.y - selectedLevel.y) < 8);
      const maxFishPerLevel = selectedLevel.type === 'monster' ? 2 : 6;
      
      if (existingFishOnLevel.length < maxFishPerLevel) {
        const fishType = fishTypes.find(ft => ft.type === selectedLevel.type) || fishTypes[0];
        
        // Random spawn position with variation
        const randomOffset = (Math.random() - 0.5) * 20; // ±10% random offset
        const startX = selectedLevel.direction === 1 ? 
          -10 + randomOffset : 
          110 + randomOffset;
        
        // Random Y position within level range
        const randomY = selectedLevel.y + (Math.random() - 0.5) * 6;
        
        const newFish: Fish = {
          id: Date.now() + Math.random(),
          x: startX,
          y: randomY,
          direction: selectedLevel.direction,
          ...fishType
        };
        setFish(prev => [...prev, newFish]);
      }
    }
  }, [fish]);

  const moveFish = useCallback(() => {
    setFish(prev => {
      const time = Date.now() * 0.001; // Convert to seconds
      
      return prev.map(f => {
        // Synchronized movement - all fish move at the same base speed
        const baseSpeed = 0.3; // Unified speed for all fish
        const waveOffset = Math.sin(time * 2 + f.id * 0.1) * 0.2; // Subtle wave motion
        const newX = f.x + (baseSpeed * f.direction) + waveOffset;
        
        return {
          ...f,
          x: newX
        };
      }).filter(f => f.x >= -20 && f.x <= 120); // Allow fish to go beyond screen bounds
    });
  }, []);

  const oscillateHook = useCallback(() => {
    setHook(prev => {
      if (prev.isCasting || prev.isReeling) return prev;
      
      let newAngle = prev.oscillationAngle + (prev.oscillationSpeed * prev.oscillationDirection);
      
      // Reverse direction when reaching limits
      if (newAngle >= 30) {
        newAngle = 30;
        return { ...prev, oscillationAngle: newAngle, oscillationDirection: -1 };
      } else if (newAngle <= -30) {
        newAngle = -30;
        return { ...prev, oscillationAngle: newAngle, oscillationDirection: 1 };
      }
      
      return { ...prev, oscillationAngle: newAngle };
    });
  }, []);

  const castHook = useCallback(() => {
    if (hook.isCasting || hook.isReeling) return;
    
    setHook(prev => ({ ...prev, isCasting: true }));
    
    // Calculate hook landing position based on oscillation angle from fixed rod position
    const rodX = 50; // Fixed rod position at center
    const rodY = 15; // Fixed rod position at ship level
    const maxDepth = 80; // Maximum depth the hook can reach
    const depth = maxDepth - rodY; // Total depth to travel
    
    // Calculate landing position using trigonometry for realistic trajectory
    const angleRad = (hook.oscillationAngle * Math.PI) / 180; // Convert to radians
    const hookLandingX = Math.max(10, Math.min(90, rodX + (Math.sin(angleRad) * depth * 0.3)));
    
    // Animate hook descending gradually
    const descentSteps = 20; // Number of steps for smooth descent
    const stepDelay = 40; // 40ms between each step
    const totalDescentTime = descentSteps * stepDelay; // 800ms total
    
    let currentStep = 0;
    const descentInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / descentSteps;
      const currentY = rodY + (progress * depth); // From rod position to max depth
      
      // Calculate X position using the same angle but with progress
      const currentAngleRad = (hook.oscillationAngle * Math.PI) / 180;
      const currentDepth = progress * depth;
      const currentX = Math.max(10, Math.min(90, rodX + (Math.sin(currentAngleRad) * currentDepth * 0.3)));
      
      setHook(prev => ({ ...prev, y: currentY, x: currentX }));
      
      if (currentStep >= descentSteps) {
        clearInterval(descentInterval);
        setHook(prev => ({ ...prev, isCasting: false, isReeling: true }));
        
        // Check for fish collision at the hook's final position
        const hookRect = { x: hookLandingX, y: 80, width: 8, height: 8 };
        const caughtFish = fish.find(f => {
          const fishRect = { x: f.x, y: f.y, width: 8, height: 8 };
          return hookRect.x < fishRect.x + fishRect.width &&
                 hookRect.x + hookRect.width > fishRect.x &&
                 hookRect.y < fishRect.y + fishRect.height &&
                 hookRect.y + hookRect.height > fishRect.y;
        });

        if (caughtFish) {
          setCaughtFish(caughtFish);
          setScore(prev => prev + caughtFish.points);
          setFish(prev => prev.filter(f => f.id !== caughtFish.id));
        }

        // Faster ascent - reel hook back up quickly
        setTimeout(() => {
          setHook(prev => ({ ...prev, y: rodY, x: rodX, isReeling: false }));
          setCaughtFish(null);
        }, 600);
      }
    }, stepDelay);
  }, [hook, fish]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setHook({ x: 50, y: 15, isCasting: false, isReeling: false, oscillationAngle: 0, oscillationSpeed: 2, oscillationDirection: 1 });
    setCaughtFish(null);
    // Populate ocean with fish immediately
    populateOcean();
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameInterval = setInterval(() => {
      moveFish();
      oscillateHook();
      // Dynamic spawn rate based on current fish population
      const spawnChance = fish.length < 15 ? 0.15 : fish.length < 20 ? 0.1 : 0.05;
      if (Math.random() < spawnChance) spawnFish();
    }, 100);

    const timeInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(timeInterval);
    };
  }, [gameStarted, gameOver, moveFish, spawnFish]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        castHook();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [castHook]);

  if (!gameStarted) {
    return (
      <div className={styles.container}>
        <div className={styles.gameArea}>
          <h1 className={styles.title}>🏴‍☠️ Pirate vs Octopus 🐙</h1>
          <div className={styles.instructions}>
            <p>🎯 <strong>Goal:</strong> Reach 5000 points in 60 seconds!</p>
            <p>🎣 <strong>Controls:</strong> Press SPACE to cast your hook!</p>
            <p>🔄 <strong>Hook Oscillation:</strong> The hook swings left and right - time your cast!</p>
            <p>🌊 <strong>Fish Levels:</strong> 6 levels with alternating directions!</p>
            <div className={styles.scoring}>
              <p>🐟 Level 1: Small fish (10 pts) →</p>
              <p>🐠 Level 2: Medium fish (25 pts) ←</p>
              <p>🐬 Level 3: Dolphins (50 pts) →</p>
              <p>🦈 Level 4: Sharks (75 pts) ←</p>
              <p>🐡 Level 5: Swordfish (100 pts) →</p>
              <p>🐙 Level 6: Deep sea monsters (500 pts) ←</p>
            </div>
          </div>
          <button className={styles.startButton} onClick={startGame}>
            🚢 START FISHING! 🏴‍☠️
          </button>
          {context?.user?.displayName && (
            <p className={styles.welcome}>Welcome, {context.user.displayName}! ⚓</p>
          )}
        </div>
      </div>
    );
  }

  if (gameOver) {
    const won = score >= 5000;
    return (
      <div className={styles.container}>
        <div className={styles.gameArea}>
          <h1 className={styles.title}>
            {won ? '🏆 VICTORY! 🏆' : '💀 GAME OVER 💀'}
          </h1>
          <div className={styles.gameOver}>
            <p className={styles.finalScore}>Final Score: {score} / 5000</p>
            <p className={styles.result}>
              {won ? '🏴‍☠️ You are the greatest pirate! 🏴‍☠️' : '🐙 The octopus got you! 🐙'}
            </p>
            <button className={styles.startButton} onClick={startGame}>
              🚢 PLAY AGAIN! 🏴‍☠️
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameArea}>
        <div className={styles.hud}>
          <div className={styles.score}>Score: {score} / 5000</div>
          <div className={styles.time}>Time: {timeLeft}s</div>
        </div>
        
        <div className={styles.ocean}>
          {/* Sky */}
          <div className={styles.sky}></div>
          
          {/* Water */}
          <div className={styles.water}></div>
          
          {/* Pirate Ship with Captain and Flag */}
          <div className={styles.shipContainer}>
            <div className={styles.pirateFlag}>🏴‍☠️</div>
            <div className={styles.ship}>🚢</div>
            <div className={styles.captain}>👨‍✈️</div>
          </div>
          
          {/* Fishing Rod - Fixed on ship */}
          <div 
            className={styles.fishingRod}
            style={{ 
              transform: `translateX(-50%) rotate(${hook.oscillationAngle}deg)`,
              transformOrigin: 'center bottom'
            }}
          >
            🎣
          </div>
          
          {/* Fishing Line and Hook Container - Synchronized movement */}
          {(hook.isCasting || hook.isReeling) && (
            <div 
              className={styles.fishingLineContainer}
              style={{ 
                left: '50%',
                top: '15%',
                transform: `translateX(-50%) rotate(${hook.oscillationAngle}deg)`,
                transformOrigin: 'top center'
              }}
            >
              {/* Fishing Line */}
              <div 
                className={styles.fishingLine}
                style={{ 
                  height: `${hook.y - 15}%`
                }}
              />
              
              {/* Hook at the end of the line */}
              <div 
                className={`${styles.hook} ${hook.isCasting ? styles.casting : ''} ${hook.isReeling ? styles.reeling : ''}`}
                style={{ 
                  top: `${hook.y - 15}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                🪝
              </div>
            </div>
          )}
          
         {/* Fish */}
         {fish.map(f => (
           <div
             key={f.id}
             className={styles.fish}
             data-type={f.type}
             data-direction={f.direction}
             style={{ left: `${f.x}%`, top: `${f.y}%` }}
           >
             {f.emoji}
           </div>
         ))}
          
          {/* Caught Fish Display */}
          {caughtFish && (
            <div className={styles.caughtFish}>
              <div 
                className={styles.caughtFishEmoji}
                data-direction={caughtFish.direction}
              >
                {caughtFish.emoji}
              </div>
              <div className={styles.caughtFishPoints}>+{caughtFish.points}</div>
            </div>
          )}
        </div>
        
        <div className={styles.controls}>
          <p>Press <strong>SPACE</strong> to cast hook! 🏴‍☠️</p>
          <p>🔄 Hook oscillates - time your cast for better accuracy!</p>
          <p>🌊 Fish swim in alternating directions on 6 levels!</p>
        </div>
      </div>
    </div>
  );
}

