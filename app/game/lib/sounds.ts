// Sound configuration and data URI sounds
// Using data URIs for small placeholder sounds until real audio files are added

export const SOUNDS = {
  // Placeholder sounds - replace with real audio files
  splash: '/sounds/splash.mp3',
  catch: '/sounds/catch.mp3',
  catchSmall: '/sounds/catch-small.mp3',
  catchBig: '/sounds/catch-big.mp3',
  catchLegendary: '/sounds/catch-legendary.mp3',
  powerUp: '/sounds/powerup.mp3',
  levelComplete: '/sounds/level-complete.mp3',
  timeWarning: '/sounds/time-warning.mp3',
  cast: '/sounds/cast.mp3',
  
  // Background music
  bgMusic: '/sounds/ocean-ambient.mp3',
};

// Simple beep generator for placeholder sounds
export function generateBeep(frequency: number, duration: number, volume: number = 0.3): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    return ''; // Placeholder
  } catch (err) {
    return '';
  }
}

// Helper to play sound with Web Audio API as fallback
export function playSound(src: string, volume: number = 1.0) {
  if (typeof window === 'undefined') return;
  
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {
      // Fallback: silent fail for now
      console.log('Sound play blocked or failed');
    });
  } catch (err) {
    console.log('Audio not supported');
  }
}
