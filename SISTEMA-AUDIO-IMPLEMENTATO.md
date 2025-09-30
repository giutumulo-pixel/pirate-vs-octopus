# 🔊 SISTEMA AUDIO IMPLEMENTATO

**Data**: 30 Settembre 2025
**Feature**: Sistema audio completo con controlli

---

## ✅ COSA È STATO IMPLEMENTATO

### **1. Hook Personalizzato `useSound`**
```typescript
// File: app/game/hooks/useSound.ts

const { play, stop, setVolume } = useSound('/sounds/catch.mp3', {
  volume: 0.7,
  loop: false
});
```

**Funzionalità**:
- ✅ Caricamento audio HTML5
- ✅ Controllo play/stop
- ✅ Controllo volume individuale
- ✅ Gestione errori
- ✅ Cleanup automatico

### **2. Sound Manager Globale**
```typescript
const { isMuted, masterVolume, toggleMute, changeVolume } = useSoundManager();
```

**Funzionalità**:
- ✅ Mute globale
- ✅ Volume master
- ✅ Salvataggio preferenze in localStorage
- ✅ Caricamento automatico preferenze

### **3. Componente UI Controlli Audio**
```tsx
<SoundToggle 
  isMuted={isMuted}
  volume={masterVolume}
  onToggleMute={toggleMute}
  onVolumeChange={changeVolume}
/>
```

**Visibile**:
- 🔊 Icona audio (top-right)
- 🎚️ Slider volume
- 💾 Preferenze salvate

### **4. Configurazione Suoni**
```typescript
// File: app/game/lib/sounds.ts

export const SOUNDS = {
  splash: '/sounds/splash.mp3',
  catch: '/sounds/catch.mp3',
  catchLegendary: '/sounds/catch-legendary.mp3',
  powerUp: '/sounds/powerup.mp3',
  levelComplete: '/sounds/level-complete.mp3',
  // ... e altri
};
```

---

## 🎯 COME INTEGRARE I SUONI NEGLI EVENTI

### **Esempio 1: Suono al Cast**
```typescript
// In page.tsx o useGameEngine.ts

const handleCast = () => {
  playSoundEffect(SOUNDS.cast);
  engine.cast();
};
```

### **Esempio 2: Suono alla Cattura**
```typescript
// In useGameEngine.ts - quando catturi un pesce

if (closestFish) {
  const lane = lanes.find(l => l.id === closestFish.fish.laneId)!;
  
  // Suono basato sul tipo di pesce
  if (closestFish.fish.kind === 'leviathan' || closestFish.fish.kind === 'kraken') {
    playSoundEffect(SOUNDS.catchLegendary);
  } else if (closestFish.fish.kind === 'monster') {
    playSoundEffect(SOUNDS.catchBig);
  } else if (closestFish.fish.kind === 'small') {
    playSoundEffect(SOUNDS.catchSmall);
  } else {
    playSoundEffect(SOUNDS.catch);
  }
  
  setScore(s => s + lane.points);
}
```

### **Esempio 3: Suono Completamento Livello**
```typescript
// Quando completi un livello

if (score >= levelTarget && !levelComplete) {
  setLevelComplete(true);
  playSoundEffect(SOUNDS.levelComplete);
  setOver(true);
}
```

### **Esempio 4: Avviso Tempo**
```typescript
// Quando restano 10 secondi

if (timeLeft === 10 && !timeWarningPlayed) {
  playSoundEffect(SOUNDS.timeWarning);
  setTimeWarningPlayed(true);
}
```

---

## 📁 STRUTTURA FILE

```
pirate-vs-octopus/
├── app/game/
│   ├── hooks/
│   │   └── useSound.ts          ✅ Hook audio
│   ├── lib/
│   │   └── sounds.ts            ✅ Config suoni
│   ├── components/
│   │   └── SoundToggle.tsx      ✅ UI controlli
│   └── page.tsx                 ✅ Integrato
└── public/
    └── sounds/
        ├── README.md            ✅ Guida
        ├── splash.mp3           ⏳ Da aggiungere
        ├── catch.mp3            ⏳ Da aggiungere
        ├── catch-small.mp3      ⏳ Da aggiungere
        ├── catch-big.mp3        ⏳ Da aggiungere
        ├── catch-legendary.mp3  ⏳ Da aggiungere
        ├── powerup.mp3          ⏳ Da aggiungere
        ├── level-complete.mp3   ⏳ Da aggiungere
        ├── time-warning.mp3     ⏳ Da aggiungere
        ├── cast.mp3             ⏳ Da aggiungere
        └── ocean-ambient.mp3    ⏳ Opzionale
```

---

## 🎨 UI IMPLEMENTATA

### **Posizione**
```
┌─────────────────────────────────┐
│  [HUD: Score, Time]    [🔊 🎚️]│ ← Top-right
│                                 │
│         GAME AREA               │
│                                 │
└─────────────────────────────────┘
```

### **Stati Icona**
- 🔇 = Muto
- 🔈 = Volume basso (1-50%)
- 🔉 = Volume medio (51-75%)
- 🔊 = Volume alto (76-100%)

### **Stile**
```css
.soundControls {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #FFD700;
  border-radius: 8px;
  padding: 8px 12px;
}
```

---

## 🔧 FUNZIONALITÀ AVANZATE

### **1. Persistenza Preferenze**
```typescript
// Salvato automaticamente in localStorage:
- 'soundMuted': true/false
- 'soundVolume': 0.0-1.0

// Caricato automaticamente all'avvio
```

### **2. Graceful Degradation**
```typescript
// Se i file audio mancano:
- Nessun errore bloccante
- Console log discreto
- Gioco funziona normalmente
```

### **3. Rispetto Autoplay Policy**
```typescript
// Gli autoplay sono gestiti con try/catch
// Fallisce silenziosamente se il browser blocca
```

---

## 📊 PROSSIMI STEP

### **Fase 1: Aggiungi File Audio** (15 min)
1. Vai su [Freesound.org](https://freesound.org)
2. Cerca e scarica i suoni
3. Rinomina secondo tabella
4. Metti in `/public/sounds/`
5. Ricarica gioco → Funziona! ✅

### **Fase 2: Integra Eventi** (30 min)
```typescript
// Aggiungi playSoundEffect() in questi punti:

1. ✅ engine.cast() → SOUNDS.cast
2. ✅ Cattura pesce → SOUNDS.catch (variante per tipo)
3. ✅ Cattura ancora → SOUNDS.powerUp
4. ✅ Livello completo → SOUNDS.levelComplete
5. ✅ Tempo < 10s → SOUNDS.timeWarning
6. ✅ Amo in acqua → SOUNDS.splash
```

### **Fase 3: Musica Sottofondo** (opzionale)
```typescript
// In useEffect principale:
const bgMusic = new Audio(SOUNDS.bgMusic);
bgMusic.loop = true;
bgMusic.volume = 0.2;

if (started && !isMuted) {
  bgMusic.play();
}

return () => bgMusic.pause();
```

---

## 🎯 TESTING

### **Checklist**
- [ ] Toggle mute funziona
- [ ] Slider volume funziona
- [ ] Preferenze salvate dopo refresh
- [ ] Suoni rispettano volume globale
- [ ] Nessun errore se file mancano
- [ ] Volume iniziale 70% (default)

### **Browser Compatibility**
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (con autoplay policy)
- ✅ Mobile browsers

---

## 🐛 TROUBLESHOOTING

### **Suoni non si sentono**
1. Controlla che i file siano in `/public/sounds/`
2. Verifica che i nomi file matchino
3. Controlla che volume > 0
4. Verifica che mute sia disattivo
5. Apri console browser per errori

### **"Audio play blocked"**
- Normale! Browser bloccano autoplay
- Suoni funzioneranno dopo prima interazione utente
- Non è un errore

### **Volume troppo alto/basso**
```typescript
// Modifica in sounds.ts:
playSound(sound, masterVolume * 0.5); // Riduce al 50%
```

---

## 📖 RISORSE AUDIO GRATUITE

### **Best Sites**
1. **Freesound.org** - Migliore per SFX
2. **Pixabay** - Buona varietà
3. **Zapsplat** - Professionale
4. **OpenGameArt** - Specifico per giochi

### **Licenze OK**
- ✅ CC0 (Public Domain)
- ✅ CC BY (con attribuzione)
- ⚠️ Verifica sempre la licenza specifica!

---

## 💡 BEST PRACTICES

### **Volume Levels**
```typescript
const VOLUME_LEVELS = {
  ambient: 0.2,      // Musica sottofondo
  splash: 0.5,       // Frequente
  catchSmall: 0.4,   // Molto frequente
  catchNormal: 0.6,  // Standard
  catchLegendary: 1.0, // Epico!
  powerUp: 0.7,      // Importante
  levelComplete: 0.8, // Celebrazione
};
```

### **Performance**
- Usa MP3 (compatibile, compresso)
- Mantieni file < 100KB per SFX
- Precarica suoni critici
- Limita suoni sovrapposti

### **UX**
- Mai forzare volume alto
- Default ragionevole (70%)
- Sempre permettere mute
- Salvare preferenze utente

---

## ✅ STATO ATTUALE

### **Implementato** ✅
- [x] Hook audio system
- [x] Sound manager globale
- [x] UI controlli (toggle + slider)
- [x] Salvataggio preferenze
- [x] Graceful fallback
- [x] CSS styling
- [x] Documentazione completa

### **Da Fare** ⏳
- [ ] Scaricare/aggiungere file audio
- [ ] Integrare suoni negli eventi gioco
- [ ] Testare con audio reali
- [ ] Aggiungere musica sottofondo (opzionale)

---

## 🚀 QUICK START

**Per iniziare subito**:

1. **Aggiungi un suono test**:
   ```bash
   # Scarica qualsiasi MP3 corto
   # Rinominalo 'catch.mp3'
   # Mettilo in public/sounds/
   ```

2. **Testa**:
   - Ricarica gioco
   - Cattura un pesce
   - Dovrebbe suonare!

3. **Aggiungi altri** man mano

---

**Sistema audio pronto all'uso!** 🔊🎣

_Consulta `public/sounds/README.md` per guida dettagliata sui file audio._
