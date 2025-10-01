"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import { useGameEngine } from "./hooks/useGameEngine";
import { HUD } from "./components/HUD";
import { Shop } from "./components/Shop";
import { Controls } from "./components/Controls";
import { Ocean } from "./components/Ocean";
import { SoundToggle } from "./components/SoundToggle";
import { PauseOverlay } from "./components/PauseOverlay";
import { useSoundManager } from "./hooks/useSound";

export default function Game() {
  const engine = useGameEngine();
  const { isMuted, masterVolume, toggleMute, changeVolume } = useSoundManager();

  // Sound system ready for future integration
  // const playSoundEffect = useCallback((sound: string) => {
  //   if (!isMuted && masterVolume > 0) {
  //     playSound(sound, masterVolume);
  //   }
  // }, [isMuted, masterVolume]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (e.repeat) return; // ignore auto-repeat to keep flow smooth
        e.preventDefault();
        engine.cast();
      }
      if (e.code === "Escape") {
        e.preventDefault();
        engine.togglePause();
      }
    };
    
    const onTouch = (e: TouchEvent) => {
      // Don't intercept if game not started or on UI elements
      if (!engine.started || engine.over) return;
      
      const target = e.target as HTMLElement;
      // Ignore touches on buttons and UI
      if (target.tagName === 'BUTTON' || 
          target.closest('button') ||
          target.closest('[class*="hud"]')) {
        return;
      }
      
      e.preventDefault();
      engine.cast();
    };
    
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouch, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [engine]);

  return (
    <div className={styles.container}>
      <div className={styles.gameArea}>
        
        {!engine.started ? (
          <>
            <h1 className={styles.gameTitle}>PIRATE VS OCTOPUS</h1>
            
            {engine.maxLevelReached > 1 ? (
              <div className={styles.levelSelect}>
                <h2 className={styles.welcomeBack}>🎉 Bentornato!</h2>
                <p className={styles.progressText}>Livello massimo raggiunto: <strong>{engine.maxLevelReached}</strong></p>
                
                <div className={styles.levelButtons}>
                  <button 
                    className={styles.continueButton} 
                    onClick={engine.start}
                  >
                    Continua dal Livello {engine.level}
                  </button>
                  
                  <button 
                    className={styles.restartButton} 
                    onClick={engine.startFromBeginning}
                  >
                    Ricomincia dal Livello 1
                  </button>
                </div>
                
                <div className={styles.levelGrid}>
                  {Array.from({ length: engine.maxLevelReached }, (_, i) => i + 1).map(lvl => (
                    <button
                      key={lvl}
                      className={styles.levelButton}
                      onClick={() => engine.startFromLevel(lvl)}
                    >
                      Livello {lvl}
                    </button>
                  ))}
                </div>
                
                <button 
                  className={styles.resetButton} 
                  onClick={engine.resetProgress}
                >
                  🗑️ Cancella Progressi
                </button>
              </div>
            ) : (
              <>
                <div className={styles.tutorial}>
                  <div className={styles.tutorialStep}>
                    <div className={styles.tutorialIcon}>🎯</div>
                    <div className={styles.tutorialText}>Guarda i punti dorati che oscillano</div>
                  </div>
                  <div className={styles.tutorialStep}>
                    <div className={styles.tutorialIcon}>🎣</div>
                    <div className={styles.tutorialText}>Premi SPACE o tocca lo schermo per lanciare l&apos;amo</div>
                  </div>
                  <div className={styles.tutorialStep}>
                    <div className={styles.tutorialIcon}>🐟</div>
                    <div className={styles.tutorialText}>Cattura i pesci per guadagnare punti</div>
                  </div>
                  <div className={styles.tutorialStep}>
                    <div className={styles.tutorialIcon}>🏆</div>
                    <div className={styles.tutorialText}>Completa i 10 livelli progressivi - hai 90 secondi per livello!</div>
                  </div>
                </div>
                <button className={styles.startButton} onClick={engine.start}>Inizia Avventura</button>
              </>
            )}
          </>
        ) : engine.over ? (
          <div className={styles.gameOver}>
            <div className={styles.finalScore}>Score: {engine.score}</div>
            <div className={styles.result}>
              {engine.levelComplete ? (
                engine.level < 10 ? `🎉 Livello ${engine.level} completato! Passa al livello ${engine.level + 1}!` : "🏆 GIOCO COMPLETATO! Hai vinto tutti i 10 livelli!"
              ) : "⏰ Tempo scaduto! Prova di nuovo!"}
              </div>
            {engine.levelComplete && engine.level < 10 ? (
              <button className={styles.startButton} onClick={engine.nextLevel}>Livello {engine.level + 1}</button>
            ) : (
              <button className={styles.startButton} onClick={engine.start}>Restart</button>
          )}
        </div>
        ) : (
          <>
            <HUD score={engine.score} timeLeft={engine.timeLeft} level={engine.level} coins={engine.coins} />
            
            {/* Pause Button */}
            <button 
              className={styles.pauseButton}
              onClick={engine.togglePause}
              title="Pausa (ESC)"
            >
              ⏸️
            </button>
            
            {/* Pause Overlay */}
            {engine.paused && (
              <PauseOverlay 
                onResume={engine.togglePause}
                onQuit={engine.reset}
                coins={engine.coins}
                onBuyRadius={() => engine.purchaseRadius(3, 6)}
                onBuyTime={() => engine.purchaseTime(2, 10)}
                onBuySpeed={() => engine.purchaseSpeed(4, 0.1)}
                isMuted={isMuted}
                volume={masterVolume}
                onToggleMute={toggleMute}
                onVolumeChange={changeVolume}
              />
            )}
            
            <Ocean
              lanes={engine.lanes}
              fish={engine.fish}
              indicatorDeg={engine.indicatorDeg}
              hook={engine.hook}
              bonusSpawn={engine.bonus.spawn}
              bonusActive={engine.bonus.active}
              level={engine.level}
              gameWidth={engine.constants.GAME_WIDTH_PX}
              gameHeight={engine.constants.GAME_HEIGHT_PX}
            />
            <Controls onCast={engine.cast} />
          </>
        )}
      </div>
    </div>
  );
}

