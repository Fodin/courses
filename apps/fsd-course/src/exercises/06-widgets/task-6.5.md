# Задание 6.5 — Развязка cross-import между виджетами (среднее)

## Цель

Виджет `widgets/header` импортирует `ToggleButton` прямо из соседнего
`widgets/sidebar` — это cross-import виджетов одного слоя. Опустить общий
кусок в отдельную фичу и развязать виджеты.

## Что дано

- `widgets/header/ui/Header.tsx` (редактируемый) — импортирует `ToggleButton` из
  `@/widgets/sidebar`;
- `features/sidebar-toggle/ui/ToggleButton.tsx` (редактируемый) — пустая
  заготовка, компонент ещё не реализован;
- `features/sidebar-toggle/index.ts` (редактируемый) — пуст, public API ещё нет;
- `shared/ui/Button.tsx`, `widgets/sidebar` (только чтение) — готовы.

## Требования

1. В `features/sidebar-toggle/ui/ToggleButton.tsx` реализуйте `ToggleButton` на
   основе базовой `Button` из `shared/ui`.
2. В `features/sidebar-toggle/index.ts` реэкспортируйте `ToggleButton`.
3. В `Header.tsx` замените импорт `ToggleButton` на `@/features/sidebar-toggle`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `features/sidebar-toggle` отдаёт `ToggleButton` через свой public API
- [ ] `Header.tsx` не импортирует ничего из `widgets/sidebar`
- [ ] Импорты уважают слои и изоляцию слайсов
- [ ] Пройти квиз уровня ≥ 80%
