# Задание 5.5 — Фича не тянет соседнюю фичу (среднее)

## Цель

Разорвать cross-import между двумя фичами одного слоя, опустив общий кусок в
`shared/lib`.

## Что дано

- `features/register` — экспортирует `validateEmail` через свой public API.
- `shared/lib` — уже содержит такую же общую версию `validateEmail`.
- `features/login/model/login.ts` — импортирует `validateEmail` прямо из
  `@/features/register` (cross-import соседней фичи).
- `features/login/index.ts` — пустой public API фичи.

## Требования

1. В `login.ts` замените импорт `validateEmail` с `@/features/register` на
   `@/shared/lib`.
2. В `features/login/index.ts` реэкспортируйте `login` из `./model/login`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `login.ts` больше не импортирует `features/register`
- [ ] `login.ts` берёт `validateEmail` из `@/shared/lib`
- [ ] `features/login/index.ts` экспортирует `login`
- [ ] Пройти квиз уровня ≥ 80%
