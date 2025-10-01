# 📱 PIANO RESPONSIVE PER MOBILE

**Obiettivo**: Versione che funzioni perfettamente sia su desktop che mobile
**Approccio**: Viewport scaling + container proporzionato

---

## 🎯 STRATEGIA

### **Problema Attuale**
- Gioco usa dimensioni fisse: 800×600px
- Posizioni in pixel fissi (pirata bottom: 370px)
- Non si adatta a schermi mobile

### **Soluzione**
1. Container con aspect ratio fisso (4:3)
2. Tutto in percentuali invece di pixel
3. Scala proporzionalmente su ogni schermo
4. Test su localhost prima di deploy

---

## 📐 CONVERSIONI

### **Ship (Punto di Riferimento)**
```
Desktop: top: calc(35% + 18px)
Mobile: top: 35% (semplificato)
```

### **Pirate (Relativo alla Barca)**
```
Desktop: bottom: 370px
Calcolo: 370px su 600px = 61.67%
Mobile: bottom: 61.67%
```

### **Island**
```
Desktop: top: calc(26% + 18px), left: 74%
Mobile: top: 26%, left: 74%
```

### **Rod Tip (per Indicatore/Amo)**
```
Desktop: X: 57.375%, Y: 17.67%
Mobile: STESSO (sono già percentuali!)
```

---

## ✅ VANTAGGI

- Funziona su TUTTI gli schermi
- Proporzionale sempre
- No calcoli complicati
- Test facile in locale

