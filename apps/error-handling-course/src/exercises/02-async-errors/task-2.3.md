# Задание 2.3: Promise.allSettled

## Цель
Изучить Promise-комбинаторы и их поведение при ошибках.

## Требования
1. Создайте функцию `fetchUser(id)`, которая для `id=3` возвращает reject
2. Покажите `Promise.all` — как падает при первой ошибке
3. Покажите `Promise.allSettled` — как возвращает все результаты
4. Покажите `Promise.race` с таймаутом
5. Покажите `Promise.any` и `AggregateError`

## Чеклист
- [ ] `fetchUser` реализована с условным reject
- [ ] `Promise.all` падает при ошибке
- [ ] `Promise.allSettled` показывает fulfilled/rejected статусы
- [ ] `Promise.race` с таймаутом
- [ ] `Promise.any` и `AggregateError` обработаны
