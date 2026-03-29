# Задание 12.3: Curried Generics

## Цель

Реализовать каррированные конструкторы типов и паттерны частичного применения generics в TypeScript через вложенные функции и builder-паттерн.

## Требования

1. Реализуйте `mapOf<K>()` -- каррированный конструктор Map, который фиксирует тип ключа, а тип значения выводится позже
2. Реализуйте `TypedBuilder` -- builder с прогрессивным наращиванием типа через метод `field(key, value)`
3. Реализуйте `validatorFor<T>()` -- каррированный валидатор, который сначала фиксирует тип объекта, затем позволяет создавать проверки для конкретных полей
4. Реализуйте `typedEmitter<Events>()` -- каррированный event emitter с типобезопасными `on` и `emit`
5. Покажите, что каждый паттерн обеспечивает автодополнение и type safety

## Чеклист

- [ ] `mapOf<string>()([["a", 1]])` создаёт `Map<string, number>`
- [ ] `builder().field("host", "localhost").field("port", 3000).build()` -- тип содержит оба поля
- [ ] `validatorFor<User>().field("name").check(n => n.length > 0)` -- type-safe
- [ ] `typedEmitter<AppEvents>().on("login", p => p.userId)` -- автодополнение payload
- [ ] `typedEmitter<AppEvents>().emit("login", { wrong: true })` -- ошибка компиляции
- [ ] Каждый пример демонстрируется в runtime

## Как проверить себя

1. В builder: проверьте, что после `field("host", "localhost")` нельзя обратиться к `config.port`
2. В emitter: попробуйте `emit("login", { reason: "x" })` -- должна быть ошибка
3. В validator: попробуйте `validatorFor<User>().field("nonexistent")` -- должна быть ошибка
