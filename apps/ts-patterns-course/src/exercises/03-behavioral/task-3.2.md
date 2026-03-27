# Задание 3.2: Observer (TypedEventEmitter)

## Цель

Реализовать типизированный EventEmitter с поддержкой строго типизированных событий через дженерики.

## Требования

1. Определите тип `Listener<T> = (data: T) => void`
2. Создайте класс `TypedEventEmitter<TEventMap>` где `TEventMap extends Record<string, unknown>`:
   - `on<K>(event: K, listener: Listener<TEventMap[K]>)` — подписка
   - `off<K>(event: K, listener: Listener<TEventMap[K]>)` — отписка
   - `emit<K>(event: K, data: TEventMap[K])` — отправка события
   - `listenerCount<K>(event: K): number` — количество слушателей
3. Определите интерфейс `AppEvents` с событиями:
   - `userLogin: { userId: string; timestamp: number }`
   - `userLogout: { userId: string }`
   - `error: { message: string; code: number }`
4. Продемонстрируйте подписку, отправку событий и отписку

## Чеклист

- [ ] `TypedEventEmitter` параметризован картой событий
- [ ] `on` и `emit` типизированы — нельзя передать неверный тип данных
- [ ] `off` корректно удаляет конкретный слушатель
- [ ] `listenerCount` возвращает актуальное количество
- [ ] После `off` событие не вызывает удалённый слушатель
- [ ] Демонстрация показывает подписку, отправку и отписку

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что события логируются корректно
3. Убедитесь, что после `off` количество слушателей уменьшилось
4. Убедитесь, что удалённый слушатель больше не вызывается
