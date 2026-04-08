# Задание 12.2: CQRS

## Цель

Реализовать демонстрацию паттерна CQRS (Command Query Responsibility Segregation) на примере каталога товаров. Студент должен разделить запись (команды → события → write store) и чтение (проекции → read models) и увидеть, как одни и те же события питают несколько независимых read models, оптимизированных под разные сценарии.

## Требования

1. Определить тип `CommandType` = `'CreateProduct' | 'UpdatePrice' | 'AddStock' | 'SetInactive'` и интерфейс `Command { type: CommandType; payload: Record<string, unknown> }`.
2. Определить интерфейс `CQRSEvent` с полями `id: string`, `type: string`, `payload: Record<string, unknown>`, `timestamp: number`.
3. Определить интерфейс write-модели `ProductWriteModel`: `productId`, `name`, `price: number`, `stock: number`, `active: boolean`, `version: number`.
4. Определить два интерфейса read-моделей: `ProductCatalogItem` (`productId`, `name`, `price`, `available: boolean`) и `InventoryItem` (`productId`, `name`, `stock: number`, `lowStock: boolean`).
5. Реализовать функцию `processCommand(state: Map<string, ProductWriteModel>, command: Command): CQRSEvent | null` — валидирует команду по бизнес-правилам (нельзя создать уже существующий товар, нельзя изменить несуществующий) и возвращает событие или `null` при отклонении.
6. Реализовать функцию `applyProductEvent(state: Map<string, ProductWriteModel>, event: CQRSEvent): Map<string, ProductWriteModel>` — применяет событие к write store, обрабатывая типы `ProductCreated`, `PriceUpdated`, `StockAdded`, `ProductDeactivated`.
7. Реализовать функцию-проекцию `buildCatalogProjection`: фильтрует только активные товары, возвращает `ProductCatalogItem[]` с `available = stock > 0`.
8. Реализовать функцию-проекцию `buildInventoryProjection`: возвращает `InventoryItem[]` для всех товаров с `lowStock = stock < 10`.
9. Объявить массив `PRESET_COMMANDS` из 5 команд: создать товар A (Widget Pro, $29, склад 50), создать товар B (Gadget X, $89, склад 8), повысить цену A до $39, добавить 5 единиц на склад B, деактивировать A.
10. Реализовать состояния: `writeState: Map<string, ProductWriteModel>`, `eventLog: CQRSEvent[]`, `lastCommandResult: string | null`.
11. Реализовать обработчик `handleCommand`: вызывает `processCommand`, при `null` — записывает сообщение об отклонении; иначе — применяет событие через `applyProductEvent`, добавляет в `eventLog`, записывает сообщение об успехе.
12. Отрисовать write-сторону: пять кнопок команд с цветовой кодировкой + блок результата последней команды + Event Store (прокручиваемый список событий).
13. Отрисовать read-сторону: две независимые проекции в виде таблиц — «Каталог товаров» и «Управление складом». Обе обновляются автоматически после каждой команды.

## Чеклист

- [ ] Типы `CommandType`, `Command`, `CQRSEvent`, `ProductWriteModel` объявлены
- [ ] Read-модели `ProductCatalogItem` и `InventoryItem` объявлены
- [ ] `processCommand` возвращает `null` при нарушении бизнес-правил (дубль, несуществующий товар)
- [ ] `applyProductEvent` обрабатывает все 4 типа событий immutably через `new Map(state)`
- [ ] `buildCatalogProjection` фильтрует `active === true` и вычисляет `available`
- [ ] `buildInventoryProjection` включает все товары и вычисляет `lowStock < 10`
- [ ] Массив `PRESET_COMMANDS` содержит ровно 5 команд
- [ ] `handleCommand` различает успех и отклонение, обновляет `writeState` и `eventLog`
- [ ] Кнопки команд имеют цветовую кодировку
- [ ] Блок результата последней команды отображается
- [ ] Event Store показывает накопленные события (прокручиваемый список)
- [ ] Таблица «Каталог» содержит только активные товары с колонками: Товар, Цена, Наличие
- [ ] Таблица «Склад» содержит все товары с колонками: Товар, Склад, Статус
- [ ] «Мало!» отображается когда `stock < 10`
- [ ] При деактивации товар пропадает из каталога, но остаётся на складе

## Как проверить себя

1. Нажмите «Создать товар A» — в каталоге появляется Widget Pro ($29), в складе 50 ед., статус OK.
2. Нажмите «Создать товар A» повторно — в блоке результата: «Команда CreateProduct отклонена (бизнес-правило)». Event Store не растёт.
3. Нажмите «Создать товар B» — в складе Gadget X: 8 ед., статус «Мало!» (< 10).
4. Нажмите «Повысить цену A» — в каталоге Widget Pro: цена $39. В Event Store появляется `PriceUpdated`.
5. Нажмите «Добавить склад B» — Gadget X: 13 ед., статус OK. Версия в write store увеличилась.
6. Нажмите «Деактивировать A» — Widget Pro исчезает из каталога, но остаётся в таблице склада.
7. Убедитесь, что Event Store содержит ровно столько событий, сколько принятых команд (не считая отклонённых).
