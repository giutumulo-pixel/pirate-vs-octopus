"use client";
import styles from "./page.module.css";
import { GameButtons } from "./components/GameButtons";
import { Title } from "./components/Title";
import { Subtitle } from "./components/Subtitle";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.waitlistForm}>
          <Title>🏴‍☠️ Pirate vs Octopus 🐙</Title>
          <Subtitle>
            Welcome! Cast your hook and catch the biggest fish in the ocean!
          </Subtitle>
          <GameButtons />
        </div>
      </div>
    </div>
  );
}
