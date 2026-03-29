# Task 4.2: Joi Validation

## 🎯 Goal

Implement validation with Joi: custom error messages, conditional validation via `when/alternatives`, and comparison with Zod.

## Requirements

1. Define a Joi schema with custom messages: `.messages({ 'string.min': '...' })`
2. Implement password validation with pattern and custom message
3. Implement conditional validation via `Joi.when()`: different fields depending on type (card vs bank)
4. Demonstrate validation with errors showing custom messages
5. Compare Joi and Zod: pros and cons of each

## Checklist

- [ ] `.messages()` overrides default messages with custom ones
- [ ] `Joi.ref('password')` checks field matching
- [ ] `Joi.when('type', { is, then, otherwise })` implements conditional logic
- [ ] `Joi.forbidden()` prohibits fields under certain conditions
- [ ] Comparison table: Joi (conditional validation, messages) vs Zod (TypeScript, size)

## How to Verify

Click "Run" and verify that: custom messages are shown, conditional validation correctly checks card/bank fields, and the Joi vs Zod comparison is informative.
