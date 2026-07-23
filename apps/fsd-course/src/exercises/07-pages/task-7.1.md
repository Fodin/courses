# Задание 7.1 — Страница как композиция (простое)

## Цель

Закрыть страницу собственным public API.

## Что дано

- `entities/user` — сущность с готовым public API (`User`, `UserCard`).
- `widgets/header` — виджет с готовым public API (`Header`).
- `pages/profile/ui/ProfilePage.tsx` — страница уже правильно компонует
  виджет и сущность через их public API. Трогать её не нужно.

## Требования

1. Откройте `pages/profile/index.ts`.
2. Реэкспортируйте `ProfilePage` из `./ui/ProfilePage`.
3. Нажмите «Проверить».

## Чеклист

- [ ] У страницы `pages/profile` есть свой `index.ts`
- [ ] `index.ts` реэкспортирует `ProfilePage`
- [ ] Пройти квиз уровня ≥ 80%
