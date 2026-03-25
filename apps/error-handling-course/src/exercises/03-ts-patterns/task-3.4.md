# Задание 3.4: Exhaustive handling

## Цель
Использовать тип `never` для гарантии обработки всех вариантов union type.

## Требования
1. Создайте функцию `assertNever(value: never): never`
2. Определите тип `Shape` с вариантами: `circle`, `rectangle`, `triangle`
3. Реализуйте `calculateArea(shape)`, возвращающую `Result<number, string>`
4. Используйте `assertNever` в default ветке switch
5. Покажите, что при добавлении нового варианта TypeScript покажет ошибку

## Чеклист
- [ ] `assertNever` реализован
- [ ] `Shape` union с 3 вариантами
- [ ] `calculateArea` обрабатывает все варианты + валидацию
- [ ] `assertNever` используется в default
- [ ] Результаты вычислений на странице
