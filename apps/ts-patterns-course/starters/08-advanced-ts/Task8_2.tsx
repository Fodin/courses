import { useState } from 'react'

// ============================================
// Задание 8.2: Phantom Types (Фантомные типы)
// ============================================

// TODO: Declare phantom markers using unique symbol:
//   declare const ValidatedBrand: unique symbol
//   declare const SanitizedBrand: unique symbol
//   declare const EncryptedBrand: unique symbol
//
//   interface Validated { readonly [ValidatedBrand]: true }
//   interface Sanitized { readonly [SanitizedBrand]: true }
//   interface Encrypted { readonly [EncryptedBrand]: true }

// TODO: Define branded type:
//   type Branded<T, Brand> = T & { readonly __brand: Brand }

// TODO: Define string types with phantom brands:
//   type RawString = string
//   type ValidatedString = Branded<string, Validated>
//   type SanitizedString = Branded<string, Sanitized>
//   type ValidatedAndSanitized = Branded<string, Validated & Sanitized>
//   type EncryptedString = Branded<string, Encrypted>

// TODO: Implement validate(input: RawString): ValidatedString | null
//   - Return null if empty or longer than 255 chars
//   - Return input as ValidatedString otherwise
//   NOTE: `as` is only allowed in these boundary functions

// TODO: Implement sanitize(input: ValidatedString): ValidatedAndSanitized
//   - Remove HTML tags: input.replace(/<[^>]*>/g, '').replace(/[&<>"']/g, '')
//   - Return result as ValidatedAndSanitized

// TODO: Implement encrypt(input: ValidatedAndSanitized): EncryptedString
//   - Use btoa(input) for demo "encryption"
//   - Return result as EncryptedString

// TODO: Implement storeInDatabase(data: EncryptedString): string
//   - Return `Stored encrypted data: ${data.slice(0, 10)}...`
//   - Note: accepts ONLY EncryptedString, not plain string

// TODO: Implement processUserInput(raw: RawString): string
//   - Full pipeline: validate → sanitize → encrypt → store
//   - Return error message if validation fails

export function Task8_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Phantom Types (Branded Types) ---')
    log.push('')

    // TODO: Test with valid input 'Hello, World!'
    //   log input and processUserInput result

    // TODO: Test with HTML input 'Hello <script>alert("xss")</script> World'
    //   Show each step: validate → sanitize → encrypt → store

    // TODO: Test with empty input ''
    //   Show that validation fails

    // TODO: Add comments showing the type-safe pipeline:
    //   RawString → validate → ValidatedString
    //   ValidatedString → sanitize → ValidatedAndSanitized
    //   ValidatedAndSanitized → encrypt → EncryptedString
    //   EncryptedString → storeInDatabase

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: Phantom Types</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
