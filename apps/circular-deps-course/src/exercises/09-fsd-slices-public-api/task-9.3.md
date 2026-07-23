# Задание 9.3 — Несколько сегментов и барель замыкают цикл (сложное)

## Цель

Распутать цикл, который проходит через два сегмента одного слайса (`model` и `ui`), не сломав при этом public API слайса — наружу должны по-прежнему быть видны `getDiscount` и `formatWithDiscount`.

## Что дано

- `entities/product/model/discount.ts` — `getDiscount` форматирует цену через `formatPrice` из `ui/format.ts` (неправильное направление: модель не должна зависеть от UI).
- `entities/product/ui/format.ts` — `formatPrice` и `formatWithDiscount`, причём `formatWithDiscount` использует `getDiscount` из `model/discount.ts`.
- `entities/product/model/price-format.ts` — пустая заготовка, куда нужно перенести `formatPrice`.
- `entities/product/index.ts` — public API слайса, реэкспортирует `getDiscount` и `formatWithDiscount` (🔒 только чтение, менять не нужно).

## Требования

1. Перенесите реализацию `formatPrice` в `model/price-format.ts` — этот модуль должен быть «лёгким»: сам ни от `discount.ts`, ни от `ui/format.ts` не зависит.
2. `model/discount.ts` импортирует `formatPrice` из `./price-format`, а не из `../ui/format`.
3. `ui/format.ts` импортирует `formatPrice` из `../model/price-format` и `getDiscount` из `../model/discount`.
4. Убедитесь, что `getDiscount` и `formatWithDiscount` по-прежнему доступны из `entities/product/index.ts` (файл `index.ts` не редактируется — он и так корректен, если сегменты верно экспортируют нужные имена).
5. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `model/price-format.ts` содержит `formatPrice` и ни от чего не зависит
- [ ] `model/discount.ts` импортирует `formatPrice` из `./price-format`
- [ ] `ui/format.ts` импортирует `formatPrice` из `../model/price-format`, а `getDiscount` — из `../model/discount`
- [ ] `getDiscount` виден из `entities/product/index.ts`
- [ ] `formatWithDiscount` виден из `entities/product/index.ts`
- [ ] Проверка `noRuntimeCycles` — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Приём называется «третий модуль»: общая логика (`formatPrice`) выносится в отдельный файл, от которого зависят оба конфликтующих сегмента, а он сам не зависит ни от одного из них. Public API слайса при этом не меняется — снаружи ничего не сломалось.
