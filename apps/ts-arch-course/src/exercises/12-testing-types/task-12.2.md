# Задание 12.2: Type-Safe Fixtures

## Цель

Построить фабрику фикстур с типизированными частичными переопределениями, deep merge для вложенных объектов, автоинкрементом и поддержкой связей между сущностями.

## Требования

1. Создайте тип `DeepPartial<T>`, рекурсивно делающий все поля опциональными
2. Реализуйте `FixtureFactory<T>` с методами: `build(overrides?)`, `buildMany(count, overrides?)`, `buildWith(key, value)`, `reset()`
3. Реализуйте `createFixtureFactory(defaults, sequenceKey?)` с deep merge и автоинкрементом
4. Создайте фабрики для `User`, `Post`, `Comment` с разными полями
5. Продемонстрируйте: создание с defaults, частичные overrides (включая вложенные), `buildMany`, связи между сущностями

## Чеклист

- [ ] `DeepPartial` работает для вложенных объектов (settings.theme без settings.notifications)
- [ ] `build()` без аргументов возвращает объект с defaults
- [ ] `build({ role: 'admin' })` переопределяет только role
- [ ] Deep merge: `build({ settings: { theme: 'dark' } })` сохраняет notifications
- [ ] `buildMany(3)` создаёт 3 объекта с уникальными id
- [ ] `buildWith('status', 'published')` -- типобезопасный shortcut
- [ ] Связи: post.authorId === user.id

## Как проверить себя

1. Создайте user с defaults, затем с частичным override -- проверьте deep merge
2. Вызовите `buildMany(3)` -- id должны быть уникальными
3. Создайте связанные данные: user -> post -> comments
4. Сбросьте фабрику через `reset()` -- счётчик id начнётся заново
