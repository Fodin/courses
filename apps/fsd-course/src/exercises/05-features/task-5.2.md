# Задание 5.2 — Фича собирает сущность и shared (среднее)

## Цель

Собрать public API фичи, которая опирается сразу на сущность и на shared, и
переключить потребителя фичи на её public API.

## Что дано

- `entities/user` и `shared/api` — готовые слайсы с public API.
- `features/login/model/login.ts` — функция `login`, которая лезет вглубь обоих
  слайсов мимо их `index.ts`.
- `features/login/index.ts` — пустой public API фичи.
- `widgets/header/ui/Header.tsx` — потребитель, который тянет `login` глубоким
  импортом из `@/features/login/model/login`.

## Требования

1. В `login.ts` замените импорт типа `User` на `@/entities/user`.
2. Замените импорт `request` на `@/shared/api`.
3. В `features/login/index.ts` реэкспортируйте `login` из `./model/login`.
4. В `widgets/header/ui/Header.tsx` замените импорт на `@/features/login`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `login.ts` берёт `User` и `request` через public API слайсов
- [ ] `features/login/index.ts` экспортирует `login`
- [ ] `Header.tsx` импортирует `login` через `@/features/login`
- [ ] Пройти квиз уровня ≥ 80%
