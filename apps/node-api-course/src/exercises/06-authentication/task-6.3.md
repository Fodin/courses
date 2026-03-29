# Задание 6.3: Refresh Tokens

## 🎯 Цель

Реализовать систему refresh токенов: пара access/refresh, ротация токенов, обнаружение переиспользования и отзыв.

## Требования

1. Объясните пару токенов: access (15 мин, в памяти) и refresh (7 дней, httpOnly cookie)
2. Реализуйте token rotation: при refresh выдаётся новый refresh token, старый отзывается
3. Покажите обнаружение кражи: переиспользование отозванного токена -> отзыв всего семейства
4. Покажите хранение в БД: hash(token), userId, family, revoked, expiresAt
5. Объясните, почему access token не хранят в localStorage

## Чеклист

- [ ] Access token: короткий TTL, содержит claims, хранится в памяти
- [ ] Refresh token: длинный TTL, opaque, httpOnly cookie, хранится в БД (хеш)
- [ ] Rotation: старый refresh отзывается, выдаётся новый при каждом refresh
- [ ] Reuse detection: повторное использование отозванного -> отзыв всей family
- [ ] DB: token hash, userId, family, revoked flag

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: цикл login -> refresh -> reuse detection показан полностью, ротация и обнаружение кражи объяснены.
