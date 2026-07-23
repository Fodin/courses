# Задание 14.4 — Оформляем действие как фичу (простое)

## Цель

Собрать пользовательский сценарий «добавить в корзину», разбросанный по legacy-коду,
в отдельный слайс `features/add-to-cart`.

## Что дано

- `src/utils/cartHandlers.ts` — обработчик `addToCart` (🔒 только чтение).
- `src/components/AddToCartButton.tsx` — кнопка, вызывающая обработчик (🔒 только
  чтение).
- `src/features/add-to-cart/model/addToCart.ts` — заглушка с TODO.
- `src/features/add-to-cart/ui/AddToCartButton.tsx` — заглушка с TODO.
- `src/features/add-to-cart/index.ts` — пустой public API.
- `src/pages/product/ui/ProductPage.tsx` — потребитель, сейчас импортирующий кнопку
  из legacy-пути.

## Требования

1. Перенесите функцию `addToCart` в `features/add-to-cart/model/addToCart.ts`.
2. Перенесите кнопку в `features/add-to-cart/ui/AddToCartButton.tsx`, обработчик
   берите из своего слайса (`../model/addToCart`).
3. Заполните `features/add-to-cart/index.ts`, реэкспортировав `AddToCartButton`.
4. Переключите `ProductPage.tsx` на импорт из `@/features/add-to-cart`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `features/add-to-cart/model/addToCart.ts` содержит перенесённую функцию
- [ ] `features/add-to-cart/index.ts` реэкспортирует `AddToCartButton`
- [ ] `ProductPage.tsx` импортирует `AddToCartButton` из `@/features/add-to-cart`
- [ ] Пройти квиз уровня ≥ 80%
