# Задание 11.3: DeepPick & DeepOmit

## Цель

Реализовать рекурсивные версии `Pick` и `Omit`, которые работают с вложенными путями в формате `'user.address.city'`.

## Требования

1. Реализуйте `DeepPick<T, Paths>` -- извлекает вложенные свойства по dot-path
2. Реализуйте `UnionToIntersection<U>` -- вспомогательный тип для объединения результатов
3. Реализуйте `DeepPickMulti<T, Paths>` -- DeepPick для нескольких путей одновременно
4. Реализуйте `DeepOmit<T, Paths>` -- удаляет вложенные свойства по dot-path
5. Реализуйте `PathsOf<T>` -- генерирует все допустимые пути в объекте
6. Покажите runtime-аналоги: `deepPick(obj, path)` и `deepOmit(obj, path)`

## Чеклист

- [ ] `DeepPick<User, "address.city">` = `{ address: { city: string } }`
- [ ] `DeepPick<User, "profile.settings.theme">` работает на 3+ уровнях вложенности
- [ ] `DeepPickMulti<User, "id" | "address.city">` = пересечение результатов
- [ ] `DeepOmit<User, "profile.bio">` удаляет вложенное свойство, сохраняя остальные
- [ ] `PathsOf<User>` генерирует все корректные dot-пути
- [ ] Runtime-функции корректно работают с объектами

## Как проверить себя

1. Проверьте `DeepPick` с несуществующим путём -- должен быть `never`
2. Проверьте, что `DeepOmit` не затрагивает соседние свойства
3. Убедитесь, что `PathsOf` включает как промежуточные (`"profile"`), так и конечные (`"profile.avatar"`) пути
