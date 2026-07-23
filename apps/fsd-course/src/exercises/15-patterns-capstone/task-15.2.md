# Задание 15.2 — Раздутый public API (среднее)

## Цель

Распознать и исправить антипаттерн «god-slice» / раздутый public API за счёт
`export *`.

## Что дано

- `entities/product/index.ts` реэкспортирует всё через `export *` из трёх сегментов:
  `model/types`, `model/internalCache` и `ui/ProductCard`.
- `model/internalCache.ts` — приватный внутренний кэш слайса (`warmCache`,
  `clearCache`), который никогда не должен быть публичным.
- Наружу реально нужны только тип `Product` и компонент `ProductCard`.

## Требования

1. Замените `export * from './model/types'` и `export * from './ui/ProductCard'` на
   именованные реэкспорты `Product` и `ProductCard`.
2. Полностью уберите строку `export * from './model/internalCache'` — этот сегмент не
   часть public API.
3. Нажмите «Проверить».

## Чеклист

- [ ] `index.ts` не содержит `export *`
- [ ] `index.ts` не упоминает `internalCache`
- [ ] `Product` и `ProductCard` по-прежнему доступны снаружи
- [ ] Пройти квиз уровня ≥ 80%
