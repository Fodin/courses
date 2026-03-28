# Task 2.1: email and url

## Objective

Create schemas for validating email addresses and URLs using Yup's built-in methods.

## Requirements

1. Create `emailSchema` — `yup.string().required().email()` with custom messages

2. Create `urlSchema` — `yup.string().required().url()` with custom messages

3. Create a separate input field and "Validate" button for each schema

4. On successful validation, display the result in a green block

5. On error, display the message in a red block

## Checklist

- [ ] `emailSchema` is created with `email()` and a custom message
- [ ] `urlSchema` is created with `url()` and a custom message
- [ ] Each schema is validated independently
- [ ] Results are displayed in colored blocks

## How to verify

1. Email: "user@example.com" — success
2. Email: "bad-email" — error "Invalid email format"
3. Email: empty — error "required"
4. URL: "https://google.com" — success
5. URL: "google.com" — error (no protocol)
6. URL: "not a url" — error
