# Задание 3.2 — Сборка public API нескольких сегментов (среднее)

## Цель

Подключить сразу два сегмента `shared` (`ui` и `lib`) через их public API, а не
через внутренние файлы.

## Что дано

- `shared/ui` (компонент `Button`) и `shared/lib` (хук `useDebounce`) — уже честно
  закрыты своими `index.ts` (только чтение, не трогайте).
- `features/search-bar/ui/SearchBar.tsx` — импортирует `Button` из
  `@/shared/ui/Button` и `useDebounce` из `@/shared/lib/useDebounce` — это обход
  public API.

## Требования

1. Замените импорт `Button` на `@/shared/ui`.
2. Замените импорт `useDebounce` на `@/shared/lib`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `Button` импортируется из `@/shared/ui`
- [ ] `useDebounce` импортируется из `@/shared/lib`
- [ ] Пройти квиз уровня ≥ 80%
