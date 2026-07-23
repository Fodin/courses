# Задание 14.6 — FSD-срез без циклов: собрать архитектуру целиком (сложное)

## Цель

Финальная задача курса: собрать корректную FSD-архитектуру мини-приложения «корзина» из 8 модулей на 4 слоях, устранив сразу три нарушения и цикл, который они образуют.

## Что дано

- `shared/lib/format.ts` — `formatPrice` (🔒 только чтение).
- `entities/product/model/store.ts` и `index.ts` — сущность товара, публичный API уже корректен (🔒 только чтение).
- `entities/cart/model/store.ts` — сущность корзины; **нарушение 1**: импортирует `getCheckoutTotal` напрямую из `features/checkout/model/store` (и вверх по слоям, и в обход public API).
- `entities/cart/index.ts` — public API сущности корзины (🔒 только чтение).
- `features/checkout/model/store.ts` — фича оформления заказа; **нарушение 2**: импортирует `getProduct` напрямую из `entities/product/model/store` (глубокий импорт).
- `features/checkout/index.ts` — public API фичи (🔒 только чтение).
- `widgets/cart-summary/index.ts` — виджет сводки; **нарушение 3**: импортирует `getCheckoutTotal` напрямую из `features/checkout/model/store` (глубокий импорт).

## Требования

1. В `entities/cart/model/store.ts` удалите импорт `getCheckoutTotal` из `features/checkout` и функцию `logCartTotal`, которая его использует, — это единственная причина цикла `entities/cart` ⇄ `features/checkout`.
2. В `features/checkout/model/store.ts` замените импорт `getProduct` с `@/entities/product/model/store` на `@/entities/product`.
3. В `widgets/cart-summary/index.ts` замените импорт `getCheckoutTotal` с `@/features/checkout/model/store` на `@/features/checkout`.
4. Не трогайте файлы с пометкой «только чтение» — они уже корректны.
5. Нажмите «Проверить» — все три проверки должны стать зелёными одновременно.

## Чеклист

- [ ] `entities/cart/model/store.ts` не импортирует ничего из `features/*`
- [ ] `features/checkout/model/store.ts` импортирует `getProduct` из `@/entities/product` (public API)
- [ ] `widgets/cart-summary/index.ts` импортирует `getCheckoutTotal` из `@/features/checkout` (public API)
- [ ] Проверка `noRuntimeCycles()` — зелёная
- [ ] Проверка `importsRespectLayers()` — зелёная
- [ ] Проверка `noDeepImport()` — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Пройдите весь workflow уровня вслух: обнаружили граф с одним циклом и тремя глубокими импортами → классифицировали (один рантайм-цикл между entities и features, три нарушения public API) → выбрали приём (убрать обратную зависимость + вернуть все межслайсовые импорты к public API) → починили → все три проверки зелёные. Это и есть капстоун — сборка всего курса в одну задачу.
