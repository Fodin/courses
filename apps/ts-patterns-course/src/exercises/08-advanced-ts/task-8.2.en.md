# Task 8.2: Phantom Types

## Objective

Implement a string data processing system with phantom type markers (`Validated`, `Sanitized`, `Encrypted`) that guarantee at the type level that data has gone through all required processing stages.

## Requirements

1. Define phantom markers with `unique symbol`:
   - `Validated` — data has been validated
   - `Sanitized` — data has been cleaned of dangerous content
   - `Encrypted` — data has been encrypted
2. Create a branded type `Branded<T, Brand> = T & { readonly __brand: Brand }`
3. Define types:
   - `RawString = string`
   - `ValidatedString = Branded<string, Validated>`
   - `SanitizedString = Branded<string, Sanitized>`
   - `ValidatedAndSanitized = Branded<string, Validated & Sanitized>`
   - `EncryptedString = Branded<string, Encrypted>`
4. Implement pipeline functions:
   - `validate(input: RawString): ValidatedString | null` — checks for non-emptiness and length
   - `sanitize(input: ValidatedString): ValidatedAndSanitized` — removes HTML tags
   - `encrypt(input: ValidatedAndSanitized): EncryptedString` — encodes to base64
   - `storeInDatabase(data: EncryptedString): string` — accepts only encrypted data
5. Implement `processUserInput(raw: RawString): string` — the full pipeline
6. Demonstrate the behavior with different inputs

## Checklist

- [ ] Phantom markers use `unique symbol` (not plain strings)
- [ ] `sanitize` accepts **only** `ValidatedString`, not an arbitrary `string`
- [ ] `encrypt` accepts **only** `ValidatedAndSanitized`
- [ ] `storeInDatabase` accepts **only** `EncryptedString`
- [ ] `as` is used only inside constructor functions (validate, sanitize, encrypt)
- [ ] The data processing pipeline works from raw to encrypted

## How to Verify

1. Click the run button — all three cases (valid, with HTML, empty) are handled
2. Try passing a plain `string` to `sanitize()` — there should be a compile error
3. Try passing `ValidatedString` to `storeInDatabase()` — there should be a compile error
