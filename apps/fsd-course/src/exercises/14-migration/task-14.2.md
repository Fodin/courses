# Задание 14.2 — Выделяем сущность из legacy (среднее)

## Цель

Собрать полноценный слайс `entities/user` из кода, разбросанного по legacy-папкам
`utils/` и `components/`, и закрыть его публичным API.

## Что дано

- `src/utils/userHelpers.ts` — тип `User` (🔒 только чтение, образец).
- `src/components/UserBadge.tsx` — компонент отображения пользователя (🔒 только
  чтение, образец).
- `src/entities/user/model/types.ts` — заглушка с TODO.
- `src/entities/user/ui/UserBadge.tsx` — заглушка с TODO.
- `src/entities/user/index.ts` — пустой public API.
- `src/widgets/profile/ui/ProfileWidget.tsx` — потребитель, сейчас импортирующий тип
  и компонент из legacy-путей.

## Требования

1. Перенесите интерфейс `User` в `entities/user/model/types.ts`.
2. Перенесите компонент `UserBadge` в `entities/user/ui/UserBadge.tsx`, поправив
   импорт типа на `../model/types`.
3. Заполните `entities/user/index.ts`, реэкспортировав `User` и `UserBadge`.
4. Переключите `ProfileWidget.tsx` на импорт из `@/entities/user`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `entities/user/model/types.ts` содержит интерфейс `User`
- [ ] `entities/user/ui/UserBadge.tsx` содержит перенесённый компонент
- [ ] `entities/user/index.ts` реэкспортирует `User` и `UserBadge`
- [ ] `ProfileWidget.tsx` импортирует всё из `@/entities/user`
- [ ] Пройти квиз уровня ≥ 80%
