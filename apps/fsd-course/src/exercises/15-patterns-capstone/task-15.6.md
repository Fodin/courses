# Задание 15.6 — Мини-приложение целиком (сложное)

## Цель

Капстоун, шаг 3: собрать полную вертикаль `pages → widgets → features → entities →
shared` для страницы товара — все импорты вниз и только через public API.

## Что дано

- `entities/product` уже закрыт корректным public API.
- `shared/ui/Button` и `shared/lib/formatPrice` — переиспользуемые утилиты без
  бизнес-смысла (только чтение).
- `features/buy-now/model/buyNow.ts` — пустая заготовка под `placeOrder`.
- `features/buy-now/index.ts` — пустой public API фичи.
- `widgets/product-page/ui/ProductPage.tsx` — тянет `Product` и `BuyNowButton`
  глубокими импортами.
- `widgets/product-page/index.ts` — пустой public API виджета.
- `pages/product/ui/ProductPageRoute.tsx` — тянет `ProductPage` глубоким импортом.

## Требования

1. Реализуйте `placeOrder(product)` в `features/buy-now/model/buyNow.ts`: верните
   идентификатор заказа вида `order-<product.id>`. Тип `Product` — только через
   public API `@/entities/product`.
2. Опишите `features/buy-now/index.ts`: реэкспортируйте `placeOrder` и
   `BuyNowButton`.
3. Переключите `ProductPage` на импорт `Product` из `@/entities/product` и
   `BuyNowButton` из `@/features/buy-now`.
4. Опишите `widgets/product-page/index.ts`: реэкспортируйте `ProductPage`.
5. Переключите `ProductPageRoute` на импорт `ProductPage` из
   `@/widgets/product-page`.
6. Нажмите «Проверить».

## Чеклист

- [ ] `features/buy-now/index.ts` экспортирует `placeOrder` и `BuyNowButton`
- [ ] `placeOrder` использует тип `Product` из public API `entities/product`
- [ ] `ProductPage` не содержит глубоких импортов
- [ ] `widgets/product-page/index.ts` экспортирует `ProductPage`
- [ ] `ProductPageRoute` импортирует виджет через `@/widgets/product-page`
- [ ] Пройти квиз уровня ≥ 80%
