# Задание 8.3: Сериализация

## 🎯 Цель

Научиться сериализовать состояние MobX-стора в JSON, сохранять в localStorage и восстанавливать при загрузке.

## 📋 Требования

Создайте `SettingsStore` с персистентным состоянием:

1. Observable-свойства: `theme` ('light' | 'dark'), `fontSize` (число), `language` (строка), `notifications` (boolean)
2. Метод `toJSON()` — возвращает plain object со всеми настройками
3. Метод `hydrate(storageKey)` — загружает данные из localStorage и применяет к стору
4. В конструкторе: вызвать `hydrate` для загрузки сохранённых данных
5. В конструкторе: настроить `autorun` для автосохранения `toJSON()` в localStorage при каждом изменении
6. UI: контролы для каждой настройки (select, range, checkbox) и JSON-превью

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

## Чеклист

- [ ] `SettingsStore` создан с `makeAutoObservable`
- [ ] `toJSON()` возвращает plain object (без computed-свойств)
- [ ] `hydrate()` безопасно загружает данные из localStorage (с `try/catch`)
- [ ] `autorun` автоматически сохраняет состояние при изменениях
- [ ] UI отображает текущие настройки и JSON-превью
- [ ] Настройки сохраняются после перезагрузки страницы

## 🔍 Как проверить себя

1. Измените тему, размер шрифта или язык
2. Перезагрузите страницу — настройки должны сохраниться
3. Откройте DevTools → Application → localStorage — убедитесь, что данные записываются
4. Проверьте, что JSON-превью обновляется в реальном времени
