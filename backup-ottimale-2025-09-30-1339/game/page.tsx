"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import { useGameEngine } from "./hooks/useGameEngine";
import { HUD } from "./components/HUD";
import { Controls } from "./components/Controls";
import { Ocean } from "./components/Ocean";

export default function Game() {
  const engine = useGameEngine();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (e.repeat) return; // ignore auto-repeat to keep flow smooth
        e.preventDefault();
        engine.cast();
      }
    };
    
    const onTouch = (e: TouchEvent) => {
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
                <div className={styles.tutorialText}>Raggiungi 5000 punti in 60 secondi!</div>
              </div>
            </div>
            <button className={styles.startButton} onClick={engine.start}>Start</button>
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
            <HUD score={engine.score} timeLeft={engine.timeLeft} level={engine.level} />
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

