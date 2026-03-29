# Задание 5.3: Rate Limiting

## 🎯 Цель

Реализовать ограничение частоты запросов: алгоритмы Fixed Window, Sliding Window и Token Bucket с HTTP-заголовками.

## Требования

1. Реализуйте Fixed Window: N запросов в минуту на IP, с подсчётом в фиксированном окне
2. Объясните Sliding Window Log: хранение timestamps, удаление устаревших
3. Реализуйте Token Bucket: начальные токены, refill rate, поддержка burst-трафика
4. Покажите HTTP-заголовки: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
5. Покажите ответ 429 Too Many Requests с `Retry-After`

## Чеклист

- [ ] Fixed Window: простой счётчик, сброс по времени
- [ ] Sliding Window: точнее, но дороже по памяти
- [ ] Token Bucket: refill rate + burst capacity, показана динамика токенов
- [ ] HTTP-заголовки: Limit, Remaining, Reset в каждом ответе
- [ ] 429 ответ содержит Retry-After и JSON с описанием ошибки

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: три алгоритма показаны с примерами, Token Bucket демонстрирует динамику burst/refill, заголовки и 429 ответ корректны.
