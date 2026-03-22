# Задание 3.2: Цепочка computed

## Цель
Построить цепочку вычисляемых значений: subtotal -> tax -> total.

## Требования

- [ ] Создайте `InvoiceStore` с массивом товаров и `taxRate`
- [ ] Добавьте computed `subtotal` — сумма без налога
- [ ] Добавьте computed `tax` — `subtotal * taxRate`
- [ ] Добавьте computed `total` — `subtotal + tax`
- [ ] Добавьте возможность менять ставку налога
- [ ] Покажите все три значения в компоненте
