"use client";
import styles from "../page.module.css";

export function Shop({
  coins,
  onBuyRadius,
  onBuyTime,
  onBuySpeed,
}: {
  coins: number;
  onBuyRadius: () => void;
  onBuyTime: () => void;
  onBuySpeed: () => void;
}) {
  return (
    <div className={styles.shopPanel}>
      <div className={styles.shopHeader}>Shop 🛒 - Coins: {coins} 🪙</div>
      <div className={styles.shopItems}>
        <button className={styles.shopButton} onClick={onBuyRadius}>
          + Raggio Amo (+6px)
          <span className={styles.price}>3 🪙</span>
        </button>
        <button className={styles.shopButton} onClick={onBuyTime}>
          + Tempo (+10s)
          <span className={styles.price}>2 🪙</span>
        </button>
        <button className={styles.shopButton} onClick={onBuySpeed}>
          + Velocità Lenza (+10%)
          <span className={styles.price}>4 🪙</span>
        </button>
      </div>
    </div>
  );
}


