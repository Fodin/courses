# Задание 6.6 — Двойное нарушение изоляции виджета (сложное)

## Цель

Виджет `widgets/header` одновременно импортирует вверх (`pages/dashboard`) и
вбок (`widgets/sidebar`). Очистить виджет и поднять композицию на уровень
страницы — единственного слоя, которому можно знать про них всех сразу.

## Что дано

- `widgets/header/ui/Header.tsx` (редактируемый) — рендерит `PageTitle` из
  `pages/dashboard` и `Sidebar` из `widgets/sidebar` прямо внутри себя;
- `pages/dashboard/ui/DashboardPage.tsx` (редактируемый) — рендерит только свой
  `PageTitle`, без `Header` и `Sidebar`.

## Требования

1. В `Header.tsx` уберите импорты `PageTitle` и `Sidebar` — оставьте только
   `entities/user`.
2. В `DashboardPage.tsx` добавьте импорт `Header` из `@/widgets/header` и
   `Sidebar` из `@/widgets/sidebar`, отрендерите их вместе с `PageTitle`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `Header.tsx` не импортирует ни `pages`, ни `widgets/sidebar`
- [ ] `DashboardPage.tsx` компонует `Header` и `Sidebar` через их public API
- [ ] Импорты уважают слои и изоляцию слайсов
- [ ] Пройти квиз уровня ≥ 80%
