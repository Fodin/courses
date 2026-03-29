# Задание 10.4: Type-Level Pattern Matching

## Цель

Построить механизм паттерн-матчинга, работающий на уровне типов TypeScript: извлечение структуры из строк, обобщённый Match с wildcard, и exhaustive matching.

## Требования

1. Реализуйте `ExtractRoute<S>` -- извлекает resource, id и action из URL-паттерна `/resource/id/action`
2. Реализуйте вспомогательные типы `_` (wildcard) и `PatternCase<P, R>`
3. Реализуйте `Match<Value, Cases>` -- находит первый подходящий паттерн и возвращает результат
4. Покажите exhaustive matching через discriminated union и conditional types (на примере фигур)
5. Реализуйте runtime-аналоги для каждого type-level паттерна
6. Wildcard-паттерн `_` должен матчить любое значение

## Чеклист

- [ ] `ExtractRoute<"/users/123/edit">` = `{ resource: "users"; id: "123"; action: "edit" }`
- [ ] `ExtractRoute<"/posts/456">` = `{ resource: "posts"; id: "456" }`
- [ ] `ExtractRoute<"/dashboard">` = `{ resource: "dashboard" }`
- [ ] `Match<200, [PatternCase<200, "OK">, ...]>` = `"OK"`
- [ ] `Match<999, [..., PatternCase<_, "Unknown">]>` = `"Unknown"` (wildcard)
- [ ] Exhaustive matching по Shape (`circle | rect | triangle`) покрывает все варианты
- [ ] Runtime-функции дают те же результаты

## Как проверить себя

1. Проверьте, что wildcard-паттерн работает только последним (если первым -- перекрывает остальные)
2. Убедитесь, что `Match` с пустым списком Cases возвращает `never`
3. Проверьте, что `ExtractRoute` корректно обрабатывает пути без `id` и `action`
