# Задание 4.3 — Полный public API сущности (сложное)

## Цель

Собрать public API разросшегося слайса: вынести наружу всё нужное и спрятать внутреннее,
затем перевести потребителя на этот API.

## Что дано

- `entities/order` с сегментами: `model/types` (`Order`), `model/store`
  (`orderStore`), `ui/OrderCard`, `ui/OrderStatus` и внутренним `lib/format`
  (`formatOrderTotal`, 🔒 скрыт от публичного API);
- `entities/order/index.ts` — пустой public API;
- `widgets/order-summary/ui/OrderSummary.tsx` — тянет всё глубокими импортами.

## Требования

1. В `index.ts` реэкспортируйте наружу: `Order`, `orderStore`, `OrderCard`,
   `OrderStatus`. Внутренний `formatOrderTotal` наружу **не** выносите.
2. Перепишите `OrderSummary.tsx` на импорт из `@/entities/order` (одной строкой).
3. Нажмите «Проверить».

## Чеклист

- [ ] `index.ts` отдаёт `Order`, `orderStore`, `OrderCard`, `OrderStatus`
- [ ] `OrderSummary.tsx` импортирует только из `@/entities/order`
- [ ] Нет глубоких импортов
- [ ] Пройти квиз уровня ≥ 80%
