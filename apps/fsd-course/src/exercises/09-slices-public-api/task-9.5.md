# Задание 9.5 — Cross-import в UI (среднее)

## Цель

Убрать cross-import между ui-сегментами соседних слайсов, отдав композицию слою выше.

## Что дано

- `entities/product/ui/ProductCard.tsx` рендерит продавца, импортируя `UserCard` из
  `entities/user` — cross-import;
- `widgets/catalog/ui/CatalogItem.tsx` — уже написан правильно (🔒 только чтение):
  прокидывает `UserCard` в `ProductCard` через проп `sellerSlot`.

## Требования

1. Уберите из `ProductCard.tsx` импорт `@/entities/user`.
2. Добавьте проп `sellerSlot?: ReactNode` и отрендерите его вместо внутреннего
   `UserCard` — пусть виджет решает, что показать в этом месте.
3. Нажмите «Проверить».

## Чеклист

- [ ] В `ProductCard.tsx` нет импорта соседнего слайса
- [ ] Продавец приходит через проп `sellerSlot`
- [ ] Пройти квиз уровня ≥ 80%
