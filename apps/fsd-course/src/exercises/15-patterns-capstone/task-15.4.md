# Задание 15.4 — Собрать слайс-сущность (простое)

## Цель

Капстоун, шаг 1: собрать слайс-сущность с public API и подключить потребителя.

## Что дано

- `entities/review` — уже есть сегменты `model/types.ts` (тип `Review`) и
  `ui/ReviewItem.tsx` (компонент), но нет `index.ts`.
- `widgets/review-list/ui/ReviewList.tsx` — тянет тип и компонент глубокими импортами.

## Требования

1. Опишите `entities/review/index.ts`: реэкспортируйте тип `Review` и компонент
   `ReviewItem`.
2. Переключите `ReviewList` на импорт из `@/entities/review`, уберите глубокие
   импорты в `model/types` и `ui/ReviewItem`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `entities/review/index.ts` экспортирует `Review` и `ReviewItem`
- [ ] `ReviewList` импортирует всё из `@/entities/review`
- [ ] Нет глубоких импортов
- [ ] Пройти квиз уровня ≥ 80%
