# Задание 12.2: Process Error Events

## Цель

Освоить глобальные события ошибок процесса: `uncaughtException`, `unhandledRejection`, `warning`, а также паттерн graceful shutdown.

## Требования

1. Продемонстрируйте обработчик uncaughtException с объяснением, почему нельзя продолжать работу
2. Покажите unhandledRejection и поведение Node.js 15+
3. Продемонстрируйте rejectionHandled для "позднего" .catch()
4. Покажите обработку warning и создание собственных предупреждений через process.emitWarning
5. Реализуйте паттерн graceful shutdown с SIGTERM/SIGINT

## Чеклист

- [ ] uncaughtException с логированием и process.exit(1)
- [ ] unhandledRejection с объяснением поведения
- [ ] rejectionHandled для поздней обработки
- [ ] warning с типичными предупреждениями
- [ ] Graceful shutdown: остановка сервера → drain → закрытие ресурсов → exit

## Как проверить себя

1. Нажмите "Запустить" — должны отобразиться все события процесса
2. Убедитесь, что объяснено, почему после uncaughtException нужен process.exit(1)
3. Проверьте наличие graceful shutdown с обработкой SIGTERM и SIGINT
4. Убедитесь, что показан safety net через setTimeout + unref()
