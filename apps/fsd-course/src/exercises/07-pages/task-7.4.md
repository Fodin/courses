# Задание 7.4 — Логика вниз, а не в page (простое)

## Цель

Убрать доменную логику из страницы и использовать готовую функцию сущности.

## Что дано

- `entities/user` — уже содержит функцию `formatUserName` и отдаёт её через
  public API (только чтение).
- `pages/profile/ui/ProfilePage.tsx` — держит собственную копию функции
  `formatUserName` прямо внутри себя, вместо того чтобы взять готовую.

## Требования

1. Удалите локальное объявление `function formatUserName` в `ProfilePage.tsx`.
2. Импортируйте `formatUserName` из `@/entities/user`.
3. Нажмите «Проверить».

## Чеклист

- [ ] В `ProfilePage.tsx` больше нет собственной функции `formatUserName`
- [ ] `formatUserName` импортируется из `@/entities/user`
- [ ] Пройти квиз уровня ≥ 80%
