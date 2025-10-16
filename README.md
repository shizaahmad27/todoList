# todoList
The final project in IDATT2506 
## Run locally (web)

```bash
npm install
npm run dev
```

## Build and run on Android (API 34)

```bash
npm run build
npx cap sync android
npx cap open android
```

Then in Android Studio:
- Select an Android 14 (API 34) emulator
- Press Run

Notes:
- App uses Capacitor Filesystem storing JSON files under `Directory.Data`.
- Default list `Dagligvarer` loads on first launch; items persist per list file.


Kort om testing på Android emulator
Prosjektet bygges som et Ionic kapasitorprosjekt med Android plattform lagt til og åpnes i Android Studio for bygging og kjøring på en nyere emulator. Fil lagring testes ved å legge inn og krysse av listeinnslag og deretter verifisere at JSON filene oppdateres kontinuerlig i appens lagringskatalog. Endelig versjon dokumenterer nettopp hvilken Android emulatorversjon som er brukt, og hvordan man starter appen fra Android Studio.
