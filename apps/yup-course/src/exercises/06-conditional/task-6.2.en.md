# Task 6.2: when() — is/then/otherwise

## Objective

Master the full `when()` syntax with `is` as a function and different `then/otherwise` branches for different payment methods.

## Requirements

1. Create `paymentSchema` — an object schema:
   - `paymentMethod` — string, oneOf(['card', 'bank', 'cash']), required
   - `cardNumber` — string, **required + 16 digits** if method = 'card', otherwise optional
   - `bankAccount` — string, **required + min(10)** if method = 'bank', otherwise optional

2. For `cardNumber` use `is: 'card'` and `matches(/^\d{16}$/)` in `then`

3. For `bankAccount` use `is: 'bank'` and `min(10)` in `then`

4. For cash — no additional fields are required

## Checklist

- [ ] `paymentMethod` with `oneOf(['card', 'bank', 'cash'])`
- [ ] `cardNumber` with `when('paymentMethod', { is: 'card', then: ..., otherwise: ... })`
- [ ] `bankAccount` with `when('paymentMethod', { is: 'bank', then: ..., otherwise: ... })`
- [ ] Card number is validated with a regex for 16 digits
- [ ] Bank account requires a minimum of 10 characters

## How to verify

1. method = "card" + cardNumber = "1234567890123456" — success
2. method = "card" + cardNumber = "1234" — error "16 digits"
3. method = "card" + cardNumber empty — error "required"
4. method = "bank" + bankAccount = "1234567890" — success
5. method = "bank" + bankAccount = "123" — error "min 10"
6. method = "cash" — success without additional fields
