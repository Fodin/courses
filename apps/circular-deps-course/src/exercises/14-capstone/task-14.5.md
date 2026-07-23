# Задание 14.5 — FSD-срез без циклов: вернуть к public API (среднее)

## Цель

Починить срез `entities/user` + `features/edit-profile`, где цикл образован двумя глубокими импортами в обход public API.

## Что дано

- `entities/user/model/store.ts` — `getUser`, `updateUserName`; дополнительно импортирует `logProfileEdit` напрямую из `features/edit-profile/model/store` (глубокий импорт в обратном направлении).
- `entities/user/index.ts` — public API сущности; реэкспортирует `getUser`, но **не** `updateUserName`.
- `features/edit-profile/model/store.ts` — импортирует `updateUserName` напрямую из `entities/user/model/store` (глубокий импорт), а не из public API, потому что `updateUserName` не был доступен снаружи.
- `features/edit-profile/index.ts` — public API фичи (🔒 только чтение).

## Требования

1. В `entities/user/model/store.ts` удалите импорт `logProfileEdit` и его вызов — сущность не должна звать features.
2. В `entities/user/index.ts` добавьте реэкспорт `updateUserName` (наряду с уже существующим `getUser`).
3. В `features/edit-profile/model/store.ts` замените импорт `updateUserName` с `@/entities/user/model/store` на `@/entities/user` — теперь это доступно через public API.
4. Нажмите «Проверить».

## Чеклист

- [ ] `entities/user/model/store.ts` не импортирует ничего из `features/*`
- [ ] `updateUserName` реэкспортируется из `entities/user/index.ts`
- [ ] `features/edit-profile/model/store.ts` импортирует `updateUserName` из `@/entities/user`, а не из внутреннего сегмента
- [ ] Проверка `noRuntimeCycles()` — зелёная
- [ ] Проверка `noDeepImport()` — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Один и тот же диагноз («сущность недодала часть API наружу») породил сразу две проблемы: глубокий импорт со стороны фичи (пришлось лезть внутрь) и обратную зависимость со стороны сущности (понадобился повод звать функцию из фичи). Правильное public API решает обе одним действием.
