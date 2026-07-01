import { useState } from 'react'

// TODO: Implement JWT Decoder / Реализуй декодер JWT
//
// Base64URL helpers / Хелперы Base64URL:
//   b64urlEncode(obj): btoa(JSON.stringify(obj)) → заменить + → -, / → _, убрать =
//   b64urlDecode(part): заменить - → +, _ → /, добить '=' до кратности 4, atob
//
// State: token (string) — default = example JWT / пример токена
//
// Logic / Логика:
//   parts = token.split('.')  → должно быть 3 части
//   header = JSON.parse(b64urlDecode(parts[0]))   (в try/catch)
//   payload = JSON.parse(b64urlDecode(parts[1]))
//   exp (секунды) сравнить с Math.floor(Date.now()/1000) → истёк / действителен
//
// UI:
//   - textarea для вставки JWT
//   - три части с цветовой подсветкой (header/payload/signature)
//   - header и payload как форматированный JSON (<pre>)
//   - статус срока действия (зелёный/красный) + остаток времени
//   - таблица claims (sub, iss, exp, iat, scope, role) с пояснениями
//   - строка Authorization: Bearer ...
//   - предупреждение: payload НЕ зашифрован, секреты не класть
//   - аккуратная ошибка при невалидном токене (не 3 части / битый Base64)

export function Task12_1() {
  const [token, setToken] = useState('')

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Декодер JWT / JWT Decoder</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Разбор Bearer-токена: три части, claims и срок жизни / Bearer token anatomy
      </p>

      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Вставьте JWT / Paste a JWT"
        style={{ width: '100%', minHeight: '70px', fontFamily: 'monospace', fontSize: '0.8rem', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
      />

      {/* TODO: цветная разбивка на 3 части / colored 3-part split */}
      {/* TODO: декодированные header и payload (JSON) / decoded header & payload */}
      {/* TODO: статус exp (действителен/истёк) + остаток / expiry status */}
      {/* TODO: таблица claims с пояснениями / claims table */}
      {/* TODO: Authorization: Bearer ... */}
      {/* TODO: предупреждение «payload не зашифрован» / warning */}
      {/* TODO: обработка невалидного токена / invalid token handling */}
    </div>
  )
}
