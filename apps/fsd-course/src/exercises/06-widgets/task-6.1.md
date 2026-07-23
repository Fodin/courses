# Задание 6.1 — Виджет собирает public API (простое)

## Цель

Описать публичный интерфейс виджета `widgets/header`, который уже правильно
компонует `entities/user` и `shared/ui/Logo`.

## Что дано

- `widgets/header/ui/Header.tsx` (только чтение) — компонует `Logo` и `UserBadge`
  через их public API, всё готово;
- `widgets/header/index.ts` (редактируемый) — пуст, у виджета нет входной двери.

## Требования

1. В `widgets/header/index.ts` реэкспортируйте компонент `Header` из `./ui/Header`.
2. Наружу отдаём только `Header` — ничего лишнего.
3. Нажмите «Проверить».

## Чеклист

- [ ] `widgets/header/index.ts` реэкспортирует `Header`
- [ ] Импорты уважают слои и public API
- [ ] Пройти квиз уровня ≥ 80%
