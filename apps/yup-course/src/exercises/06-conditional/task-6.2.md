# Задание 6.2: when() — is/then/otherwise

## Цель

Освоить полный синтаксис `when()` с `is` как функцией и разными ветками `then/otherwise` для разных способов оплаты.

## Требования

1. Создайте `paymentSchema` — объектную схему:
   - `paymentMethod` — string, oneOf(['card', 'bank', 'cash']), required
   - `cardNumber` — string, **required + 16 цифр** если method = 'card', иначе optional
   - `bankAccount` — string, **required + min(10)** если method = 'bank', иначе optional

2. Для `cardNumber` используйте `is: 'card'` и `matches(/^\d{16}$/)` в `then`

3. Для `bankAccount` используйте `is: 'bank'` и `min(10)` в `then`

4. При cash — никакие дополнительные поля не нужны

## Чеклист

- [ ] `paymentMethod` с `oneOf(['card', 'bank', 'cash'])`
- [ ] `cardNumber` с `when('paymentMethod', { is: 'card', then: ..., otherwise: ... })`
- [ ] `bankAccount` с `when('paymentMethod', { is: 'bank', then: ..., otherwise: ... })`
- [ ] Card number валидируется regex на 16 цифр
- [ ] Bank account требует минимум 10 символов

## Как проверить себя

1. method = "card" + cardNumber = "1234567890123456" — успех
2. method = "card" + cardNumber = "1234" — ошибка "16 digits"
3. method = "card" + cardNumber пусто — ошибка "required"
4. method = "bank" + bankAccount = "1234567890" — успех
5. method = "bank" + bankAccount = "123" — ошибка "min 10"
6. method = "cash" — успех без дополнительных полей
