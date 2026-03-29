# Задание 1.2: Distributive Conditionals

## Цель

Понять механизм дистрибутивности условных типов над union-типами и научиться контролировать это поведение.

## Требования

1. Реализуйте дистрибутивный тип `ToArray<T>`, создающий `T[]` для каждого члена union отдельно. Покажите, что `ToArray<string | number>` даёт `string[] | number[]`
2. Реализуйте недистрибутивный тип `ToArrayNonDist<T>`, который для `string | number` создаёт `(string | number)[]`
3. Реализуйте свои версии `MyExtract<T, U>` и `MyExclude<T, U>`, использующие дистрибутивность
4. Реализуйте `IsNever<T>` с правильной обработкой типа `never` (через обёртку в tuple)
5. Реализуйте `FilterByProperty<T, K>`, фильтрующий union по наличию определённого свойства

## Чеклист

- [ ] `ToArray<string | number>` разрешается в `string[] | number[]`
- [ ] `ToArrayNonDist<string | number>` разрешается в `(string | number)[]`
- [ ] `MyExtract<string | number | boolean, string | number>` разрешается в `string | number`
- [ ] `MyExclude<string | number | boolean, boolean>` разрешается в `string | number`
- [ ] `IsNever<never>` разрешается в `true`, а не в `never`
- [ ] `FilterByProperty` корректно фильтрует union-тип по наличию свойства

## Как проверить себя

1. Сравните результаты `ToArray` и `ToArrayNonDist` для одинакового union-типа
2. Проверьте `IsNever<never>` и `IsNever<string>` — должны быть `true` и `false`
3. Реализуйте runtime-эквиваленты Extract и Exclude через filter
