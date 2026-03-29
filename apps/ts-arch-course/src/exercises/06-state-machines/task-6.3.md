# Задание 6.3: Hierarchical States

## Цель

Реализовать иерархический конечный автомат с вложенными состояниями для моделирования сложного приложения с подсистемами подключения и аутентификации.

## Требования

1. Создайте `ConnectionSubState` как discriminated union: `connecting` (с attempt) и `connected` (с connectedAt, latency)
2. Создайте `AuthSubState` как discriminated union: `anonymous`, `authenticating` (с provider), `authenticated` (с userId, token), `authError` (с reason)
3. Создайте верхнеуровневый `AppState`: `offline`, `online` (содержит connection + auth), `maintenance` (с estimatedEnd, message)
4. Реализуйте функцию `describeAppState`, которая описывает полное состояние приложения, обрабатывая все уровни вложенности
5. Реализуйте reducer `reduceAppState(state, action)` с действиями: GO_ONLINE, GO_OFFLINE, CONNECTED, LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT, MAINTENANCE
6. Действия, неприменимые к текущему состоянию (например, CONNECTED когда offline), должны возвращать состояние без изменений

## Чек��ист

- [ ] `AppState` имеет 3 верхнеуровневых варианта с разными данными
- [ ] `connection` и `auth` доступны только в состоянии `online`
- [ ] `describeAppState` обрабатывает все комбинации верхнего и вложенных уровней
- [ ] Reducer корректно обрабатывает все 8 действий
- [ ] Действия, неприменимые к текущей фазе, игнорируются
- [ ] Компонент демонстрирует пошаговый переход через в��е фазы

## Как проверит�� себя

1. Попробуйте обратиться к `state.connection` без проверки `phase === 'online'` -- должна быть ошибка TS
2. Пройдите полный цикл: offline → online(connecting) → online(connected, anonymous) → online(connected, authenticated)
3. Отправьте CONNECTED в состоянии offline -- состояние не должно измениться
