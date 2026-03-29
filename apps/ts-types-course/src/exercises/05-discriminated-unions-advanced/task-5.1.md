# Задание 5.1: Exhaustive Switches

## Цель

Освоить паттерн exhaustive checking через `never` для гарантии обработки всех вариантов размеченного объединения.

## Требования

1. Создайте функцию `assertNever(value: never): never`, которая выбрасывает ошибку с описанием необработанного значения
2. Создайте размеченное объединение `Shape` с тремя вариантами: `circle`, `rectangle`, `triangle`
3. Реализуйте функцию `getArea(shape: Shape): number` с `switch` и `assertNever` в `default`
4. Создайте размеченное объединение `Result` со статусами `success`, `error`, `loading` и функцию `formatResult` с exhaustive checking
5. Продемонстрируйте альтернативный подход через `Record<Shape['kind'], string>` для exhaustive mapping

## Чеклист

- [ ] `assertNever` принимает `never` и возвращает `never`
- [ ] `getArea` обрабатывает все варианты Shape с `assertNever` в default
- [ ] `formatResult` обрабатывает все статусы Result
- [ ] `Record<Shape['kind'], string>` содержит все варианты
- [ ] Результаты вычислений отображаются на странице

## Как проверить себя

1. Нажмите кнопку «Запустить»
2. Убедитесь, что площадь вычисляется для всех фигур
3. Убедитесь, что `formatResult` возвращает разные строки для разных статусов
4. Попробуйте закомментировать один `case` — должна появиться ошибка TypeScript
