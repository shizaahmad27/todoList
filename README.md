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

### Common Android build issues
- If Gradle caches cause trouble: `Build > Clean Project` then `Rebuild Project`.
- After changing web assets, always run `npm run build` followed by `npx cap sync android`.

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

