# Задание 8.1: ref() и context — кросс-валидация полей

## Цель

Научиться использовать `yup.ref()` для ссылок между полями и `context` (`$`) для передачи внешних параметров в валидацию.

## Требования

1. Создайте `passwordFormSchema` — объектную схему с тремя группами полей:

   **Пароль (ref между полями):**
   - `password`: required, min(8)
   - `confirmPassword`: required, `.oneOf([yup.ref('password')], 'Passwords must match')`

   **Диапазон цен (ref с moreThan):**
   - `minPrice`: required, min(0)
   - `maxPrice`: required, `.moreThan(yup.ref('minPrice'), 'Max must be greater than min')`

   **Скидка (context):**
   - `discount`: required, min(0), `.max(yup.ref('$maxDiscount'), 'Discount exceeds maximum allowed: ${max}%')`

2. При валидации передавайте контекст через опции:
   ```ts
   schema.validate(data, {
     abortEarly: false,
     context: { maxDiscount: Number(maxDiscount) },
   })
   ```

3. Используйте `abortEarly: false` для показа всех ошибок

## Чеклист

- [ ] `confirmPassword` использует `yup.ref('password')` внутри `oneOf()`
- [ ] `maxPrice` использует `yup.ref('minPrice')` внутри `moreThan()`
- [ ] `discount` использует `yup.ref('$maxDiscount')` (с `$`) внутри `max()`
- [ ] Контекст передаётся через `{ context: { maxDiscount } }`
- [ ] `abortEarly: false` включён

## Как проверить себя

1. Password "MyPass123", confirm "MyPass123" — успех
2. Password "MyPass123", confirm "other" — ошибка "Passwords must match"
3. minPrice 10, maxPrice 100 — успех
4. minPrice 100, maxPrice 50 — ошибка "Max must be greater than min"
5. maxDiscount 20, discount 15 — успех
6. maxDiscount 20, discount 25 — ошибка про превышение
7. Все поля пустые — все ошибки одновременно
