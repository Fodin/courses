# Задание 15.5 — Фича поверх сущности, виджет поверх фичи (среднее)

## Цель

Капстоун, шаг 2: собрать фичу поверх сущности и виджет поверх фичи — цепочка через
public API.

## Что дано

- `entities/comment` уже закрыт корректным public API (только чтение, менять не
  нужно).
- `features/add-comment/model/addComment.ts` — пустая заготовка под логику
  `submitComment`.
- `features/add-comment/index.ts` — пустой public API фичи.
- `widgets/comments-panel/ui/CommentsPanel.tsx` — тянет `submitComment` и
  `CommentForm` глубокими импортами из внутренних сегментов фичи.

## Требования

1. Реализуйте `submitComment(list, comment)` в `model/addComment.ts`: она возвращает
   новый массив комментариев с добавленным `comment` в конце. Тип `Comment`
   импортируйте через public API `@/entities/comment`.
2. Опишите `features/add-comment/index.ts`: реэкспортируйте `submitComment` и
   `CommentForm`.
3. Переключите `CommentsPanel` на импорт из `@/features/add-comment`, уберите
   глубокие импорты во внутренние сегменты фичи.
4. Нажмите «Проверить».

## Чеклист

- [ ] `features/add-comment/index.ts` экспортирует `submitComment` и `CommentForm`
- [ ] `submitComment` использует тип `Comment` из public API `entities/comment`
- [ ] `CommentsPanel` импортирует всё из `@/features/add-comment`
- [ ] Пройти квиз уровня ≥ 80%
