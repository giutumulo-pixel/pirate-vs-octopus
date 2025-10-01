# 🔒 LOCKED GAME UNIT - Documentation

## ⚠️ IMPORTANTE

**TUTTI gli elementi visivi del gioco sono bloccati insieme come UNITÀ SINGOLA!**

Modificare un singolo valore romperà l'allineamento di tutti gli altri elementi.

---

## 📍 Elementi Bloccati Insieme

Questi elementi sono calibrati per funzionare come un'unica unità:

1. **🚢 Nave (Ship)** - La barca del pirata
2. **🏴‍☠️ Pirata (Pirate)** - Il personaggio sulla barca
3. **🎣 Canna da pesca (Fishing Rod)** - La canna del pirata
4. **🎯 Indicatore (Indicator)** - I pallini dorati che oscillano
5. **🧵 Corda (Fishing Line)** - La lenza che collega canna e amo
6. **🪝 Amo (Hook)** - L'amo che cattura i pesci

---

## 📐 Coordinate Centralizzate

**File principale:** `app/game/components/constants.ts`

### Valori Chiave:

```typescript
// Dimensioni gioco
GAME_WIDTH_PX = 800
GAME_HEIGHT_PX = 600

// Posizione nave (riferimento master)
SHIP_BASE_PERCENT = 35    // 35% altezza schermo
SHIP_OFFSET_PX = 18       // 18px sotto waterline

// Posizione pirata (deve corrispondere al CSS)
PIRATE_LEFT_PERCENT = 50       // 50% larghezza (centro)
PIRATE_BOTTOM_PX = 370         // 370px dal basso (LOCKED)
PIRATE_TRANSFORM_X = -15       // -15% offset orizzontale
PIRATE_SIZE_PX = 80            // 80x80px

// Indicatore e punto di partenza amo
INDICATOR_CENTER_X_PERCENT = 50      // Centro schermo
INDICATOR_CENTER_Y_PERCENT = 17.6666 // Sopra l'acqua

// Riferimento canna da pesca
ROD_TIP_X_PERCENT = 57.375    // Punta della canna (visuale)
ROD_TIP_Y_PERCENT = 17.6666   // Altezza punta canna

// Offset amo (rendering)
HOOK_Y_OFFSET_PX = 100        // Offset verticale
HOOK_X_OFFSET_PX = 53         // Offset orizzontale
HOOK_SIZE_PX = 28             // Dimensione sprite
ATTACH_EPS_PX = -7            // Punto attacco lenza
```

---

## 🔗 Relazioni tra Elementi

### 1. **Nave → Pirata**
```
Pirata bottom (370px) = Ship position (35% + 18px) + offset pirata
```
Il pirata è posizionato RELATIVO alla nave.

### 2. **Indicatore → Amo**
```
Amo start X = INDICATOR_CENTER_X_PERCENT = 50%
Hook xPx = GAME_WIDTH_PX / 2 = 400px
```
L'amo parte dal centro dove oscillano i pallini.

### 3. **Pirata → Canna → Linea**
```
Rod tip (57.375%) = Posizione VISUALE della canna
Line start = Disegnata dal rod tip all'amo
```
La linea parte visivamente dalla canna del pirata.

---

## 📱 MOBILE RESPONSIVE - LOCKED

**ANCHE IL MOBILE È LOCKED!**

Su schermi < 768px, gli elementi scalano proporzionalmente:

```typescript
// Mobile scaling (constants.ts)
MOBILE_PIRATE_SIZE_PX = 50      // vs 80px desktop
MOBILE_SHIP_SCALE = 0.75        // 75% della dimensione desktop
MOBILE_ISLAND_WIDTH_PX = 60     // vs 80px desktop
MOBILE_ISLAND_HEIGHT_PX = 30    // vs 40px desktop
MOBILE_ISLAND_LEFT_PERCENT = 65 // vs 70% desktop
```

```css
/* Mobile CSS (@media max-width: 768px) */
.pirateOnDeck {
  width: 50px !important;   /* MOBILE_PIRATE_SIZE_PX */
  height: 50px !important;
}

.shipImg {
  max-width: 180px !important;  /* 260px * 0.75 */
}

.island {
  width: 60px !important;   /* MOBILE_ISLAND_WIDTH_PX */
  height: 30px !important;  /* MOBILE_ISLAND_HEIGHT_PX */
}

.islandContainer {
  left: 65% !important;     /* MOBILE_ISLAND_LEFT_PERCENT */
}
```

⚠️ **ATTENZIONE**: Modificare solo i valori mobile ROMPERÀ l'allineamento!  
Tutti gli elementi devono scalare INSIEME, proporzionalmente.

---

## ✅ Come Modificare lo Sfondo

**È SICURO cambiare lo sfondo** perché gli elementi sono relativi tra loro, non allo sfondo!

```css
/* Modifica TRANQUILLAMENTE: */
.sky { background: /* nuovo colore */ }
.water { background: /* nuovo colore */ }
.ocean { background: /* nuova immagine */ }
```

Gli elementi di gioco (nave, pirata, amo, ecc.) **NON si sposteranno** perché sono ancorati tra loro, non al background!

Questo vale sia per **DESKTOP che MOBILE**!

---

## ⚠️ Come NON Rompere l'Allineamento

### ❌ NON FARE:
```typescript
// ❌ Modificare solo un valore
PIRATE_BOTTOM_PX = 400  // ROMPE tutto!

// ❌ Cambiare posizione amo senza indicatore
xPx: GAME_WIDTH_PX / 2 + 50  // ROMPE allineamento!

// ❌ Spostare pirata nel CSS senza constants.ts
.pirateOnDeck { left: 60%; }  // ROMPE sincronizzazione!
```

### ✅ FARE INVECE:
```typescript
// ✅ Modificare tutti i valori insieme
// 1. In constants.ts
SHIP_BASE_PERCENT = 40  // nuova posizione
PIRATE_BOTTOM_PX = 420  // ricalcolato insieme

// 2. Nel CSS (mantenere sincronizzato)
.pirateOnDeck { bottom: 420px; }  // stesso valore!

// 3. Testare TUTTO prima di deployare
```

---

## 📋 Checklist Modifiche Sicure

Prima di modificare le coordinate:

- [ ] Ho letto TUTTA questa documentazione?
- [ ] Capisco le relazioni tra gli elementi?
- [ ] Modificherò TUTTI i valori correlati insieme?
- [ ] Aggiornerò ANCHE il CSS se cambio constants.ts?
- [ ] Testerò su desktop E mobile dopo le modifiche?
- [ ] Ho fatto un backup prima delle modifiche?

Se hai risposto NO a qualsiasi domanda, **NON modificare i valori!**

---

## 🛠️ Processo di Ricalibrazione Completa

Se devi DAVVERO spostare tutto:

1. **Backup**
   ```bash
   git add .
   git commit -m "Backup before coordinate changes"
   ```

2. **Calcola nuove coordinate** (su carta/foglio)
   - Nuova posizione nave
   - Nuovo bottom pirata (relativo alla nave)
   - Verifica che indicatore resti centrato

3. **Aggiorna constants.ts**
   - Cambia SHIP_BASE_PERCENT
   - Cambia SHIP_OFFSET_PX
   - Ricalcola PIRATE_BOTTOM_PX

4. **Aggiorna CSS** (page.module.css)
   - Cambia `.pirateOnDeck { bottom: XXXpx; }`

5. **Testa tutto**
   - Desktop: indicatore, amo, linea allineati?
   - Mobile: tutto visibile e allineato?
   - Lancia amo: segue l'indicatore?

6. **Deploy solo se PERFETTO**

---

## 🎯 Casi d'Uso Comuni

### "Voglio cambiare lo sfondo"
✅ **SICURO** - Modifica solo i CSS di `sky`, `water`, `ocean`

### "Voglio spostare la barca più in alto/basso"
⚠️ **RICALIBRAZIONE COMPLETA** - Segui il processo sopra

### "L'amo non segue l'indicatore"
🔍 **VERIFICA**:
- `xPx: GAME_WIDTH_PX / 2` in `cast()`
- `INDICATOR_CENTER_X_PERCENT = 50` in constants
- CSS `.indicator` centrato

### "Il pirata è fuori dalla barca"
🔍 **VERIFICA**:
- `PIRATE_BOTTOM_PX = 370` in constants
- `.pirateOnDeck { bottom: 370px; }` nel CSS
- Corrispondenza tra i due valori

---

## 📞 Domande?

Se qualcosa non è chiaro o non funziona:

1. Controlla che constants.ts e CSS siano sincronizzati
2. Verifica che nessun valore sia stato modificato singolarmente
3. Testa sia su desktop che mobile
4. Se tutto fallisce, fai `git reset` all'ultimo commit funzionante

---

**Ultima modifica:** 2025-10-01  
**Versione:** 1.0 - Sistema LOCKED implementato

