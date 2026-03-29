# Задание 11.4: Opaque Types

## Цель

Реализовать систему opaque (branded/nominal) типов для доменного моделирования, предотвращающую случайное смешивание структурно идентичных типов.

## Требования

1. Реализуйте `Brand<T, B>` через intersection с branded символом
2. Создайте доменные типы: `UserId`, `PostId`, `Email`, `Money`, `Percentage`
3. Реализуйте smart constructors с валидацией для каждого branded типа
4. Реализуйте типобезопасные функции: `getUserById(id: UserId)`, `sendEmail(to: Email)`, `applyDiscount(price: Money, discount: Percentage)`
5. Продемонстрируйте, что branded типы запрещают перемешивание на этапе компиляции
6. Покажите ошибки валидации при невалидных данных

## Чеклист

- [ ] `Brand<number, "UserId">` создаёт номинальный тип
- [ ] `getUserById(postId)` -- ошибка компиляции (PostId !== UserId)
- [ ] `getUserById(42)` -- ошибка компиляции (number !== UserId)
- [ ] `sendEmail("not-email")` -- ошибка компиляции (string !== Email)
- [ ] `applyDiscount(price, price)` -- ошибка компиляции (Money !== Percentage)
- [ ] Smart constructors валидируют данные и выбрасывают ошибки
- [ ] `createEmail("invalid")` выбрасывает Error

## Как проверить себя

1. Попробуйте присвоить обычный `number` переменной типа `UserId` -- должна быть ошибка
2. Попробуйте передать `UserId` вместо `PostId` -- должна быть ошибка
3. Убедитесь, что branded типы работают с арифметикой: `(price as number) + 1`
