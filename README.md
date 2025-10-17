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

### Path and naming tips (macOS)
- Keep the project under a simple ASCII path without spaces or special characters (e.g. `~/Dev/todoList`).
- If Android Studio shows errors like `Cannot set current directory` or resource name errors about spaces, move the project or create a symlink:
  ```bash
  mkdir -p ~/Dev
  mv "/Users/shizaahmad/Desktop/Skrivebord - Shizas MacBook Pro/NTNU/Høst25/Applikasjonsutvikling/Prosjektoppgave - todoList/todoList" ~/Dev/todoList
  # or symlink
  ln -s "/Users/shizaahmad/Desktop/Skrivebord - Shizas MacBook Pro/NTNU/Høst25/Applikasjonsutvikling/Prosjektoppgave - todoList/todoList" ~/Dev/todoList
  ```

### Common Android build issues
- If Gradle caches cause trouble: `Build > Clean Project` then `Rebuild Project`.
- After changing web assets, always run `npm run build` followed by `npx cap sync android`.

## Live reload (optional)
If you prefer hot reload while developing on an emulator/device:

1. Start Vite with a public host
```bash
npm run dev -- --host
```
2. In a separate terminal, run with live reload:
```bash
ionic cap run android -l --external
# or
npx cap run android --external --livereload-url http://YOUR-IP:5173
```

Notes:
- App uses Capacitor Filesystem storing JSON files under `Directory.Data`.
- Default list `Dagligvarer` loads on first launch; items persist per list file.

### Features implemented
- Multiple lists with create/delete
- Tabs overview with auto-dropdown after 5 lists
- Add items quickly with Enter; focus stays in field
- Done/undone separation with checkbox toggle
- Drag to reorder; persisted to JSON per list
- Search in one list and global search across all lists
- Item priority (high/normal/low) with sorting

