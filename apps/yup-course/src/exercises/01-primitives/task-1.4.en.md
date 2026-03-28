# Task 1.4: default and defined

## Objective

Understand how `default()` sets default values and how `defined()` forbids `undefined`.

## Requirements

1. Create 3 schemas:
   - `string().default('Guest')` — string with a default value
   - `number().default(0)` — number with a default value
   - `string().defined('Value must be defined')` — string that forbids undefined

2. For the default schemas, use `cast()` to show how the default value is substituted

3. For the defined schema, use `validate()` to show the error when given `undefined`

4. Display the result for each schema

## Checklist

- [ ] `string().default('Guest')` — casting an empty value returns "Guest"
- [ ] `number().default(0)` — casting an empty value returns 0
- [ ] `string().defined()` — validating `undefined` throws an error
- [ ] Non-empty values pass all checks

## How to verify

1. Leave the field empty:
   - `string().default('Guest')` cast — "Guest"
   - `number().default(0)` cast — 0
   - `string().defined()` validate — error

2. Enter "John":
   - `string().default('Guest')` cast — "John"
   - `number().default(0)` cast — NaN (string is not a number)
   - `string().defined()` validate — "John"
