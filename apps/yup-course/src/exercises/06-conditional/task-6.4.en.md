# Task 6.4: when() — nested conditions

## Objective

Learn to combine multiple `when()` calls on a single field and create complex multi-level validation conditions.

## Requirements

1. Create `registrationSchema` — an object schema:
   - `accountType` — oneOf(['personal', 'business']), required
   - `country` — string, required
   - `age` — number, required + min(13) **for personal only**
   - `companyName` — string, required **for business only**
   - `taxId` — string:
     - required for business
     - For business + US: matches `/^\d{2}-\d{7}$/` (EIN format)
     - For business + DE: matches `/^DE\d{9}$/` (German VAT)
   - `parentConsent` — boolean:
     - For personal + age < 18: must be `true`

2. `taxId` must use **two** `.when()` calls:
   - First: required for business
   - Second: format check by country

3. `parentConsent` uses `.when(['accountType', 'age'], ...)`

## Checklist

- [ ] `age` is required only for personal, min(13)
- [ ] `companyName` is required only for business
- [ ] `taxId` has **two** `.when()` calls — required + format
- [ ] US EIN format: XX-XXXXXXX
- [ ] DE VAT format: DEXXXXXXXXX
- [ ] `parentConsent` = true is required for personal + age < 18
- [ ] Business + age is not validated

## How to verify

1. personal + age=25 — success
2. personal + age=15 + parentConsent=false — error "Parent consent required"
3. personal + age=15 + parentConsent=true — success
4. personal + age=10 — error "Must be at least 13"
5. business + US + companyName + taxId="12-3456789" — success
6. business + US + taxId="123456" — EIN format error
7. business + DE + taxId="DE123456789" — success
