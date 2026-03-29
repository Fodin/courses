# Задание 12.2: Inference Tricks

## Цель

Освоить продвинутые техники вывода типов: `const T` для сохранения литеральных типов, `NoInfer<T>` для контроля точки вывода, distributive object types и `satisfies`.

## Требования

1. Реализуйте `narrow<const T>` -- функцию, сохраняющую литеральный тип аргумента (не расширяя до string/number)
2. Покажите `NoInfer<T>` -- блокирует вывод типа из определённой позиции аргумента
3. Реализуйте `DistributiveMap<T>` -- преобразует объектный тип в дискриминированное объединение
4. Покажите `handleEvent` с автоматическим выводом типа payload из event name
5. Продемонстрируйте `satisfies` -- валидация формы без потери литеральных типов

## Чеклист

- [ ] `narrow("active")` имеет тип `"active"`, а не `string`
- [ ] `narrowArray(["a", "b"])` имеет тип `readonly ["a", "b"]`, а не `string[]`
- [ ] `NoInfer` предотвращает нежелательное объединение типов
- [ ] `DistributiveMap<EventMap>` создаёт корректный discriminated union
- [ ] `handleEvent("click", p => p.x)` -- TypeScript знает, что payload имеет `x` и `y`
- [ ] `satisfies Config` валидирует форму, но сохраняет литеральные типы значений

## Как проверить себя

1. Без `const T`: `narrow("active")` -- проверьте, что тип `string` (расширен)
2. С `const T`: `narrow("active")` -- проверьте, что тип `"active"` (литерал)
3. Попробуйте `handleEvent("click", p => p.key)` -- должна быть ошибка (у click нет key)
