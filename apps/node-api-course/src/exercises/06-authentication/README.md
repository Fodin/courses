# 🔥 Уровень 6: Аутентификация

## 🎯 Аутентификация vs Авторизация

- **Аутентификация** -- "Кто вы?" (проверка личности)
- **Авторизация** -- "Что вам разрешено?" (проверка прав)

## 🔥 Cookie Sessions

### Как работают сессии

1. Пользователь логинится -> сервер создаёт сессию в хранилище (Redis)
2. Сервер отправляет session ID в httpOnly cookie
3. Браузер автоматически отправляет cookie с каждым запросом
4. Сервер извлекает сессию по ID

```typescript
import session from 'express-session'
import RedisStore from 'connect-redis'

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // Только HTTPS
    httpOnly: true,     // Недоступна из JavaScript
    sameSite: 'lax',    // Защита от CSRF
    maxAge: 24 * 60 * 60 * 1000  // 24 часа
  }
}))
```

📌 **Важно:** никогда не используйте MemoryStore в production! Это утечка памяти и не масштабируется.

## 🔥 JWT (JSON Web Token)

### Структура

JWT = Header.Payload.Signature (base64-кодированные, разделённые точками)

```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "42", "role": "admin", "exp": 1710003600 }
Signature: HMACSHA256(header + "." + payload, secret)
```

### Создание и верификация

```typescript
import jwt from 'jsonwebtoken'

// Создание
const token = jwt.sign(
  { sub: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
)

// Верификация
const decoded = jwt.verify(token, process.env.JWT_SECRET)
// { sub: '42', role: 'admin', iat: 1710000000, exp: 1710003600 }
```

### Auth Guard Middleware

```typescript
function authGuard(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' })
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

## 🔥 Refresh Tokens

### Пара токенов

- **Access Token**: короткоживущий (15 мин), содержит claims, в памяти
- **Refresh Token**: долгоживущий (7 дней), opaque UUID, в httpOnly cookie

### Token Rotation

При обновлении access token выдаётся **новый refresh token**, а старый инвалидируется. Если кто-то использует старый refresh token -- все токены семейства отзываются (обнаружение кражи).

```typescript
async function refreshTokens(oldRefreshToken) {
  const stored = await db.findRefreshToken(hash(oldRefreshToken))
  if (!stored) throw new Error('Token not found')
  if (stored.revoked) {
    // Кража обнаружена! Отзываем всё семейство
    await db.revokeTokenFamily(stored.familyId)
    throw new Error('Token reuse detected')
  }

  await db.revokeRefreshToken(stored.id)
  const newRefresh = generateRefreshToken()
  await db.saveRefreshToken(hash(newRefresh), stored.userId, stored.familyId)

  const accessToken = jwt.sign({ sub: stored.userId }, secret, { expiresIn: '15m' })
  return { accessToken, refreshToken: newRefresh }
}
```

## 🔥 OAuth 2.0

### Authorization Code Flow

1. Редирект пользователя на OAuth-провайдер (GitHub, Google)
2. Пользователь авторизуется и соглашается
3. Провайдер редиректит обратно с authorization code
4. Сервер обменивает code на access token
5. Сервер запрашивает данные пользователя через access token
6. Создаёт/находит пользователя в своей БД

```typescript
// Шаг 1: Редирект
app.get('/auth/github', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex')
  req.session.oauthState = state
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&state=${state}`)
})

// Шаг 3: Callback
app.get('/auth/github/callback', async (req, res) => {
  if (req.query.state !== req.session.oauthState) throw new Error('CSRF')
  const { access_token } = await exchangeCode(req.query.code)
  const githubUser = await getGithubUser(access_token)
  const user = await findOrCreateUser(githubUser)
  // Создаём сессию/JWT
})
```

## 🔥 RBAC (Role-Based Access Control)

### Роли и разрешения

```typescript
const ROLES = {
  admin:  ['users.read', 'users.write', 'users.delete', 'admin.access'],
  editor: ['users.read', 'posts.read', 'posts.write'],
  user:   ['users.read', 'posts.read'],
}

function requirePermission(...permissions: string[]) {
  return (req, res, next) => {
    const userPerms = ROLES[req.user.role] || []
    const hasAll = permissions.every(p => userPerms.includes(p))
    if (!hasAll) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}

router.delete('/users/:id', requirePermission('users.delete'), deleteUser)
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: JWT в localStorage

```typescript
// ❌ Доступен из JS -> XSS атака может украсть токен
localStorage.setItem('token', jwt)

// ✅ Access token в памяти, refresh в httpOnly cookie
```

### Ошибка 2: Чувствительные данные в JWT payload

```typescript
// ❌ Payload видны всем (base64 != шифрование!)
jwt.sign({ password: '...', creditCard: '...' }, secret)

// ✅ Только ID и роль
jwt.sign({ sub: userId, role: 'admin' }, secret)
```

### Ошибка 3: Нет проверки state в OAuth

```typescript
// ❌ Уязвимость CSRF
app.get('/callback', async (req, res) => {
  const token = await exchangeCode(req.query.code) // Без проверки state!
})

// ✅ Всегда проверяйте state
if (req.query.state !== req.session.oauthState) throw new Error('CSRF')
```

### Ошибка 4: Одна роль на все случаи

```typescript
// ❌ Только isAdmin boolean
if (!req.user.isAdmin) return res.status(403)

// ✅ Гранулярные permissions
requirePermission('posts.write')
```

## 💡 Best Practices

1. **Refresh token rotation** с обнаружением кражи
2. **httpOnly cookies** для refresh tokens
3. **Короткий TTL** для access tokens (15 мин)
4. **RBAC с permissions**, не просто роли
5. **bcrypt/argon2** для хеширования паролей
6. **state parameter** в OAuth для защиты от CSRF
7. **Не храните секреты** в JWT payload -- он НЕ зашифрован
