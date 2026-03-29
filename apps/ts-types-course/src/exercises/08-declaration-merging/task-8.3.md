# Задание 8.3: Ambient Declarations

## Цель

Научиться создавать ambient declarations для описания внешнего кода, использовать namespace merging, global augmentation и triple-slash directives.

## Требования

1. Объясните концепцию ambient declarations и ключевое слово `declare`
2. Покажите `declare var/const` для глобальных переменных (`__VERSION__`, `__DEV__`, `process`)
3. Покажите `declare function` для глобальных функций (`require`, `setTimeout`)
4. Создайте namespace `MathUtils` и продемонстрируйте namespace merging (add, multiply, subtract, PI)
5. Объясните `declare global { ... }` для augmentation глобальной области видимости из модуля
6. Реализуйте Enum + Namespace merging: `Color` enum с методами `fromHex()` и `toLabel()`
7. Реализуйте Class + Namespace merging: `Validator` класс с `Options` interface и `create()` factory
8. Объясните triple-slash directives: `reference path`, `reference types`, `reference lib`

## Чеклист

- [ ] Ambient declarations и `declare` объяснены
- [ ] `declare var/const/function` примеры показаны
- [ ] Namespace merging работает с `MathUtils`
- [ ] `declare global` объяснён
- [ ] Enum + Namespace: `Color.fromHex()` и `Color.toLabel()` работают
- [ ] Class + Namespace: `Validator.create()` и `Validator.defaults` работают
- [ ] Triple-slash directives объяснены
- [ ] Результаты отображаются на странице

## Как проверить себя

1. Нажмите кнопку «Запустить»
2. Убедитесь, что `MathUtils` содержит функции из обоих namespace блоков
3. Проверьте, что `Color.fromHex('#00FF00')` возвращает `GREEN`
4. Убедитесь, что `Validator.create()` создаёт валидатор и `Validator.defaults` доступен
