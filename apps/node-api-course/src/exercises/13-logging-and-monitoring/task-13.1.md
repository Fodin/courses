# Задание 13.1: Pino

## 🎯 Цель

Освоить Pino: структурированное JSON-логирование, уровни логов, child loggers с контекстом, custom serializers и redaction чувствительных данных.

## Требования

1. Настройте Pino: level, timestamp (isoTime), formatters, redact для паролей и токенов
2. Покажите все уровни логирования: trace, debug, info, warn, error, fatal
3. Создайте child logger с requestId и userId для трекинга запросов
4. Реализуйте Express middleware для автоматического присвоения requestId
5. Настройте custom serializers для req и res объектов

## Чеклист

- [ ] Pino настроен с JSON-форматом и redaction
- [ ] Уровни логирования демонстрируются с правильным использованием
- [ ] Child loggers наследуют контекст родителя
- [ ] Middleware присваивает requestId каждому запросу
- [ ] Serializers форматируют req/res в компактный вид

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: логи в JSON-формате, redaction скрывает пароли, child loggers добавляют контекст, serializers форматируют объекты.
