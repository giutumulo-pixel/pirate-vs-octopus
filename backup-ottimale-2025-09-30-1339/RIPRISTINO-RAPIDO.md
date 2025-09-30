# ⚡ RIPRISTINO RAPIDO

## 🚨 In Caso di Emergenza

### Ripristino Completo (PowerShell)
```powershell
# 1. Naviga alla directory principale
cd c:\Users\giutu\pirater.octopus\pirate-vs-octopus

# 2. Copia tutti i file di gioco dal backup
Copy-Item -Path "backup-ottimale-2025-09-30-1339\game\*" -Destination "app\game\" -Recurse -Force

# 3. Verifica che tutto sia copiato correttamente
Get-ChildItem -Path "app\game\components" -Recurse

# 4. Riavvia il server di sviluppo
npm run dev
```

---

## 📦 Contenuto del Backup

### File Chiave Salvati:
```
✅ game/components/constants.ts
✅ game/components/types.ts
✅ game/components/Environment.tsx
✅ game/components/Ship.tsx
✅ game/components/TrajectoryPreview.tsx
✅ game/components/FishLayer.tsx
✅ game/components/FishingRig.tsx
✅ game/components/BonusAnchor.tsx
✅ game/components/Ocean.tsx
✅ game/components/HUD.tsx
✅ game/components/Controls.tsx
✅ game/hooks/useGameEngine.ts
✅ game/page.tsx
✅ game/page.module.css
✅ package.json
✅ tsconfig.json
```

---

## 🔍 Verifica Rapida

Dopo il ripristino, controlla questi punti:

1. **Amo Normale**:
   - [ ] Pesca solo in discesa
   - [ ] Cattura 1 pesce alla volta
   - [ ] Si ferma dopo la cattura

2. **Amo Potenziato**:
   - [ ] Pesca in discesa e salita
   - [ ] Cattura multipli pesci
   - [ ] Raggio ampio sui pesci profondi

3. **Punteggi**:
   - [ ] Monster = 1000 punti
   - [ ] Shark = 300 punti
   - [ ] Large = 150 punti

4. **Precisione**:
   - [ ] L'amo cattura quando tocca visualmente il pesce

---

## 💡 Problemi Comuni

### "Amo passa attraverso i pesci"
➜ Verifica che `HOOK_VISUAL_OFFSET_X_PX = 53` e `Y = 100` in `useGameEngine.ts`

### "Amo potenziato non pesca in salita"
➜ Controlla `canCatch` in `useGameEngine.ts` linea ~279

### "Monster troppo difficile/facile"
➜ Modifica `getCatchRadiusForLane()` in `useGameEngine.ts` linea ~257

---

**Data Backup**: 30 Settembre 2025, 13:39
**Versione**: Ottimale Testata ✅
