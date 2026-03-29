# Задание 6.3: Generic Narrowing

## Цель

Научиться создавать generic type guards, которые работают с произвольными типами: проверка свойств, валидация массивов, guard factories.

## Требования

1. Создайте generic guard `hasProperty<K>(obj: unknown, key: K): obj is Record<K, unknown>` для проверки наличия свойства
2. Создайте `hasTypedProperty<K, V>(obj, key, guard): obj is Record<K, V>` для проверки свойства с определённым типом
3. Создайте `isArrayOf<T>(value, guard): value is T[]` — guard для массивов с проверкой каждого элемента
4. Реализуйте guard factory: `createGuard<T>(check): (value: unknown) => value is T`
5. Создайте generic guard для discriminated union: `isSuccess<T>(result: ApiResult<T>)` с `Extract`
6. Продемонстрируйте комбинацию generic guards для валидации вложенных структур

## Чеклист

- [ ] `hasProperty` корректно проверяет наличие свойства и сужает тип
- [ ] `hasTypedProperty` принимает guard-функцию для проверки типа значения
- [ ] `isArrayOf` проверяет каждый элемент массива через переданный guard
- [ ] `createGuard` создаёт типизированный guard из обычной функции-проверки
- [ ] Generic guard для union работает с `Extract`
- [ ] Результаты отображаются на странице

## Как проверить себя

1. Нажмите кнопку «Запустить»
2. Убедитесь, что `hasProperty(data, 'name')` позволяет обратиться к `data.name`
3. Убедитесь, что `isArrayOf([1,2,3], isNumber)` возвращает `true`, а `isArrayOf([1,"two",3], isNumber)` — `false`
4. Проверьте, что `createGuard<Product>(...)` создаёт guard с полной типизацией
