# Задание 5.3: tuple

## Цель

Научиться использовать `tuple()` для валидации массивов фиксированной длины с разными типами элементов.

## Требования

1. Создайте `coordinatesSchema` — кортеж [latitude, longitude]:
   - latitude: number, required, min(-90), max(90)
   - longitude: number, required, min(-180), max(180)

2. Создайте `personTupleSchema` — кортеж [name, age, role]:
   - name: string, required
   - age: number, required, positive, integer
   - role: string, required, oneOf(['admin', 'user', 'guest'])

3. Используйте `.label()` для элементов кортежа

4. Реализуйте отдельные поля ввода для каждого элемента кортежа

## Чеклист

- [ ] `coordinatesSchema` проверяет диапазоны lat/lng
- [ ] `personTupleSchema` использует `oneOf()` для role
- [ ] Элементы кортежей имеют `.label()` для понятных ошибок
- [ ] Пустые поля обрабатываются как undefined
- [ ] Role выбирается через `<select>`

## Как проверить себя

1. Coordinates: [55.7558, 37.6173] — успех (Москва)
2. Coordinates: [91, 0] — ошибка (latitude > 90)
3. Coordinates: пусто — ошибка required
4. Person: ["Alice", 25, "admin"] — успех
5. Person: ["Alice", -1, "admin"] — ошибка (age не положительный)
6. Person: ["Alice", 25, "superadmin"] — ошибка (role не из списка)
