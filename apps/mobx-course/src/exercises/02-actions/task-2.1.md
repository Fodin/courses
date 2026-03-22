# Задание 2.1: Основы action

## Цель
Настроить `enforceActions: 'always'` и обернуть мутации в action-методы.

## Требования

- [ ] Вызовите `configure({ enforceActions: 'always' })` из `mobx`
- [ ] Создайте класс `CounterStore` с полем `count = 0` и массивом `history`
- [ ] Используйте `makeAutoObservable(this)` в конструкторе
- [ ] Добавьте метод `increment()` — увеличивает count и добавляет в history
- [ ] Добавьте метод `decrement()` — уменьшает count и добавляет в history
- [ ] Добавьте метод `reset()` — сбрасывает count и history
- [ ] Оберните компонент в `observer` и подключите кнопки
