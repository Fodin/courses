# Задание 12.3: Checkout flow на state machine

## Цель

Реализовать многошаговый процесс оформления заказа через state machine на `useReducer`. Каждое состояние — discriminated union. Переходы между состояниями — единственный способ изменить поток. TypeScript должен защищать от обращения к данным, которых нет в текущем состоянии.

## Требования

1. Состояния: `idle` → `shipping` → `payment` → `confirmation` → возможен `error` из любого состояния
2. Тип `CheckoutState` — discriminated union с полем `status`
3. Состояние `confirmation` содержит `orderId: string` и `shipping: ShippingData`
4. Состояние `error` содержит `message: string`
5. Typed actions: `START_CHECKOUT`, `SUBMIT_SHIPPING`, `SUBMIT_PAYMENT`, `CONFIRM_ORDER`, `SET_ERROR`, `RESET`
6. Reducer защищает от невалидных переходов: `SUBMIT_PAYMENT` работает только из `payment`
7. UI отображает текущий шаг: прогресс-бар или numbered stepper
8. Кнопка "Симулировать ошибку" доступна на шагах `shipping` и `payment`

## Подсказки

- `interface ShippingData { name: string; address: string; city: string }`
- Защита переходов в reducer: `if (state.status !== 'payment') return state`
- Рендеринг по состоянию через `switch (state.status)` или условный рендеринг
- Прогресс-бар: массив шагов `['idle', 'shipping', 'payment', 'confirmation']`, текущий шаг — индекс
- Симуляция подтверждения заказа: `Math.random().toString(36).slice(2, 10).toUpperCase()`

## Чеклист

- [ ] `CheckoutState` — discriminated union с полем `status`
- [ ] Тип `ShippingData` с обязательными полями
- [ ] Reducer: каждый case проверяет допустимость перехода
- [ ] Из состояния `confirmation` нельзя перейти в `shipping` или `payment` напрямую
- [ ] TypeScript: в состоянии `idle` нельзя обратиться к `state.shipping`
- [ ] UI меняется при смене состояния
- [ ] Прогресс-бар или stepper показывает текущий шаг
- [ ] Кнопка сброса возвращает в `idle`
- [ ] Ошибка показывает сообщение и кнопку повтора

## Как проверить себя

Откройте задание. Пройдите весь флоу:
1. Нажать "Оформить заказ" → переход в `shipping`
2. Заполнить форму → переход в `payment`
3. Нажать "Оплатить" → переход в `confirmation` с номером заказа
4. Нажать "Симулировать ошибку" на шаге `payment` → переход в `error`
5. Нажать "Повторить" → возврат в `payment`
6. Нажать "Сброс" → возврат в `idle`

Убедитесь: в DevTools React — нет флагов `isLoading`/`isError`, только `status`.
