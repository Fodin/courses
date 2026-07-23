# Задание 4.5 — Два barrel тянут друг друга (среднее)

## Цель

Научиться разрывать цикл между двумя независимыми barrel'ами, когда прямой импорт «в обход» соседнего barrel — неправильное решение, и нужен третий, общий модуль.

## Что дано

- `src/shared.ts` — общая утилита `formatPrice`, ни от кого не зависит (только для чтения).
- `src/featureA/index.ts` — barrel фичи A, реэкспортирует `getA` (только для чтения).
- `src/featureA/component.ts` — берёт `formatPrice` из соседнего barrel `../featureB`, хотя должен брать из `../shared`.
- `src/featureB/index.ts` — barrel фичи B, реэкспортирует `getB` (только для чтения).
- `src/featureB/component.ts` — та же ошибка: берёт `formatPrice` из `../featureA`.

Получается цикл через два barrel'а: `featureA/component → featureB/index → featureB/component → featureA/index → featureA/component`.

## Требования

1. В `featureA/component.ts` замени импорт `formatPrice` на `../shared`.
2. В `featureB/component.ts` сделай то же самое.
3. `shared.ts`, `featureA/index.ts` и `featureB/index.ts` не трогай.
4. Фичи A и B не должны зависеть друг от друга — только от общего `shared.ts`.

## Чеклист

- [ ] `featureA/component.ts` импортирует `formatPrice` из `'../shared'`
- [ ] `featureB/component.ts` импортирует `formatPrice` из `'../shared'`
- [ ] Оба barrel (`featureA/index.ts`, `featureB/index.ts`) не изменены
- [ ] Циклов в графе не осталось
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Убедись, что после правки ни `featureA`, ни `featureB` не импортируют друг друга вообще — оба берут общий код только из `shared.ts`. Все три проверки в лаборатории должны стать зелёными.
