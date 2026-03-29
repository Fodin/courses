# Задание 13.2: Winston

## 🎯 Цель

Освоить Winston: множественные transports, ротация логов, custom formats и correlation IDs через AsyncLocalStorage.

## Требования

1. Настройте Winston с transports: Console (colorize для dev), File (combined + error), DailyRotateFile
2. Настройте DailyRotateFile: datePattern, maxSize, maxFiles (14 дней), zippedArchive
3. Реализуйте custom format для добавления correlation ID из AsyncLocalStorage
4. Создайте middleware с AsyncLocalStorage для requestId
5. Покажите разные форматы для dev (colorize + simple) и prod (JSON)

## Чеклист

- [ ] Winston настроен с 3+ transports (Console, File, DailyRotateFile)
- [ ] DailyRotateFile архивирует и удаляет старые логи
- [ ] Correlation ID присутствует во всех логах одного запроса
- [ ] AsyncLocalStorage пробрасывает requestId без явной передачи
- [ ] Dev и prod имеют разные форматы вывода

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: Winston пишет в несколько transports, ротация работает, correlation ID связывает логи запроса.
