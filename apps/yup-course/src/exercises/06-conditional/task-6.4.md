# Задание 6.4: when() — вложенные условия

## Цель

Научиться комбинировать несколько `when()` на одном поле и создавать сложные многоуровневые условия валидации.

## Требования

1. Создайте `registrationSchema` — объектную схему:
   - `accountType` — oneOf(['personal', 'business']), required
   - `country` — string, required
   - `age` — number, required + min(13) **только для personal**
   - `companyName` — string, required **только для business**
   - `taxId` — string:
     - required для business
     - Для business + US: matches `/^\d{2}-\d{7}$/` (EIN формат)
     - Для business + DE: matches `/^DE\d{9}$/` (German VAT)
   - `parentConsent` — boolean:
     - Для personal + age < 18: must be `true`

2. `taxId` должен использовать **два** `.when()`:
   - Первый: required для business
   - Второй: format check по стране

3. `parentConsent` использует `.when(['accountType', 'age'], ...)`

## Чеклист

- [ ] `age` required только для personal, min(13)
- [ ] `companyName` required только для business
- [ ] `taxId` имеет **два** `.when()` — required + format
- [ ] US EIN формат: XX-XXXXXXX
- [ ] DE VAT формат: DEXXXXXXXXX
- [ ] `parentConsent` = true обязателен для personal + age < 18
- [ ] Business + age не валидируется

## Как проверить себя

1. personal + age=25 — успех
2. personal + age=15 + parentConsent=false — ошибка "Parent consent required"
3. personal + age=15 + parentConsent=true — успех
4. personal + age=10 — ошибка "Must be at least 13"
5. business + US + companyName + taxId="12-3456789" — успех
6. business + US + taxId="123456" — ошибка формата EIN
7. business + DE + taxId="DE123456789" — успех
