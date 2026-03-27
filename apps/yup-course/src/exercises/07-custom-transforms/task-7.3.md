# Задание 7.3: addMethod()

## Цель

Научиться расширять Yup кастомными методами через `addMethod()` для переиспользования валидационной логики.

## Требования

1. Создайте кастомный метод `phone()` для `StringSchema`:
   - Transform: удалить все нецифровые символы
   - Test: 10-11 цифр
   - Принимает опциональный параметр `message`

2. Создайте кастомный метод `noSpaces()` для `StringSchema`:
   - Test: строка не содержит пробелов
   - Принимает опциональный параметр `message`

3. Используйте `declare module 'yup'` для расширения TypeScript-интерфейса

4. Создайте `userSchema` с использованием кастомных методов:
   - `username`: required() + noSpaces() + min(3) + max(20)
   - `phone`: required() + phone()

## Чеклист

- [ ] `declare module 'yup'` расширяет `StringSchema`
- [ ] `addMethod(yup.string, 'phone', ...)` с transform + test
- [ ] `addMethod(yup.string, 'noSpaces', ...)` с test
- [ ] Оба метода принимают опциональный message
- [ ] `userSchema` использует `.phone()` и `.noSpaces()` как встроенные методы

## Как проверить себя

1. username="johndoe", phone="+7 999 123 45 67" — успех
2. username="john doe" — ошибка "no spaces"
3. username="ab" — ошибка "min 3"
4. phone="123" — ошибка "invalid phone" (менее 10 цифр)
5. phone="+7 (999) 123-45-67" — успех (трансформируется в 79991234567)
