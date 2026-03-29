# Task 12.2: Input Sanitization

## 🎯 Goal

Master injection prevention: SQL injection via parameterized queries, NoSQL injection via express-mongo-sanitize, XSS via escaping and DOMPurify.

## Requirements

1. Show SQL injection attack and defense via parameterized queries ($1, $2)
2. Show NoSQL injection attack ({ $gt: "" }) and defense via express-mongo-sanitize
3. Implement XSS protection: xss() for escaping, DOMPurify for HTML content
4. Show Zod validation as universal injection defense
5. Demonstrate transform in Zod schema for validation-level sanitization

## Checklist

- [ ] SQL injection shown and prevented with parameterization
- [ ] NoSQL injection shown and prevented with express-mongo-sanitize
- [ ] XSS escaped via xss() and DOMPurify
- [ ] Zod validates and transforms input data
- [ ] All approaches demonstrated with attack and defense

## How to Verify

Click "Run" and verify that: injections shown as attacks, each type has specific defense, Zod validates input.
