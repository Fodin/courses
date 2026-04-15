# Задание 10.2: pipe и flow

## Цель

Понять разницу между `pipe` (data first) и `flow` (point-free) и научиться выбирать между ними.

## Требования

1. Импортировать `pipe`, `flow` из `'fp-ts/function'`
2. Импортировать `* as A from 'fp-ts/Array'`, `* as S from 'fp-ts/string'`
3. Реализовать функцию `processWithPipe(names: string[]): string` — использует `pipe` с данными напрямую
4. Реализовать функцию `processWithFlow`: `flow(...)` — возвращает переиспользуемую функцию
5. Pipeline: filter длина > 3 → map toUpperCase → sort → join(', ')
6. Оба подхода дают одинаковый результат
7. Добавить кнопки переключения между режимами

## Чеклист

- [ ] `pipe` принимает данные первым аргументом
- [ ] `flow` создаёт функцию, данные передаются позже
- [ ] Используется `A.filter`, `A.map`, `A.sort` из fp-ts
- [ ] `S.toUpperCase` из `fp-ts/string`
- [ ] `S.Ord` для сортировки строк
- [ ] Оба дают одинаковый результат на одних данных

## Как проверить себя

Массив `['Alice', 'Bob', 'Carol', 'Dan', 'Eve', 'Al']`:
- pipe режим → 'ALICE, CAROL, CAROL, EVE' (только длина > 3, отсортировано)
- flow режим → тот же результат
- Переиспользование: `const process = processWithFlow; process(names1); process(names2)`
