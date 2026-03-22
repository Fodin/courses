# Задание 1.1: makeAutoObservable

## Цель
Рефакторить стор с явными аннотациями на `makeAutoObservable`.

## Требования

- [ ] Создайте `TemperatureStore` с полем `celsius`
- [ ] Используйте `makeAutoObservable(this)` в конструкторе
- [ ] Добавьте метод `setCelsius(value)` для изменения температуры
- [ ] Добавьте геттер `fahrenheit` — формула: `celsius * 9/5 + 32`
- [ ] Добавьте геттер `description` — 'Freezing' / 'Cold' / 'Comfortable' / 'Hot'
- [ ] Оберните компонент в `observer` и покажите данные
