# 💾 SISTEMA DI SALVATAGGIO PROGRESSI

**Data**: 30 Settembre 2025
**Feature**: Salvataggio automatico dei livelli raggiunti

---

## 🎯 FUNZIONALITÀ

### **Salvataggio Automatico**
- ✅ Progressi salvati automaticamente in **localStorage**
- ✅ Salvataggio quando completi un livello
- ✅ Persistente tra sessioni browser
- ✅ Nessuna configurazione richiesta

### **Caricamento Automatico**
- ✅ Livello massimo caricato all'avvio
- ✅ Partenza automatica dall'ultimo livello raggiunto
- ✅ Fallback al livello 1 se nessun salvataggio

---

## 🎮 ESPERIENZA UTENTE

### **Prima Volta (Nuovo Giocatore)**
```
┌─────────────────────────────┐
│  PIRATE VS OCTOPUS         │
│                            │
│  📚 Tutorial              │
│  • Istruzioni base        │
│  • Come giocare           │
│  • Obiettivi              │
│                            │
│  [Inizia Avventura]       │
└─────────────────────────────┘
```

### **Ritorno (Progressi Salvati)**
```
┌─────────────────────────────────┐
│  PIRATE VS OCTOPUS             │
│                                │
│  🎉 Bentornato!                │
│  Livello massimo: 7            │
│                                │
│  [Continua dal Livello 7]     │
│  [Ricomincia dal Livello 1]   │
│                                │
│  Seleziona Livello:            │
│  [1] [2] [3] [4] [5]          │
│  [6] [7]                       │
│                                │
│  🗑️ Cancella Progressi        │
└─────────────────────────────────┘
```

---

## 🏗️ IMPLEMENTAZIONE TECNICA

### **localStorage Key**
```javascript
Key: 'pirateMaxLevel'
Value: numero (1-10)
```

### **Stati**
```typescript
maxLevelReached: number  // Massimo livello sbloccato
level: number           // Livello corrente
```

### **Funzioni Principali**

#### `start()`
Inizia dal livello corrente (quello salvato)
```typescript
const start = () => {
  // Usa il livello già impostato (salvato)
  setStarted(true);
}
```

#### `startFromBeginning()`
Ricomincia dal livello 1
```typescript
const startFromBeginning = () => {
  setLevel(1);
  setStarted(true);
}
```

#### `startFromLevel(targetLevel)`
Inizia da un livello specifico
```typescript
const startFromLevel = (targetLevel: number) => {
  setLevel(targetLevel);
  setStarted(true);
}
```

#### `resetProgress()`
Cancella tutti i progressi
```typescript
const resetProgress = () => {
  setMaxLevelReached(1);
  setLevel(1);
  localStorage.removeItem('pirateMaxLevel');
}
```

---

## 📊 FLUSSO DI SALVATAGGIO

```
Completa Livello 5
       ↓
Controlla: 6 > maxLevelReached?
       ↓ (sì)
setMaxLevelReached(6)
       ↓
localStorage.setItem('pirateMaxLevel', '6')
       ↓
Livello 6 sbloccato!
```

---

## 🎨 COMPONENTI UI

### **Menu Selezione Livelli**
```css
.levelSelect {
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid #FFD700;
  padding: 20px;
  border-radius: 12px;
}
```

### **Bottone Continua** (Verde)
```css
.continueButton {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  flex: 1;
}
```

### **Bottone Ricomincia** (Blu)
```css
.restartButton {
  background: linear-gradient(45deg, #2196F3, #1976D2);
  flex: 1;
}
```

### **Griglia Livelli** (Viola)
```css
.levelGrid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.levelButton {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### **Bottone Reset** (Rosso)
```css
.resetButton {
  background: linear-gradient(45deg, #f44336, #d32f2f);
  font-size: 0.9rem;
}
```

---

## 🔄 CICLO DI VITA

### **Mount del Componente**
1. useEffect() si attiva
2. Legge localStorage['pirateMaxLevel']
3. Se trovato (e valido):
   - `setMaxLevelReached(savedLevel)`
   - `setLevel(savedLevel)` - inizia da qui!
4. Se non trovato:
   - Mantiene default (livello 1)

### **Completamento Livello**
1. `score >= levelTarget`
2. `setLevelComplete(true)`
3. Calcola `nextLevel = level + 1`
4. Se `nextLevel > maxLevelReached`:
   - `setMaxLevelReached(nextLevel)`
   - `localStorage.setItem('pirateMaxLevel', nextLevel)`

### **Cambio Livello Manuale**
1. Click su bottone livello
2. `startFromLevel(targetLevel)` chiamato
3. `setLevel(targetLevel)`
4. `setStarted(true)`

---

## 🎯 CASI D'USO

### **Caso 1: Primo Giocatore**
```
Avvio → maxLevel = 1
↓
Mostra Tutorial
↓
[Inizia Avventura]
↓
Gioca Livello 1
```

### **Caso 2: Ritorno (Raggiunto Livello 5)**
```
Avvio → localStorage: '5'
↓
maxLevel = 5, level = 5
↓
Mostra Menu Selezione
↓
Opzioni:
- Continua da 5
- Ricomincia da 1
- Scegli 1-5
```

### **Caso 3: Reset Progressi**
```
[🗑️ Cancella Progressi]
↓
Conferma?
↓
maxLevel = 1, level = 1
↓
localStorage.removeItem()
↓
Ritorna al tutorial
```

---

## 📱 RESPONSIVE

### **Desktop**
- Griglia 5 colonne
- Bottoni grandi

### **Mobile** (da implementare)
```css
@media (max-width: 768px) {
  .levelGrid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .levelButtons {
    flex-direction: column;
  }
}
```

---

## 🔒 SICUREZZA & VALIDAZIONE

### **Validazione Input**
```typescript
const maxLevel = parseInt(savedMaxLevel, 10);
if (maxLevel > 1 && maxLevel <= 10) {
  // OK - usa il valore
} else {
  // Invalido - ignora
}
```

### **Limiti**
- Minimo: 1
- Massimo: 10
- Solo numeri interi
- Controllo `typeof window !== 'undefined'` per SSR

---

## 🐛 DEBUG

### **Ispeziona localStorage**
```javascript
// Console del browser
localStorage.getItem('pirateMaxLevel')

// Imposta manualmente
localStorage.setItem('pirateMaxLevel', '7')

// Cancella
localStorage.removeItem('pirateMaxLevel')
```

### **Reset Completo**
1. Apri DevTools (F12)
2. Console:
   ```javascript
   localStorage.clear()
   ```
3. Ricarica pagina (F5)

---

## ✅ TESTING CHECKLIST

- [x] Primo avvio mostra tutorial
- [x] Progressi salvati dopo completamento livello
- [x] Progressi caricati al ritorno
- [x] Menu selezione funziona
- [x] Bottone continua funziona
- [x] Bottone ricomincia funziona
- [x] Griglia livelli funziona
- [x] Reset progressi funziona
- [x] Validazione input localStorage
- [x] SSR safety (typeof window check)

---

## 🚀 FUTURE ENHANCEMENTS

### **Possibili Aggiunte**
- [ ] Salvataggio best score per livello
- [ ] Salvataggio tempo migliore
- [ ] Statistiche totali (pesci catturati, mostri, ecc.)
- [ ] Achievement/Trofei
- [ ] Esportazione/Importazione progressi
- [ ] Cloud save (con account)
- [ ] Leaderboard globale

---

**Il tuo progresso è al sicuro! Continua la tua avventura dove l'hai lasciata!** 💾🎣

_localStorage persiste fino a quando il browser non viene svuotato._
