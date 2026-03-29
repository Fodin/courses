# Задание 7.2: Strict Function Types

## Цель

Изучить разницу между method и property синтаксисом в контексте вариантности, понять бивариантность методов, и научиться проектировать variance-safe API.

## Требования

1. Покажите разницу между method syntax (`add(item: Dog): void`) и property syntax (`add: (item: Dog) => void`) в контексте вариантности
2. Объясните, зачем бивариантность методов нужна для DOM совместимости
3. Создайте `ReadonlyRepo<T>` (ковариантный) и `WriteRepo<T>` (контравариантный) и покажите безопасные присваивания
4. Продемонстрируйте контравариантность callback-ов на типе `Callback<T>`
5. Покажите опасность бивариантности через пример event emitter-а
6. Используйте explicit variance annotations (`in`, `out`) из TypeScript 4.7+
7. Реализуйте паттерн разделения `ReadableStream<out T>` / `WritableStream<in T>` / `DuplexStream<T>`
8. Покажите вариантность `Mapper<A, B>` (контравариантен в A, ковариантен в B)

## Чеклист

- [ ] Разница method vs property syntax продемонстрирована
- [ ] DOM совместимость через бивариантность объяснена
- [ ] Read/Write интерфейсы разделены с корректной вариантностью
- [ ] Callback контравариантность показана на примере
- [ ] Explicit variance annotations (`in`/`out`) использованы
- [ ] Паттерн ReadableStream/WritableStream реализован
- [ ] Вариантность Mapper в двух позициях показана

## Как проверить себя

1. Нажмите кнопку «Запустить»
2. Убедитесь, что `ReadonlyRepo<Dog>` присваивается к `ReadonlyRepo<Animal>`
3. Проверьте, что `Callback<Animal>` присваивается к `Callback<Dog>`
4. Убедитесь, что `Mapper<Animal, string>` можно использовать с `Array<Dog>.map`
