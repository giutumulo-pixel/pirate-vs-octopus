"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Please enter your email address");
    if (!validateEmail(email)) return setError("Please enter a valid email address");
    router.push("/success");
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton} 
        type="button"
        onClick={() => router.push("/")}
      >
        ← Back to Game
      </button>
      
      <div className={styles.content}>
        <div className={styles.waitlistForm}>
          <h1 className={styles.title}>Join Pirate vs Octopus</h1>
          <p className={styles.subtitle}>Get early access and updates.</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.joinButton}>JOIN WAITLIST</button>
          </form>
        </div>
      </div>
    </div>
  );
}
