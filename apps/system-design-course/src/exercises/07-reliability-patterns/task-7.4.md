# Задание 7.4: Стратегия надёжности для платёжного сервиса

## Цель

Спроектировать полную стратегию надёжности для платёжного сервиса, который зависит от трёх внешних провайдеров: Stripe, PayPal и внутреннего процессинга.

## Требования

1. **Три платёжных провайдера:**
   - **Stripe** — основной, быстрый (p99 = 200ms), uptime 99.99%
   - **PayPal** — резервный, медленнее (p99 = 500ms), uptime 99.95%
   - **Internal Processing** — внутренний, для мелких сумм (p99 = 50ms), uptime 99.9%
2. **Для каждого провайдера определите:**
   - **Retry policy** — количество попыток, backoff strategy, какие ошибки ретраить
   - **Circuit breaker config** — failure threshold, recovery timeout
   - **Timeout** — максимальное время ожидания
   - **Fallback strategy** — что делать при отказе этого провайдера
3. **Общая стратегия деградации:**
   - Порядок failover между провайдерами
   - Когда ставить платёж в очередь (queue) вместо отказа
   - Когда отказывать клиенту и с каким сообщением
4. **Мониторинг:**
   - Какие SLI отслеживать
   - Какие SLO установить
   - Алерты (при каком burn rate оповещать)
5. **Интерактивная таблица:** заполните конфигурацию для каждого провайдера

## Чеклист

- [ ] Retry policy для каждого провайдера (retries, backoff, retryable errors)
- [ ] Circuit breaker config (threshold, timeout) для каждого провайдера
- [ ] Timeout для каждого провайдера
- [ ] Fallback: Stripe → PayPal → Internal → Queue → Reject
- [ ] Определены ситуации для queue vs reject
- [ ] SLI: success rate, latency p50/p99, error rate by provider
- [ ] SLO: общий success rate > 99.95%, latency p99 < 1s
- [ ] Алерты: burn rate > 2 → warning, > 5 → critical

## Как проверить себя

1. Stripe упал → fallback на PayPal → платежи проходят
2. Stripe и PayPal упали → Internal Processing для мелких сумм, queue для крупных
3. Все провайдеры упали → платёж в очередь (если не критично) или reject с сообщением
4. Circuit breaker threshold для Stripe = 5 (быстрый сервис, можно больше попыток)
5. Timeout для Internal Processing короче, чем для Stripe (он быстрее)
6. Retry только idempotent errors (timeout, 503), не retry 400/401
