# Задание 4.2 — Два сервиса тянут утилиту через barrel (среднее)

## Цель

Научиться чинить несколько независимых замыканий на barrel в одном пакете — когда сразу два соседних модуля берут общую утилиту не напрямую, а через `index.ts`.

## Что дано

- `src/index.ts` — barrel, реэкспортирует `getUser`, `getOrder` и `formatDate` (только для чтения).
- `src/formatUtils.ts` — утилита `formatDate`, ни от кого не зависит (только для чтения).
- `src/userService.ts` — берёт `formatDate` через `./index`, хотя нужный файл лежит рядом.
- `src/orderService.ts` — та же ошибка: берёт `formatDate` через `./index`.

Каждый из сервисов реэкспортируется barrel'ом, поэтому импорт `formatDate` через `./index` замыкает свой собственный цикл: `userService → index → userService` и отдельно `orderService → index → orderService`.

## Требования

1. В `userService.ts` замени импорт `formatDate` на прямой путь `./formatUtils`.
2. В `orderService.ts` сделай то же самое.
3. `index.ts` и `formatUtils.ts` не трогай — barrel остаётся рабочей точкой входа.
4. После правок в графе зависимостей не должно быть циклов.

## Чеклист

- [ ] `userService.ts` импортирует `formatDate` из `'./formatUtils'`
- [ ] `orderService.ts` импортирует `formatDate` из `'./formatUtils'`
- [ ] `index.ts` и `formatUtils.ts` не изменены
- [ ] Циклов в графе не осталось
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Все три проверки в лаборатории (`noRuntimeCycles` и два `fileContains`) должны стать зелёными. Обрати внимание: изменить нужно ровно два файла — `index.ts` и `formatUtils.ts` при этом остаются нетронутыми.
