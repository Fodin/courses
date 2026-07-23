# Задание 8.1 — Провайдер темы в app (простое)

## Цель

Собрать в слое `app` провайдер темы из `shared` и обернуть им приложение.

## Что дано

- `shared/ui/ThemeProvider.tsx` — компонент `ThemeProvider` (🔒 только чтение);
- `shared/ui/index.ts` — публичный API сегмента `shared/ui` (🔒 только чтение);
- `app/providers/AppProviders.tsx` — пока просто отдаёт `children` как есть.

## Требования

1. Импортируйте `ThemeProvider` из `'@/shared/ui'` — через public API сегмента,
   а не напрямую из `ThemeProvider.tsx`.
2. Оберните `children` в `<ThemeProvider>`.
3. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `AppProviders` импортирует `ThemeProvider` из `'@/shared/ui'`
- [ ] `AppProviders` оборачивает `children` в `<ThemeProvider>`
- [ ] Импорт идёт строго вниз: `app → shared`
- [ ] Пройти квиз уровня ≥ 80%
