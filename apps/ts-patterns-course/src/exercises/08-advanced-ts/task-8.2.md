# Задание 8.2: Phantom Types (Фантомные типы)

## Цель

Реализовать систему обработки строковых данных с фантомными типами-маркерами (`Validated`, `Sanitized`, `Encrypted`), которые гарантируют на уровне типов, что данные прошли все необходимые этапы обработки.

## Требования

1. Определите фантомные маркеры с `unique symbol`:
   - `Validated` — данные прошли валидацию
   - `Sanitized` — данные очищены от опасного содержимого
   - `Encrypted` — данные зашифрованы
2. Создайте branded type `Branded<T, Brand> = T & { readonly __brand: Brand }`
3. Определите типы:
   - `RawString = string`
   - `ValidatedString = Branded<string, Validated>`
   - `SanitizedString = Branded<string, Sanitized>`
   - `ValidatedAndSanitized = Branded<string, Validated & Sanitized>`
   - `EncryptedString = Branded<string, Encrypted>`
4. Реализуйте функции пайплайна:
   - `validate(input: RawString): ValidatedString | null` — проверяет непустоту и длину
   - `sanitize(input: ValidatedString): ValidatedAndSanitized` — удаляет HTML-теги
   - `encrypt(input: ValidatedAndSanitized): EncryptedString` — кодирует в base64
   - `storeInDatabase(data: EncryptedString): string` — принимает только зашифрованные данные
5. Реализуйте `processUserInput(raw: RawString): string` — полный пайплайн
6. Продемонстрируйте работу с разными входными данными

## Чеклист

- [ ] Фантомные маркеры используют `unique symbol` (не просто строки)
- [ ] `sanitize` принимает **только** `ValidatedString`, а не произвольный `string`
- [ ] `encrypt` принимает **только** `ValidatedAndSanitized`
- [ ] `storeInDatabase` принимает **только** `EncryptedString`
- [ ] `as` используется только внутри функций-конструкторов (validate, sanitize, encrypt)
- [ ] Пайплайн обработки данных работает от raw до encrypted

## Как проверить себя

1. Нажмите кнопку запуска — все три кейса (валидный, с HTML, пустой) обработаны
2. Попробуйте передать обычный `string` в `sanitize()` — должна быть ошибка компиляции
3. Попробуйте передать `ValidatedString` в `storeInDatabase()` — должна быть ошибка
