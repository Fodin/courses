# Задание 3.6 — Разбираем «свалку» на shared и сущность (сложное)

## Цель

Закрыть входы сразу двух честно разведённых зон — генеричного `shared/lib` и
доменного `entities/user` — и подключить потребителя без единого глубокого
импорта.

## Что дано

- `shared/lib/capitalize.ts` — генеричный примитив (только чтение).
- `entities/user/model/types.ts` — тип `User` (только чтение).
- `entities/user/lib/formatUserLabel.ts` — доменное форматирование, уже
  импортирует `capitalize` через `@/shared/lib` (только чтение).
- `shared/lib/index.ts` и `entities/user/index.ts` — пустые заготовки с TODO.
- `widgets/user-badge/ui/UserBadge.tsx` — тянет `formatUserLabel` и `User`
  глубокими импортами прямо из `entities/user/lib` и `entities/user/model`.

## Требования

1. В `shared/lib/index.ts` реэкспортируйте `capitalize`.
2. В `entities/user/index.ts` реэкспортируйте `User` и `formatUserLabel`.
3. Переключите `UserBadge.tsx` на единый импорт из `@/entities/user`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `shared/lib/index.ts` реэкспортирует `capitalize`
- [ ] `entities/user/index.ts` реэкспортирует `User` и `formatUserLabel`
- [ ] `UserBadge.tsx` не содержит ни одного глубокого импорта
- [ ] Пройти квиз уровня ≥ 80%
