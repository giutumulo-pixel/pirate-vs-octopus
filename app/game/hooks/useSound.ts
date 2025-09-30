import { useEffect, useRef, useState } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export function useSound(src: string, options: SoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(src);
    audio.volume = options.volume ?? 1;
    audio.loop = options.loop ?? false;
    
    audio.addEventListener('canplaythrough', () => {
      setIsReady(true);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src, options.volume, options.loop]);

  const play = () => {
    if (audioRef.current && isReady) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, vol));
    }
  };

  return { play, stop, setVolume, isReady };
}

// Sound Manager per controlli globali
export function useSoundManager() {
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);

  useEffect(() => {
    // Carica preferenze da localStorage
    if (typeof window !== 'undefined') {
      const savedMuted = localStorage.getItem('soundMuted');
      const savedVolume = localStorage.getItem('soundVolume');
      
      if (savedMuted !== null) {
        setIsMuted(savedMuted === 'true');
      }
      if (savedVolume !== null) {
        setMasterVolume(parseFloat(savedVolume));
      }
    }
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundMuted', newMuted.toString());
    }
  };

  const changeVolume = (volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    setMasterVolume(newVolume);
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundVolume', newVolume.toString());
    }
  };

  return {
    isMuted,
    masterVolume,
    toggleMute,
    changeVolume,
  };
}
