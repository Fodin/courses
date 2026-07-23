# Задание 10.6 — Полноценное ревью: цикл + импорт вверх + глубокий импорт (сложное)

## Цель

Провести полноценное код-ревью небольшого модуля, в котором сразу ТРИ связанных нарушения — импорт вверх по слоям, обход public API и рантайм-цикл, — и навести порядок.

## Что дано

- `src/entities/user/model/types.ts` (только для чтения) — интерфейс `User`.
- `src/entities/user/index.ts` (редактируется) — публичный API слайса, пока не экспортирует `setSession`/`getSession`.
- `src/entities/user/model/session.ts` (редактируется) — внутренний файл слайса; `setSession` импортирует `notifyProfileSaved` из `features/profile-edit` — это импорт «вверх» по слоям.
- `src/features/profile-edit/index.ts` (редактируется) — импортирует `setSession` НАПРЯМУЮ из `entities/user/model/session.ts`, минуя `entities/user/index.ts`.

Импорт вверх и обход public API вместе замыкают рантайм-цикл `session.ts → profile-edit/index.ts → session.ts`.

## Требования

1. Не редактируйте `entities/user/model/types.ts` — он уже корректен.
2. Уберите из `entities/user/model/session.ts` импорт и вызов `notifyProfileSaved` — сессии не нужно знать про `features`.
3. Добавьте `setSession` и `getSession` в публичный экспорт `entities/user/index.ts`.
4. Измените `features/profile-edit/index.ts` так, чтобы он импортировал `setSession` через `entities/user` (public API), а не напрямую из `model/session.ts`, и сам вызывал `notifyProfileSaved` после сохранения сессии.
5. После правок в проекте не должно быть ни рантайм-цикла, ни импорта вверх по слоям, ни обхода public API.

## Чеклист

- [ ] `entities/user/model/session.ts` больше не импортирует ничего из `features`
- [ ] `entities/user/index.ts` экспортирует `setSession` и `getSession`
- [ ] `features/profile-edit/index.ts` импортирует `setSession` из `entities/user`, а не из `model/session`
- [ ] `saveProfile` сам вызывает `notifyProfileSaved` после `setSession`
- [ ] Проверка «нет рантайм-цикла» — зелёная
- [ ] Проверка «импорты уважают слои» — зелёная
- [ ] Проверка «нет глубокого импорта» — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

1. Нажмите «Проверить» — все три проверки должны стать зелёными.
2. Откройте «Показать эталон», если не получается.
3. Для каждого из трёх нарушений назовите вслух, какой принцип FSD оно нарушало, прежде чем сверяться с эталоном.
