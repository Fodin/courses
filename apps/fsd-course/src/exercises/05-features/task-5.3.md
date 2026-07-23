# Задание 5.3 — Фича собирает несколько сущностей (сложное)

## Цель

Собрать сложный сценарий из нескольких сущностей и shared, полностью через
public API, и закрыть public API самой фичи.

## Что дано

- `entities/cart`, `entities/order`, `shared/lib` — готовые слайсы с public API.
- `features/checkout/model/checkout.ts` — функция `checkout`, которая лезет вглубь
  всех трёх слайсов мимо их `index.ts`.
- `features/checkout/index.ts` — пустой public API фичи.

## Требования

1. В `checkout.ts` замените импорт `cartStore` на `@/entities/cart`.
2. Замените импорт типа `Order` на `@/entities/order`.
3. Замените импорт `formatPrice` на `@/shared/lib`.
4. В `features/checkout/index.ts` реэкспортируйте `checkout` из `./model/checkout`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `checkout.ts` берёт все три зависимости через public API слайсов
- [ ] `features/checkout/index.ts` экспортирует `checkout`
- [ ] Пройти квиз уровня ≥ 80%
