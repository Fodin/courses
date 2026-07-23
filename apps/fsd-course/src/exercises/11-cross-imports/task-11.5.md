# Задание 11.5 — Композиция через слот в виджете (среднее)

## Цель

Поднять композицию двух сущностей на уровень выше — в виджет — вместо прямого
cross-import в UI.

## Что дано

- `entities/order/ui/OrderCard.tsx` напрямую импортирует `CustomerBadge` из
  соседнего слайса `entities/customer` и сам собирает объект покупателя.
- `widgets/order-summary/ui/OrderSummary.tsx` — уже написан правильно (только
  чтение): он собирает `OrderCard` и `CustomerBadge` вместе через их публичные
  API. Ориентируйтесь на него.

## Требования

1. Уберите из `OrderCard.tsx` импорт `@/entities/customer`.
2. Добавьте проп-слот `customerSlot?: ReactNode` — место, куда виджет положит
   `CustomerBadge`.
3. Отрендерите `{customerSlot}` вместо прямого вызова `CustomerBadge`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `OrderCard.tsx` не импортирует `entities/customer`
- [ ] `OrderCard.tsx` принимает и рендерит `customerSlot`
- [ ] Пройти квиз уровня ≥ 80%
