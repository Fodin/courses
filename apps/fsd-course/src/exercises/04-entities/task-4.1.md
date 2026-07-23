# Задание 4.1 — Устройство сущности и public API (простое)

## Цель

Закрыть слайс `entities/product` публичным интерфейсом — файлом `index.ts`.

## Что дано

- `entities/product/model/types.ts` — тип `Product` (🔒 только чтение);
- `entities/product/ui/ProductCard.tsx` — компонент `ProductCard` (🔒 только чтение);
- `entities/product/index.ts` — **пустой public API**, его надо заполнить.

## Требования

1. В `index.ts` реэкспортируйте тип `Product` (`export type { Product } from './model/types'`).
2. Там же реэкспортируйте `ProductCard` (`export { ProductCard } from './ui/ProductCard'`).
3. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `index.ts` реэкспортирует `Product`
- [ ] `index.ts` реэкспортирует `ProductCard`
- [ ] Пройти квиз уровня ≥ 80%
