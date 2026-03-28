# Task 6.3: when() — multiple fields

## Objective

Learn to create conditions that depend on **multiple fields simultaneously**, using an array of dependencies and the functional `when()` syntax.

## Requirements

1. Create `shippingSchema` — an object schema:
   - `country` — string, required (values: 'US', 'UK', 'DE')
   - `deliveryType` — string, oneOf(['pickup', 'courier', 'post']), required
   - `address` — string, depends on `country` and `deliveryType`:
     - courier → always required
     - post + US → required
     - everything else → optional
   - `zipCode` — string, depends on `country` and `deliveryType`:
     - pickup → optional
     - US → required, matches `/^\d{5}$/`
     - UK → required, matches `/^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i`
     - everything else → optional

2. Use the functional syntax: `.when(['field1', 'field2'], ([val1, val2], schema) => ...)`

3. Don't forget to destructure the array in the parameters!

## Checklist

- [ ] `address` depends on `['country', 'deliveryType']`
- [ ] `zipCode` depends on `['country', 'deliveryType']`
- [ ] Functional syntax with destructuring `([country, delivery], schema)`
- [ ] US zip: 5 digits
- [ ] UK post code: format like "SW1A 1AA"
- [ ] Pickup does not require address or zipCode

## How to verify

1. US + courier + address + zip "12345" — success
2. US + courier + no address — error
3. US + post + no address — error
4. UK + courier + zip "SW1A 1AA" — success
5. UK + courier + zip "12345" — format error
6. DE + pickup — success without address and zip
