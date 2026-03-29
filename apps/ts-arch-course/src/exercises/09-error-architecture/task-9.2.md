# Задание 9.2: Error Boundaries

## 🎯 Цель

Реализовать паттерн Error Boundary для изоляции доменов ошибок — каждый слой приложения имеет свой типизированный boundary, преобразующий `unknown` в конкретный тип ошибки.

## Требования

1. Создайте тип `Result<T, E>` как discriminated union (`ok: true | false`)
2. Реализуйте вспомогательные функции `ok(value)` и `err(error)`
3. Создайте интерфейс `BoundaryConfig<E>` с полями `name`, `catch: (error: unknown) => E`, `onError?`
4. Реализуйте `createBoundary(config)` с методом `run<T>(fn): Result<T, E>`:
   - Вызывает fn в try/catch
   - Маппит unknown-ошибку через config.catch
   - Возвращает Result
5. Создайте минимум 2 разных boundary: domain (DomainError) и infra (InfraError)

## Чеклист

- [ ] `Result<T, E>` — discriminated union с `ok` как дискриминантом
- [ ] `ok()` возвращает `Result<T, never>`, `err()` — `Result<never, E>`
- [ ] `createBoundary` преобразует `unknown` в типизированную ошибку `E`
- [ ] `domainBoundary.run()` возвращает `Result<T, DomainError>`
- [ ] `infraBoundary.run()` возвращает `Result<T, InfraError>`
- [ ] `onError` вызывается при ошибке для логирования

## Как проверить себя

Оберните в boundary функции, которые бросают разные исключения. Убедитесь, что boundary всегда возвращает Result с правильным типом ошибки. Проверьте, что errors из разных boundary имеют разные типы.
