# Task 8.4: Final Project — Registration Form

## Objective

Combine all the Yup techniques you have learned into a comprehensive registration form: primitives, objects, arrays, when, test, transform, ref, InferType.

## Requirements

1. Create `registrationFormSchema` — a comprehensive schema:

   **Personal data:**
   - `firstName`: transform(trim), required, min(2)
   - `lastName`: transform(trim), required, min(2)
   - `email`: transform(trim + toLowerCase), email, required
   - `password`: required, min(8), `.test('strong', ...)` — uppercase, lowercase, digit
   - `confirmPassword`: required, `oneOf([yup.ref('password')])`

   **Account type (when):**
   - `accountType`: `oneOf(['personal', 'business'] as const)`, required
   - `companyName`: when accountType is 'business' → required, otherwise optional

   **Address (nested object):**
   - `address.street`: required
   - `address.city`: required
   - `address.country`: required
   - `address.zipCode`: when country is 'US' → required, matches `/^\d{5}$/`; otherwise optional

   **Preferences:**
   - `newsletter`: boolean, default(false)
   - `interests`: array of strings, when newsletter is true → min(1)
   - `acceptTerms`: `oneOf([true], 'You must accept the terms')`

2. Infer the type: `type RegistrationForm = InferType<typeof registrationFormSchema>`

3. Use `abortEarly: false`

## Checklist

- [ ] transform(trim) on firstName, lastName, email
- [ ] password.test() for complexity check
- [ ] confirmPassword references password via ref
- [ ] companyName is conditionally required via when('accountType')
- [ ] zipCode is conditionally required and matches for US
- [ ] interests.min(1) when newsletter = true
- [ ] acceptTerms = oneOf([true])
- [ ] InferType for type safety

## How to verify

1. Fill in all fields correctly — success
2. Empty form — multiple errors
3. accountType = "business", companyName empty — error
4. country = "US", zip "abc" — error (5 digits required)
5. newsletter = true, interests empty — error "Select at least 1"
6. acceptTerms = false — error
7. Passwords do not match — error "Passwords must match"
8. Email "  USER@TEST.COM  " → transformed to "user@test.com"
