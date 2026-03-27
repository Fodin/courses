# Задание 2.1: Adapter

## Цель

Реализовать паттерн Adapter для адаптации трёх разных логгеров (`ConsoleLogger`, `FileLogger`, `ExternalLogger`) к единому интерфейсу `ILogger`.

## Требования

1. Определите интерфейс `ILogger` с методами:
   - `info(message: string): string`
   - `error(message: string): string`
   - `warn(message: string): string`
2. Используйте предоставленные классы логгеров с несовместимыми API:
   - `ConsoleLogger` — метод `log(message: string): string`
   - `FileLogger` — метод `writeLog(level: string, message: string): string`
   - `ExternalLogger` — метод `sendLog(payload: { severity: number; text: string }): string`
3. Создайте три адаптера, реализующих `ILogger`:
   - `ConsoleLoggerAdapter` — делегирует в `ConsoleLogger.log()`, добавляя `[INFO]`/`[ERROR]`/`[WARN]` префикс
   - `FileLoggerAdapter` — делегирует в `FileLogger.writeLog()`, передавая уровень строкой
   - `ExternalLoggerAdapter` — делегирует в `ExternalLogger.sendLog()`, маппя уровень в severity (info=0, warn=1, error=2)
4. Создайте фабричную функцию `createLogger(type: 'console' | 'file' | 'external'): ILogger`
5. Продемонстрируйте, что все три адаптера работают через единый интерфейс

## Чеклист

- [ ] Интерфейс `ILogger` определён с тремя методами
- [ ] `ConsoleLoggerAdapter` принимает `ConsoleLogger` в конструктор и реализует `ILogger`
- [ ] `FileLoggerAdapter` принимает `FileLogger` в конструктор и реализует `ILogger`
- [ ] `ExternalLoggerAdapter` принимает `ExternalLogger` в конструктор и реализует `ILogger`
- [ ] Адаптеры только транслируют вызовы, не добавляя бизнес-логику
- [ ] Фабричная функция `createLogger` возвращает `ILogger`
- [ ] Демонстрация — кнопка выводит результаты для всех трёх логгеров

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что каждый логгер выводит info/warn/error сообщения в своём формате
3. Убедитесь, что клиентский код работает одинаково с любым типом логгера через `ILogger`
4. Попробуйте передать невалидный тип в `createLogger` — TypeScript должен показать ошибку
