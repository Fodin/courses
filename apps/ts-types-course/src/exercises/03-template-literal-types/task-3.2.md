# Задание 3.2: String Manipulation Types

## Цель

Освоить встроенные string manipulation types (Uppercase, Lowercase, Capitalize, Uncapitalize) и создать кастомные трансформации строковых типов: CamelCase, KebabCase, Replace, ReplaceAll.

## Требования

1. Продемонстрируйте все 4 встроенных типа: Uppercase, Lowercase, Capitalize, Uncapitalize с примерами
2. Реализуйте тип `CamelCase<S>` для преобразования kebab-case в camelCase. Создайте runtime-функцию `toCamelCase`
3. Реализуйте runtime-функцию `toKebabCase` для обратного преобразования (camelCase -> kebab-case)
4. Реализуйте runtime-функцию `toSnakeCase` для преобразования camelCase в snake_case
5. Покажите практическое применение: маппинг CSS-свойств (kebab) в JS-свойства (camel)
6. Реализуйте типы `Replace<S, From, To>` и `ReplaceAll<S, From, To>` для замены подстрок

## Чеклист

- [ ] Все 4 встроенных типа продемонстрированы с compile-time результатами
- [ ] `CamelCase<'background-color'>` разрешается в `'backgroundColor'`
- [ ] `CamelCase<'border-top-width'>` обрабатывает 3+ сегмента
- [ ] Runtime-функции корректно трансформируют строки
- [ ] CSS-to-JS маппинг работает для реальных CSS-свойств
- [ ] `Replace` заменяет первое вхождение, `ReplaceAll` -- все

## Как проверить себя

1. Проверьте CamelCase для строк с 1, 2 и 3+ сегментами
2. Сравните compile-time тип CamelCase с результатом runtime toCamelCase
3. Убедитесь, что ReplaceAll действительно заменяет все вхождения
