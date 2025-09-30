"use client";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault?.();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  if (!visible || !deferred) return null;

  const install = async () => {
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
        setDeferred(null);
      } else {
        setVisible(false);
      }
    } catch {
      setVisible(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      padding: "12px 16px",
      background: "rgba(0,0,0,0.85)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }}>
      <span>Installa l&apos;app sul tuo dispositivo</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setVisible(false)} style={{
          background: "transparent",
          color: "#fff",
          border: "1px solid #fff",
          padding: "8px 12px",
          borderRadius: 8
        }}>Più tardi</button>
        <button onClick={install} style={{
          background: "#FF7E5F",
          color: "#111",
          border: "none",
          padding: "8px 12px",
          borderRadius: 8,
          fontWeight: 700
        }}>Installa</button>
      </div>
    </div>
  );
}


