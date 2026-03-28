# Task 9.1: Serialization

## Goal

Learn to serialize MobX store state to JSON, save to localStorage, and restore on load.

## Requirements

Create a `SettingsStore` with persistent state:

1. Observable properties: `theme` ('light' | 'dark'), `fontSize` (number), `language` (string), `notifications` (boolean)
2. Method `toJSON()` — returns a plain object with all settings
3. Method `hydrate(storageKey)` — loads data from localStorage and applies to the store
4. In the constructor: call `hydrate` to load saved data
5. In the constructor: set up `autorun` to auto-save `toJSON()` to localStorage on every change
6. UI: controls for each setting (select, range, checkbox) and JSON preview

```typescript
class SettingsStore {
  theme: 'light' | 'dark'
  fontSize: number
  language: string
  notifications: boolean

  toJSON(): object
  hydrate(storageKey: string): void
  setTheme(t: 'light' | 'dark'): void
  setFontSize(s: number): void
  setLanguage(l: string): void
  toggleNotifications(): void
}
```

## Checklist

- [ ] `SettingsStore` created with `makeAutoObservable`
- [ ] `toJSON()` returns a plain object (without computed properties)
- [ ] `hydrate()` safely loads data from localStorage (with `try/catch`)
- [ ] `autorun` automatically saves state on changes
- [ ] UI displays current settings and JSON preview
- [ ] Settings persist after page reload

## How to verify

1. Change the theme, font size, or language
2. Reload the page — settings should persist
3. Open DevTools → Application → localStorage — verify data is being written
4. Check that the JSON preview updates in real time
