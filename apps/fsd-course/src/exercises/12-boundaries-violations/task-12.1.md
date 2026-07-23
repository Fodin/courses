# Задание 12.1 — Импорт вверх по слоям (простое)

## Цель

Найти и исправить импорт «вверх» по слоям FSD.

## Что дано

- `entities/user/model/types.ts` импортирует тип `ProfileTheme` из
  `pages/profile/model/types.ts` — а `pages` находится выше `entities`.

## Требования

1. Уберите импорт `@/pages/profile/model/types` из `entities/user/model/types.ts`.
2. Опишите тип темы прямо в сущности: `theme: 'light' | 'dark'`.
3. Нажмите «Проверить».

## Чеклист

- [ ] В `entities/user/model/types.ts` нет импорта из `pages`
- [ ] `User.theme` — собственный union-тип сущности
- [ ] Пройти квиз уровня ≥ 80%
