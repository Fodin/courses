# Задание 6.2: JWT

## 🎯 Цель

Реализовать JWT-аутентификацию: структура токена, создание, верификация и guard middleware.

## Требования

1. Покажите структуру JWT: Header (alg, typ) + Payload (sub, role, iat, exp) + Signature
2. Продемонстрируйте полный цикл: login -> получение токена -> запрос с Bearer token -> верификация
3. Покажите обработку истекшего/невалидного токена (TokenExpiredError, JsonWebTokenError)
4. Реализуйте `authGuard` middleware: извлечение токена из Authorization header, jwt.verify, req.user
5. Покажите пример декодированного payload

## Чеклист

- [ ] JWT структура: base64(header).base64(payload).signature
- [ ] Login возвращает accessToken + expiresIn
- [ ] Bearer token извлекается из `Authorization: Bearer <token>`
- [ ] jwt.verify декодирует payload в req.user
- [ ] TokenExpiredError -> 401 "Token expired", невалидный -> 401 "Invalid token"

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: структура JWT разобрана, цикл login -> request -> expired показан полностью, authGuard middleware реализован.
