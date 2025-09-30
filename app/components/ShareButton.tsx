"use client";
import styles from "../success/page.module.css";

export function ShareButton() {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Pirate vs Octopus",
          text: "I just joined the waitlist for Pirate vs Octopus!",
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <button onClick={handleShare} className={styles.shareButton}>
      SHARE
    </button>
  );
}


