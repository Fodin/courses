# Задание 6.3 — Полный public API сложного виджета (сложное)

## Цель

Виджет `widgets/sidebar` собирает сразу трёх соседей: `entities/user`,
`features/search`, `features/logout`. Навести порядок сразу в двух местах —
в импортах виджета и в его собственном public API.

## Что дано

- `widgets/sidebar/ui/Sidebar.tsx` (редактируемый) — тянет всех трёх соседей
  глубокими импортами (`.../model/types`, `.../ui/...`);
- `widgets/sidebar/index.ts` (редактируемый) — пуст, у виджета нет входной двери;
- `entities/user`, `features/search`, `features/logout` (только чтение) — уже
  закрыты корректным public API.

## Требования

1. В `Sidebar.tsx` замените все импорты соседей на импорт через их `index.ts`
   (`@/entities/user`, `@/features/search`, `@/features/logout`).
2. В `widgets/sidebar/index.ts` реэкспортируйте наружу компонент `Sidebar`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `Sidebar.tsx` не содержит ни одного глубокого импорта
- [ ] `widgets/sidebar/index.ts` реэкспортирует `Sidebar`
- [ ] Импорты уважают слои и изоляцию слайсов
- [ ] Пройти квиз уровня ≥ 80%
