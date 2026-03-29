# Задание 6.2: State Data Association

## Цель

Реализовать конечный автомат с ассоциированными данными для каждого состояния через discriminated union, обеспечивая типобезопасный доступ к данным через сужение т��па.

## Требования

1. Создайте тип `FetchState<T, E>` как discriminated union с вариантами: `idle` (без данных), `loading` (с `startedAt`), `success` (с `data: T` и `fetchedAt`), `error` (с `error: E`, `failedAt`, `retryCount`)
2. Реализуйте конструкторы состояний: `idle()`, `loading()`, `success()`, `error()`
3. Реализуйте `foldFetchState` -- исчерпывающую обработку с обработчиком для каждого состояния
4. Реализуйте `mapFetchState` -- трансформацию данных в success-состоянии
5. Создайте тип `FormState` с 5 состояниями (editing, validating, submitting, submitted, failed), каждое с уникальными данными
6. Покажите type narrowing: в каждой ветке switch доступны только данные этого состояния

## Чеклист

- [ ] `FetchState` -- generic discriminated union с 4 вариантами
- [ ] В ветке `success` доступны `data` и `fetchedAt`, но не `error`
- [ ] В ветке `error` доступны `error` и `retryCount`, но не `data`
- [ ] `foldFetchState` обрабатывает все состояния исчерпывающе
- [ ] `mapFetchState` трансформирует данные только в success-состоянии
- [ ] `FormState` демонстрирует 5 разных наборов данных для 5 состояний

## Как проверить себя

1. Попробуйте обратиться к `state.data` без проверки `status` -- должна быть ошибка TS
2. В `foldFetchState` уберите один обработчик -- должна быть ошибка TS
3. `mapFetchState` для idle/loading/error должен вернуть состояние без изменений
