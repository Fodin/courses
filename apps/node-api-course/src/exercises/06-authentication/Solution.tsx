import { useState } from 'react'

// ============================================
// Задание 6.1: Cookie Sessions — Решение
// ============================================

export function Task6_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Cookie Sessions ===')
    log.push('')

    // Session setup
    log.push('--- Настройка express-session ---')
    log.push('')
    log.push('app.use(session({')
    log.push('  secret: process.env.SESSION_SECRET,')
    log.push('  resave: false,')
    log.push('  saveUninitialized: false,')
    log.push('  cookie: {')
    log.push('    secure: true,       // Только HTTPS')
    log.push('    httpOnly: true,     // Недоступна из JS')
    log.push('    sameSite: "lax",    // Защита от CSRF')
    log.push('    maxAge: 24 * 60 * 60 * 1000  // 24 часа')
    log.push('  },')
    log.push('  store: new RedisStore({ client: redisClient })')
    log.push('}))')
    log.push('')

    // Simulate session flow
    log.push('=== Симуляция сессии ===')
    log.push('')

    const sessionId = 'sess:' + Math.random().toString(36).substring(2, 15)

    log.push('1. Login:')
    log.push('>> POST /auth/login')
    log.push('>> Body: { "email": "john@example.com", "password": "secret" }')
    log.push('')
    log.push('   Сервер: проверяет пароль -> создаёт сессию в Redis')
    log.push(`   Redis SET ${sessionId} -> { userId: 42, role: "admin" }`)
    log.push('')
    log.push('<< 200 OK')
    log.push(`<< Set-Cookie: connect.sid=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax`)
    log.push('')

    log.push('2. Authenticated Request:')
    log.push('>> GET /api/profile')
    log.push(`>> Cookie: connect.sid=${sessionId}`)
    log.push('')
    log.push(`   Сервер: Redis GET ${sessionId} -> { userId: 42, role: "admin" }`)
    log.push('   req.session.userId = 42')
    log.push('')
    log.push('<< 200 OK { id: 42, name: "John", role: "admin" }')
    log.push('')

    log.push('3. Logout:')
    log.push('>> POST /auth/logout')
    log.push(`>> Cookie: connect.sid=${sessionId}`)
    log.push('')
    log.push('   req.session.destroy() -> Redis DEL ' + sessionId)
    log.push('')
    log.push('<< 200 OK')
    log.push('<< Set-Cookie: connect.sid=; Max-Age=0')
    log.push('')

    // Session stores
    log.push('--- Session Stores ---')
    log.push('')
    log.push('  MemoryStore  — только для разработки! Утечка памяти, не масштабируется')
    log.push('  RedisStore   — быстрый, TTL из коробки, масштабируется')
    log.push('  PostgresStore — для простых проектов, данные в БД')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Cookie Sessions</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.2: JWT — Решение
// ============================================

export function Task6_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== JWT (JSON Web Token) ===')
    log.push('')

    // JWT structure
    log.push('--- Структура JWT ---')
    log.push('')
    log.push('Header.Payload.Signature')
    log.push('')

    const header = { alg: 'HS256', typ: 'JWT' }
    const payload = {
      sub: '42',
      email: 'john@example.com',
      role: 'admin',
      iat: 1710000000,
      exp: 1710003600,
    }

    log.push('Header (base64):')
    log.push(JSON.stringify(header, null, 2))
    log.push('')
    log.push('Payload (base64):')
    log.push(JSON.stringify(payload, null, 2))
    log.push('')
    log.push('Signature:')
    log.push('HMACSHA256(base64(header) + "." + base64(payload), secret)')
    log.push('')

    // Token example
    const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiIsInJvbGUiOiJhZG1pbiJ9.signature_here'
    log.push(`Токен: ${fakeToken}`)
    log.push('')

    // Auth flow
    log.push('=== Симуляция JWT-аутентификации ===')
    log.push('')

    log.push('1. Login -> получение токена:')
    log.push('>> POST /auth/login')
    log.push('>> { "email": "john@example.com", "password": "secret" }')
    log.push('')
    log.push('<< 200 OK')
    log.push('<< { "accessToken": "eyJ...", "expiresIn": 3600 }')
    log.push('')

    log.push('2. Запрос с токеном:')
    log.push('>> GET /api/profile')
    log.push('>> Authorization: Bearer eyJ...')
    log.push('')
    log.push('   Middleware: jwt.verify(token, secret)')
    log.push('   -> decoded: { sub: "42", role: "admin", exp: 1710003600 }')
    log.push('   -> req.user = { id: 42, role: "admin" }')
    log.push('')
    log.push('<< 200 OK { id: 42, name: "John" }')
    log.push('')

    log.push('3. Истекший/невалидный токен:')
    log.push('>> GET /api/profile')
    log.push('>> Authorization: Bearer expired_token')
    log.push('')
    log.push('   jwt.verify -> TokenExpiredError')
    log.push('<< 401 Unauthorized { "error": "Token expired" }')
    log.push('')

    // JWT middleware
    log.push('--- JWT Guard Middleware ---')
    log.push('')
    log.push('function authGuard(req, res, next) {')
    log.push('  const authHeader = req.headers.authorization')
    log.push('  if (!authHeader?.startsWith("Bearer ")) {')
    log.push('    return res.status(401).json({ error: "Missing token" })')
    log.push('  }')
    log.push('  try {')
    log.push('    const token = authHeader.split(" ")[1]')
    log.push('    req.user = jwt.verify(token, process.env.JWT_SECRET)')
    log.push('    next()')
    log.push('  } catch (err) {')
    log.push('    res.status(401).json({ error: "Invalid token" })')
    log.push('  }')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: JWT</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.3: Refresh Tokens — Решение
// ============================================

export function Task6_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Refresh Tokens ===')
    log.push('')

    // Token pair concept
    log.push('--- Пара токенов ---')
    log.push('')
    log.push('Access Token:')
    log.push('  - Короткоживущий (15 мин)')
    log.push('  - Содержит claims (userId, role)')
    log.push('  - Отправляется с каждым запросом')
    log.push('  - Хранится в памяти (не в localStorage!)')
    log.push('')
    log.push('Refresh Token:')
    log.push('  - Долгоживущий (7-30 дней)')
    log.push('  - Непрозрачный (opaque) — UUID или хеш')
    log.push('  - Хранится в httpOnly cookie')
    log.push('  - Используется ТОЛЬКО для обновления access token')
    log.push('')

    // Token rotation flow
    log.push('=== Симуляция Token Rotation ===')
    log.push('')

    const refreshTokenOld = 'rt_' + Math.random().toString(36).substring(2, 10)
    const refreshTokenNew = 'rt_' + Math.random().toString(36).substring(2, 10)

    log.push('1. Login:')
    log.push('<< accessToken: "eyJ..." (exp: 15 min)')
    log.push(`<< refreshToken: "${refreshTokenOld}" (httpOnly cookie, exp: 7 days)`)
    log.push(`   DB: INSERT refresh_tokens (token: hash("${refreshTokenOld}"), userId: 42, family: "f1")`)
    log.push('')

    log.push('2. Access token истёк, refresh:')
    log.push('>> POST /auth/refresh')
    log.push(`>> Cookie: refreshToken=${refreshTokenOld}`)
    log.push('')
    log.push(`   DB: SELECT ... WHERE token = hash("${refreshTokenOld}") -> found, valid`)
    log.push(`   DB: UPDATE refresh_tokens SET revoked = true WHERE token = hash("${refreshTokenOld}")`)
    log.push(`   DB: INSERT refresh_tokens (token: hash("${refreshTokenNew}"), userId: 42, family: "f1")`)
    log.push('')
    log.push('<< 200 OK')
    log.push('<< accessToken: "eyJ..." (новый)')
    log.push(`<< refreshToken: "${refreshTokenNew}" (новый — ROTATION!)`)
    log.push('')

    log.push('3. Попытка переиспользовать старый refresh token:')
    log.push('>> POST /auth/refresh')
    log.push(`>> Cookie: refreshToken=${refreshTokenOld}`)
    log.push('')
    log.push('   DB: token revoked = true -> КРАЖА ОБНАРУЖЕНА!')
    log.push('   DB: DELETE FROM refresh_tokens WHERE family = "f1"')
    log.push('   (все токены семейства отозваны)')
    log.push('')
    log.push('<< 401 Unauthorized { "error": "Token reuse detected" }')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Refresh Tokens</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.4: OAuth 2.0 — Решение
// ============================================

export function Task6_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== OAuth 2.0: Authorization Code Flow ===')
    log.push('')

    const state = Math.random().toString(36).substring(2, 10)
    const code = 'auth_code_' + Math.random().toString(36).substring(2, 8)

    // Step 1: Redirect to provider
    log.push('--- Шаг 1: Редирект на OAuth-провайдер ---')
    log.push('')
    log.push('>> GET /auth/github')
    log.push('')
    log.push('<< 302 Redirect')
    log.push('<< Location: https://github.com/login/oauth/authorize')
    log.push(`     ?client_id=YOUR_CLIENT_ID`)
    log.push(`     &redirect_uri=https://api.example.com/auth/github/callback`)
    log.push(`     &scope=user:email`)
    log.push(`     &state=${state}`)
    log.push('')
    log.push(`   state="${state}" сохранён в сессии (защита от CSRF)`)
    log.push('')

    // Step 2: Callback
    log.push('--- Шаг 2: Callback с authorization code ---')
    log.push('')
    log.push(`>> GET /auth/github/callback?code=${code}&state=${state}`)
    log.push('')
    log.push(`   Проверка: state совпадает с сессией -> OK`)
    log.push('')

    // Step 3: Exchange code for token
    log.push('--- Шаг 3: Обмен code на access token ---')
    log.push('')
    log.push('>> POST https://github.com/login/oauth/access_token')
    log.push('>> Body: {')
    log.push('>>   client_id: "YOUR_CLIENT_ID",')
    log.push('>>   client_secret: "YOUR_CLIENT_SECRET",')
    log.push(`>>   code: "${code}",`)
    log.push('>>   redirect_uri: "https://api.example.com/auth/github/callback"')
    log.push('>> }')
    log.push('')
    log.push('<< { "access_token": "gho_xxxx", "token_type": "bearer", "scope": "user:email" }')
    log.push('')

    // Step 4: Get user info
    log.push('--- Шаг 4: Получение данных пользователя ---')
    log.push('')
    log.push('>> GET https://api.github.com/user')
    log.push('>> Authorization: Bearer gho_xxxx')
    log.push('')
    log.push('<< { "id": 12345, "login": "johndoe", "email": "john@example.com" }')
    log.push('')

    // Step 5: Create/find user
    log.push('--- Шаг 5: Создание сессии ---')
    log.push('')
    log.push('   DB: SELECT * FROM users WHERE github_id = 12345')
    log.push('   -> Не найден: INSERT INTO users (...) VALUES (...)')
    log.push('   Создаём JWT/сессию для нашего приложения')
    log.push('')
    log.push('<< 302 Redirect to https://app.example.com/dashboard')
    log.push('<< Set-Cookie: accessToken=eyJ...')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.4: OAuth 2.0</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.5: RBAC — Решение
// ============================================

export function Task6_5_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== RBAC (Role-Based Access Control) ===')
    log.push('')

    // Roles and permissions
    log.push('--- Роли и разрешения ---')
    log.push('')

    const roles: Record<string, string[]> = {
      admin: ['users.read', 'users.write', 'users.delete', 'posts.read', 'posts.write', 'posts.delete', 'admin.access'],
      editor: ['users.read', 'posts.read', 'posts.write', 'posts.delete'],
      user: ['users.read', 'posts.read', 'posts.write'],
      viewer: ['users.read', 'posts.read'],
    }

    for (const [role, perms] of Object.entries(roles)) {
      log.push(`  ${role.padEnd(8)}: ${perms.join(', ')}`)
    }
    log.push('')

    // RBAC middleware
    log.push('--- Middleware реализация ---')
    log.push('')
    log.push('function requirePermission(...permissions: string[]) {')
    log.push('  return (req, res, next) => {')
    log.push('    const userPerms = ROLES[req.user.role]')
    log.push('    const hasAll = permissions.every(p => userPerms.includes(p))')
    log.push('    if (!hasAll) {')
    log.push('      return res.status(403).json({')
    log.push('        error: "Insufficient permissions",')
    log.push('        required: permissions,')
    log.push('        current: req.user.role')
    log.push('      })')
    log.push('    }')
    log.push('    next()')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Использование:')
    log.push('router.delete("/users/:id", requirePermission("users.delete"), deleteUser)')
    log.push('router.get("/admin/stats", requirePermission("admin.access"), getStats)')
    log.push('')

    // Simulate access checks
    log.push('=== Симуляция проверки доступа ===')
    log.push('')

    const checks = [
      { user: 'admin', permission: 'users.delete', endpoint: 'DELETE /api/users/42' },
      { user: 'editor', permission: 'users.delete', endpoint: 'DELETE /api/users/42' },
      { user: 'editor', permission: 'posts.write', endpoint: 'POST /api/posts' },
      { user: 'viewer', permission: 'posts.write', endpoint: 'POST /api/posts' },
      { user: 'user', permission: 'admin.access', endpoint: 'GET /api/admin/stats' },
    ]

    for (const check of checks) {
      const hasPermission = roles[check.user]?.includes(check.permission)
      const status = hasPermission ? '200 OK' : '403 Forbidden'
      const icon = hasPermission ? '[+]' : '[-]'

      log.push(`  ${icon} ${check.endpoint}`)
      log.push(`      role: ${check.user}, needs: ${check.permission} -> ${status}`)
      log.push('')
    }

    // Resource-level permissions
    log.push('--- Владение ресурсом (Resource-level) ---')
    log.push('')
    log.push('// Пользователь может редактировать только свои посты:')
    log.push('function requireOwnership(req, res, next) {')
    log.push('  const post = await Post.findById(req.params.id)')
    log.push('  if (post.authorId !== req.user.id && req.user.role !== "admin") {')
    log.push('    return res.status(403).json({ error: "Not the owner" })')
    log.push('  }')
    log.push('  next()')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.5: RBAC</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
