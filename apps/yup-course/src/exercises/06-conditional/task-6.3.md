# Задание 6.3: when() — несколько полей

## Цель

Научиться создавать условия, зависящие от **нескольких полей одновременно**, используя массив зависимостей и функциональный синтаксис `when()`.

## Требования

1. Создайте `shippingSchema` — объектную схему:
   - `country` — string, required (значения: 'US', 'UK', 'DE')
   - `deliveryType` — string, oneOf(['pickup', 'courier', 'post']), required
   - `address` — string, зависит от `country` и `deliveryType`:
     - courier → required всегда
     - post + US → required
     - остальное → optional
   - `zipCode` — string, зависит от `country` и `deliveryType`:
     - pickup → optional
     - US → required, matches `/^\d{5}$/`
     - UK → required, matches `/^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i`
     - остальные → optional

2. Используйте функциональный синтаксис: `.when(['field1', 'field2'], ([val1, val2], schema) => ...)`

3. Не забудьте деструктуризацию массива в параметрах!

## Чеклист

- [ ] `address` зависит от `['country', 'deliveryType']`
- [ ] `zipCode` зависит от `['country', 'deliveryType']`
- [ ] Функциональный синтаксис с деструктуризацией `([country, delivery], schema)`
- [ ] US zip: 5 цифр
- [ ] UK post code: формат вида "SW1A 1AA"
- [ ] Pickup не требует address и zipCode

## Как проверить себя

1. US + courier + address + zip "12345" — успех
2. US + courier + без address — ошибка
3. US + post + без address — ошибка
4. UK + courier + zip "SW1A 1AA" — успех
5. UK + courier + zip "12345" — ошибка формата
6. DE + pickup — успех без address и zip
