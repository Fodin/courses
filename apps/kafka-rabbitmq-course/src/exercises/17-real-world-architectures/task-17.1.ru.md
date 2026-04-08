# Задание 17.1: E-Commerce — архитектура заказа

## Цель

Реализовать интерактивную анимацию гибридной микросервисной архитектуры интернет-магазина. Пользователь нажимает кнопку "Создать заказ" и пошагово наблюдает, как запрос проходит через API Gateway, OrderService, RabbitMQ (команды) и Kafka (события) до момента, когда заказ полностью подтверждён и email отправлен.

## Требования

1. Объявить тип `OrderStep` с 11 значениями: `'idle' | 'api-gateway' | 'order-created' | 'payment-command' | 'payment-processing' | 'payment-done' | 'inventory-command' | 'inventory-reserved' | 'order-confirmed' | 'notification-sent' | 'complete'`.
2. Объявить интерфейс `FlowMessage` с полями: `id: number`, `from: string`, `to: string`, `text: string`, `broker: 'rabbitmq' | 'kafka' | 'http'`, `step: OrderStep`.
3. Объявить константный массив `FLOW_MESSAGES: FlowMessage[]` из 10 сообщений, описывающих поток: Client → API Gateway (HTTP), API Gateway → OrderService (HTTP), OrderService → RabbitMQ (команда ProcessPayment), RabbitMQ → PaymentService, PaymentService → Kafka (PaymentCompleted), OrderService → RabbitMQ (ReserveInventory), RabbitMQ → InventoryService, InventoryService → Kafka (ItemReserved), Kafka → OrderService (OrderConfirmed), Kafka → NotificationService (SendEmail).
4. Объявить словарь `STEP_LABELS: Record<OrderStep, string>` с человекочитаемым описанием каждого шага на русском.
5. Объявить словари `BROKER_COLORS` (rabbitmq → `'#ff6600'`, kafka → `'#3a7ebf'`, http → `'#38a169'`) и `BROKER_LABELS` (rabbitmq → `'RabbitMQ (команды)'`, kafka → `'Kafka (события)'`, http → `'HTTP/REST'`).
6. Объявить словарь `SERVICE_POSITIONS` с координатами `{ x, y, color }` для узлов: Client, API Gateway, OrderService, RabbitMQ, PaymentService, Kafka, InventoryService, NotificationService.
7. Реализовать вспомогательную функцию `getNodeCenter(name)`, возвращающую `{ cx, cy }` — центр прямоугольника узла.
8. Объявить состояния компонента: `currentStep: number` (исходно `-1`), `running: boolean`, `speed: number` (исходно `1200`), `timerRef` через `useRef`.
9. Реализовать `startFlow`: сбрасывает `currentStep` в `-1`, устанавливает `running: true`.
10. В `useEffect` организовать автопрокрутку: каждые `speed` мс увеличивать `currentStep` на 1 пока `running === true` и шаги не исчерпаны; при исчерпании установить `running: false`.
11. Реализовать `reset`: останавливает таймер, устанавливает `running: false` и `currentStep: -1`.
12. Отрисовать SVG-диаграмму (`viewBox="0 0 650 360"`) с узлами сервисов и анимированными стрелками. Стрелки уже видимых сообщений отображаются приглушёнными, последняя активная — полной яркостью с подписью. Узлы подсвечиваются цветом при активности.
13. Добавить блок статуса шага с цветным индикатором брокера и счётчиком шагов.
14. Добавить прокручиваемый журнал сообщений в стиле монospace с цветовой меткой брокера.
15. Добавить легенду цветов (RabbitMQ / Kafka / HTTP).
16. Добавить кнопки "Создать заказ" / "Сбросить" и селектор скорости (Медленно / Нормально / Быстро).
17. При завершении анимации (`currentStepName === 'complete'`) отображать итоговый зелёный блок с объяснением гибридной архитектуры.

## Чеклист

- [ ] Тип `OrderStep` объявлен с 11 значениями
- [ ] Интерфейс `FlowMessage` объявлен с полями `id`, `from`, `to`, `text`, `broker`, `step`
- [ ] Массив `FLOW_MESSAGES` содержит ровно 10 сообщений в правильном порядке
- [ ] Три брокера (`rabbitmq`, `kafka`, `http`) раскрашены разными цветами
- [ ] Все 8 сервисных узлов присутствуют в `SERVICE_POSITIONS` с координатами и цветом
- [ ] `getNodeCenter` возвращает центр прямоугольника с учётом `NODE_W` и `NODE_H`
- [ ] Состояния `currentStep`, `running`, `speed`, `timerRef` объявлены
- [ ] `startFlow` сбрасывает шаг и запускает анимацию
- [ ] `useEffect` автоматически продвигает `currentStep` с задержкой `speed` мс
- [ ] `reset` останавливает таймер и возвращает в исходное состояние
- [ ] SVG-диаграмма отрисовывается с узлами и стрелками
- [ ] Последняя активная стрелка полноцветная, предыдущие — приглушённые
- [ ] Активные узлы (sender и receiver текущего шага) подсвечиваются
- [ ] Стрелки содержат `markerEnd` с цветными наконечниками (`<defs><marker ...>`)
- [ ] Блок статуса отображает `STEP_LABELS[currentStepName]`
- [ ] Журнал сообщений прокручивается и показывает все видимые шаги
- [ ] Легенда отображает три типа линий с подписями
- [ ] Кнопка "Создать заказ" заблокирована во время выполнения
- [ ] Селектор скорости меняет `speed` (2000 / 1200 / 600 мс)
- [ ] Итоговый блок появляется только при `currentStepName === 'complete'`

## Как проверить себя

1. Откройте задание — SVG-схема с серыми узлами, статус "Ожидание", кнопка активна.
2. Нажмите "Создать заказ". Стрелки появляются одна за другой: зелёные (HTTP), оранжевые (RabbitMQ), синие (Kafka). Текущий sender и receiver подсвечиваются своим цветом.
3. В журнале снизу видны все пройденные сообщения, последнее выделено фоном.
4. После последнего шага (шаг 10/10) появляется итоговый зелёный блок с текстом о гибридной архитектуре.
5. Выберите скорость "Быстро" — анимация заметно ускоряется.
6. Нажмите "Сбросить" — схема возвращается в исходное серое состояние, журнал очищается.
