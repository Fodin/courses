# Задание 3.5 — Отделяем примитив от доменной логики (среднее)

## Цель

Реализовать доменное форматирование в `entities`, переиспользуя генеричный
примитив из `shared`, и не смешивать зоны ответственности.

## Что дано

- `shared/lib/capitalize.ts` + `shared/lib/index.ts` — генеричный примитив
  `capitalize`, уже честно лежит в shared и закрыт public API (только чтение,
  пример «как надо»).
- `entities/user/model/types.ts` — тип `User` с бизнес-полем `role` (только
  чтение).
- `entities/user/lib/formatUserLabel.ts` — заготовка с TODO: нужно вернуть
  `"Admin — Имя"` для `role === 'admin'` и просто `"Имя"` для `role === 'member'`,
  используя `capitalize` из `@/shared/lib`.
- `entities/user/index.ts` — пустой, с TODO.
- `widgets/user-badge/ui/UserBadge.tsx` — тянет `formatUserLabel` и `User`
  глубокими импортами из `entities/user`.

## Требования

1. Реализуйте `formatUserLabel` в `entities/user/lib/formatUserLabel.ts`,
   импортируя `capitalize` только через `@/shared/lib`.
2. Реэкспортируйте `formatUserLabel` (и `User`) из `entities/user/index.ts`.
3. Переключите `UserBadge.tsx` на импорт из `@/entities/user`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `formatUserLabel` использует `capitalize` из public API `@/shared/lib`
- [ ] `formatUserLabel` учитывает `role` — эта логика доменная, ей не место в shared
- [ ] `entities/user/index.ts` реэкспортирует `formatUserLabel`
- [ ] `UserBadge.tsx` импортирует всё из `@/entities/user`
- [ ] Пройти квиз уровня ≥ 80%
