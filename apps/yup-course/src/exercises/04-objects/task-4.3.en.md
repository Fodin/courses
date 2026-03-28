# Task 4.3: pick, omit, partial

## Objective

Learn to create derived schemas from a base schema using `pick()`, `omit()`, and `partial()`.

## Requirements

1. Create `fullPersonSchema` with fields: name, age, email, phone (all required)

2. Create `publicSchema` via `pick(['name', 'email'])`

3. Create `withoutPhoneSchema` via `omit(['phone'])`

4. Create `partialSchema` via `partial()`

5. Implement schema selection via a `<select>` element and validate the same JSON data

## Checklist

- [ ] Base schema `fullPersonSchema` with 4 required fields
- [ ] `publicSchema` contains only name and email
- [ ] `withoutPhoneSchema` contains everything except phone
- [ ] `partialSchema` makes all fields optional
- [ ] Switching the schema and re-validating the same data works correctly

## How to verify

1. Full schema + `{"name": "Alice"}` — errors (age, email, phone missing)
2. pick schema + `{"name": "Alice", "email": "a@b.com"}` — success
3. omit schema + `{"name": "Alice", "age": 25, "email": "a@b.com"}` — success (phone not needed)
4. partial schema + `{}` — success (everything optional)
5. partial schema + `{"email": "bad"}` — error (invalid email format, even though optional)
