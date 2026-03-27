# Задание 8.3: Type-level State Machine

## Цель

Реализовать стейт-машину документа (Draft -> Review -> Published) где допустимые переходы проверяются на уровне типов TypeScript. Невалидные переходы (например, Draft -> Published) вызывают ошибку компиляции.

## Требования

1. Определите типы-маркеры состояний:
   - `DraftState` с полем `readonly _state: 'draft'`
   - `ReviewState` с полем `readonly _state: 'review'`
   - `PublishedState` с полем `readonly _state: 'published'`
2. Определите `DocumentData` с полями `title`, `content`, `author`
3. Создайте класс `TypedDocument<S>` с:
   - `constructor(data: DocumentData, state: string)`
   - `submitForReview(this: TypedDocument<DraftState>): TypedDocument<ReviewState>`
   - `publish(this: TypedDocument<ReviewState>): TypedDocument<PublishedState>`
   - `requestChanges(this: TypedDocument<ReviewState>): TypedDocument<DraftState>`
   - `editContent(this: TypedDocument<DraftState>, content: string): TypedDocument<DraftState>`
   - `describe(): string` — доступен в любом состоянии
4. Создайте фабрику `createDraft(data: DocumentData): TypedDocument<DraftState>`
5. Определите type-level карту переходов:
   - `TransitionMap` — маппинг состояние -> допустимые целевые состояния
   - `CanTransition<From, To>` — conditional type, возвращающий `true`/`false`
6. Продемонстрируйте полный жизненный цикл документа с возвратом на доработку

## Чеклист

- [ ] Каждое состояние — отдельный интерфейс-маркер
- [ ] Параметр `this` ограничивает вызов метода конкретным состоянием
- [ ] `publish()` можно вызвать **только** на `TypedDocument<ReviewState>`
- [ ] `editContent()` можно вызвать **только** на `TypedDocument<DraftState>`
- [ ] `Published` — терминальное состояние, нет методов перехода
- [ ] `TransitionMap` и `CanTransition` определены как type-level утилиты
- [ ] Каждый метод возвращает **новый** экземпляр (иммутабельность)

## Как проверить себя

1. Нажмите кнопку запуска — полный цикл Draft -> Review -> Draft -> Review -> Published
2. Попробуйте вызвать `draft.publish()` — должна быть ошибка компиляции
3. Попробуйте вызвать `published.editContent("x")` — должна быть ошибка
4. Убедитесь, что `requestChanges` возвращает документ в Draft, и после этого снова доступен `editContent`
