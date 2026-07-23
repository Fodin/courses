# Задание 9.1 — Public API слайса (простое)

## Цель

Закрыть слайс `entities/user` публичным интерфейсом — файлом `index.ts`.

## Что дано

- `entities/user/model/types.ts` — тип `User` (🔒 только чтение);
- `entities/user/ui/UserCard.tsx` — компонент `UserCard` (🔒 только чтение);
- `entities/user/index.ts` — **пустой public API**, его надо заполнить.

## Требования

1. В `index.ts` реэкспортируйте тип `User` (`export type { User } from './model/types'`).
2. Там же реэкспортируйте `UserCard` (`export { UserCard } from './ui/UserCard'`).
3. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `index.ts` реэкспортирует `User`
- [ ] `index.ts` реэкспортирует `UserCard`
- [ ] Пройти квиз уровня ≥ 80%
