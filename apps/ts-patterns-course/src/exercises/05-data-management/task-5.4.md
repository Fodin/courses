# Задание 5.4: Event Sourcing (Банковский счёт)

## Цель

Реализовать паттерн Event Sourcing на примере банковского счёта: хранить историю событий и восстанавливать текущее состояние через replay.

## Требования

1. Определите базовый интерфейс `DomainEvent`:
   - `type: string`
   - `timestamp: number`
   - `aggregateId: string`
2. Определите события банковского счёта как discriminated union `AccountEvent`:
   - `AccountOpened` -- с полем `ownerName: string`
   - `MoneyDeposited` -- с полем `amount: number`
   - `MoneyWithdrawn` -- с полем `amount: number`
   - `AccountClosed` -- с полем `reason: string`
3. Определите `AccountState`:
   - `ownerName: string`, `balance: number`, `isOpen: boolean`, `transactions: number`
4. Реализуйте `EventStore`:
   - `append(event: AccountEvent): void` -- добавление события
   - `getEvents(aggregateId: string): AccountEvent[]` -- все события для агрегата
   - `getEventsAfter(aggregateId: string, timestamp: number): AccountEvent[]` -- события после момента
5. Реализуйте функцию `replay(events: AccountEvent[]): AccountState`:
   - Последовательно применяет события для вычисления текущего состояния
   - `AccountOpened`: устанавливает ownerName, balance = 0, isOpen = true
   - `MoneyDeposited`: увеличивает balance, инкрементирует transactions
   - `MoneyWithdrawn`: уменьшает balance, инкрементирует transactions
   - `AccountClosed`: устанавливает isOpen = false
6. Продемонстрируйте: открытие счёта, депозиты, снятия, восстановление состояния на любой момент

## Чеклист

- [ ] `DomainEvent` интерфейс с type, timestamp, aggregateId
- [ ] Discriminated union `AccountEvent` с 4 типами событий
- [ ] `AccountState` тип определён
- [ ] `EventStore` хранит и фильтрует события
- [ ] `replay` корректно восстанавливает состояние из массива событий
- [ ] Демонстрация показывает полную историю операций
- [ ] Показано восстановление состояния на промежуточный момент времени

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что баланс корректно вычисляется из последовательности событий
3. Проверьте, что replay на промежуточный момент даёт правильный баланс
4. Убедитесь, что количество транзакций совпадает с количеством deposit/withdraw событий
