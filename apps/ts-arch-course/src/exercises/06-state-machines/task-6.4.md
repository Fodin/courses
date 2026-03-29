# Задание 6.4: State Narrowing

## Цель

Реализовать паттерн-матчинг по состояниям конечного автомата с использованием type guards, Extract и исчерпывающей обработки для моделирования workflow документа.

## Тр��бования

1. Создайте тип `DocumentState` как discriminated union с 5 состояниями: `draft`, `review`, `approved`, `published`, `archived` -- каждое с уникальными дан��ыми
2. Реализуйте type guard `isInState(state, status)`, который сужает тип до конкретного варианта через `Extract`
3. ��еализуйте `getStateData(state, status)` -- безопасное извлечение данных конкретного состояния или null
4. Реализуйте `matchDocumentState` -- exhaustive match, требующий обработчик для каждого состояния
5. Создайте функции-переходы, принимающие только конкретное состояние: `submitForReview(draft)`, `approve(review)`, `publish(approved)`
6. Функция `archive(state)` должна принимать документ в любом состоянии кроме `archived`

## Чеклист

- [ ] `DocumentState` -- discriminated union по полю `status` с 5 вариантами
- [ ] `isInState(doc, 'published')` сужает тип: после проверки доступны `url`, `publishedAt`
- [ ] `getStateData(doc, 'review')` возвращает typed данные или null
- [ ] `matchDocumentState` требует обработчик для каждого из 5 состояний
- [ ] `submitForReview` принимает только draft, `approve` -- только review
- [ ] `archive` принимает любое состояние, кроме уже заархивированного

## Как проверить се��я

1. Передайте draft-документ в `approve()` -- должна быть ошибка TS (ожидает review)
2. В `matchDocumentState` уберите один обработчик -- должна быть ошибка TS
3. После `isInState(doc, 'review')` проверьте доступ к `doc.reviewer` -- должно работать
