# Задание 13.1: perf_hooks

## Цель

Освоить Performance API Node.js: `performance.now()`, marks/measures, `PerformanceObserver`, `timerify()` и мониторинг Garbage Collection.

## Требования

1. Продемонстрируйте использование `performance.now()` для точного измерения времени
2. Покажите создание marks и measures с `performance.mark()` и `performance.measure()`
3. Реализуйте `PerformanceObserver` для реактивного получения результатов
4. Продемонстрируйте `performance.timerify()` для автоизмерения функций
5. Покажите мониторинг GC через PerformanceObserver с entryTypes: ["gc"]
6. Приведите практический пример: замер времени API-запросов

## Чеклист

- [ ] performance.now() с пояснением отличия от Date.now()
- [ ] Marks и measures для замера операций
- [ ] PerformanceObserver с разными entryTypes
- [ ] timerify() для автоматического замера функций
- [ ] GC мониторинг с описанием kind
- [ ] Практический пример с API timing

## Как проверить себя

1. Нажмите "Запустить" — должны отобразиться все инструменты Performance API
2. Убедитесь, что объяснено преимущество performance.now() над Date.now()
3. Проверьте, что PerformanceObserver показан для разных типов записей
4. Убедитесь, что GC мониторинг требует флаг --expose-gc
