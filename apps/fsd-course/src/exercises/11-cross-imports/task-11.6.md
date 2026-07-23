# Задание 11.6 — Распутать узел cross-import'ов на уровне widget (сложное)

## Цель

Распутать сразу два узла связи между сущностями (в модели и в UI), подняв всю
сборку на уровень нового виджета.

## Что дано

- `entities/customer/model/types.ts` импортирует `Order` и хранит
  `lastOrder: Order` — цикл `customer → order`.
- `entities/order/model/types.ts` импортирует `Customer` и хранит
  `customer: Customer` — цикл `order → customer`.
- `entities/order/ui/OrderCard.tsx` напрямую импортирует `CustomerBadge` из
  `entities/customer`.
- `widgets/order-page/ui/OrderPage.tsx` — пустая заготовка, которую нужно
  дописать.

## Требования

1. В `Customer` замените `lastOrder: Order` на `lastOrderId: string`.
2. В `Order` замените `customer: Customer` на `customerId: string`.
3. Уберите из `OrderCard.tsx` импорт `@/entities/customer`, добавьте
   проп-слот `customerSlot?: ReactNode` и отрендерите его вместо
   `CustomerBadge`.
4. В `widgets/order-page/ui/OrderPage.tsx` импортируйте `OrderCard` и `Order`
   из `@/entities/order`, `CustomerBadge` и `Customer` из `@/entities/customer`
   и соберите их вместе: `<OrderCard order={order} customerSlot={<CustomerBadge customer={customer} />} />`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `Customer` хранит `lastOrderId: string`, а не объект `Order`
- [ ] `Order` хранит `customerId: string`, а не объект `Customer`
- [ ] `OrderCard.tsx` не импортирует `entities/customer`, использует
      `customerSlot`
- [ ] `OrderPage.tsx` собирает `OrderCard` и `CustomerBadge` через публичные
      API обеих сущностей
- [ ] Пройти квиз уровня ≥ 80%
