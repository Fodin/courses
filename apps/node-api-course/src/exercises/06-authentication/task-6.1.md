# Задание 6.1: Cookie Sessions

## 🎯 Цель

Реализовать сессионную аутентификацию через cookies: настройка express-session, cookie options, session store и полный цикл login/request/logout.

## Требования

1. Настройте `express-session` с параметрами: secret, resave, saveUninitialized, cookie options
2. Настройте cookie: `secure: true`, `httpOnly: true`, `sameSite: 'lax'`, `maxAge`
3. Покажите полный цикл: login (создание сессии в Redis) -> authenticated request -> logout (destroy)
4. Объясните Set-Cookie заголовок с флагами HttpOnly, Secure, SameSite
5. Сравните session stores: MemoryStore (dev only), RedisStore, PostgresStore

## Чеклист

- [ ] express-session настроен с безопасными cookie options
- [ ] Login: проверка пароля -> создание сессии -> Set-Cookie с connect.sid
- [ ] Authenticated request: Cookie -> Redis GET -> req.session.userId
- [ ] Logout: req.session.destroy() -> Redis DEL -> Set-Cookie: Max-Age=0
- [ ] MemoryStore помечен как опасный для production

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: полный цикл login/request/logout показан с Redis-операциями и Set-Cookie заголовками.
