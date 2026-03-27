# Задание 8.4: Финальный проект — форма регистрации

## Цель

Объединить все изученные техники Yup в комплексной форме регистрации: примитивы, объекты, массивы, when, test, transform, ref, InferType.

## Требования

1. Создайте `registrationFormSchema` — комплексную схему:

   **Персональные данные:**
   - `firstName`: transform(trim), required, min(2)
   - `lastName`: transform(trim), required, min(2)
   - `email`: transform(trim + toLowerCase), email, required
   - `password`: required, min(8), `.test('strong', ...)` — заглавная, строчная, цифра
   - `confirmPassword`: required, `oneOf([yup.ref('password')])`

   **Тип аккаунта (when):**
   - `accountType`: `oneOf(['personal', 'business'] as const)`, required
   - `companyName`: when accountType is 'business' → required, otherwise optional

   **Адрес (вложенный объект):**
   - `address.street`: required
   - `address.city`: required
   - `address.country`: required
   - `address.zipCode`: when country is 'US' → required, matches `/^\d{5}$/`; otherwise optional

   **Предпочтения:**
   - `newsletter`: boolean, default(false)
   - `interests`: array of strings, when newsletter is true → min(1)
   - `acceptTerms`: `oneOf([true], 'You must accept the terms')`

2. Выведите тип: `type RegistrationForm = InferType<typeof registrationFormSchema>`

3. Используйте `abortEarly: false`

## Чеклист

- [ ] transform(trim) на firstName, lastName, email
- [ ] password.test() для проверки сложности
- [ ] confirmPassword ссылается на password через ref
- [ ] companyName условно required через when('accountType')
- [ ] zipCode условно required и matches для US
- [ ] interests.min(1) когда newsletter = true
- [ ] acceptTerms = oneOf([true])
- [ ] InferType для типобезопасности

## Как проверить себя

1. Заполните все поля корректно — успех
2. Пустая форма — множество ошибок
3. accountType = "business", companyName пуст — ошибка
4. country = "US", zip "abc" — ошибка (5 цифр)
5. newsletter = true, interests пуст — ошибка "Select at least 1"
6. acceptTerms = false — ошибка
7. Пароли не совпадают — ошибка "Passwords must match"
8. Email "  USER@TEST.COM  " → трансформируется в "user@test.com"
