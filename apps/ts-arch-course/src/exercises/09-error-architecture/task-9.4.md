# Задание 9.4: Recovery Strategies

## 🎯 Цель

Реализовать типобезопасные стратегии восстановления после ошибок: retry с конфигурацией, fallback с двойным типом ошибки и circuit breaker с состоянием.

## Требования

1. Реализуйте `retry<T, E>(operation, config)`:
   - Возвращает `Result<T, E & { attempts: number }>`
   - Конфигурация: `maxAttempts`, `delayMs`
   - При успехе возвращает результат, при исчерпании попыток — ошибку с количеством попыток
2. Реализуйте `withFallback<T, E1, E2>(primary, fallback)`:
   - Возвращает `Result<T, { primary: E1; fallback: E2 }>`
   - Сначала пробует primary, при ошибке — fallback
   - Если оба провалились — возвращает обе ошибки
3. Реализуйте `createCircuitBreaker<T, E>(config)`:
   - Состояния: closed -> open -> half-open
   - При превышении порога сбоев — circuit открывается
   - Возвращает `Result<T, E | { circuitOpen: true; resetIn: number }>`

## Чеклист

- [ ] `retry` возвращает `Result<T, E & { attempts: number }>`
- [ ] `withFallback` возвращает `Result<T, { primary: E1; fallback: E2 }>`
- [ ] Circuit breaker переходит в open после `failureThreshold` сбоев
- [ ] В состоянии open circuit breaker возвращает `{ circuitOpen: true }`
- [ ] После `resetTimeMs` circuit breaker переходит в half-open
- [ ] Все стратегии типобезопасны — ошибки расширяются, не теряются

## Как проверить себя

Протестируйте каждую стратегию: retry с операцией, которая успевает на 3-й попытке; fallback, где primary падает; circuit breaker с серией сбоев. Убедитесь, что типы ошибок корректно расширяются.
