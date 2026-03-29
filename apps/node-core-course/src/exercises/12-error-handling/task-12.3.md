# Задание 12.3: Async Error Patterns

## Цель

Освоить обработку ошибок в разных асинхронных контекстах Node.js: callbacks, promises, EventEmitters, streams, и паттерн пропагации ошибок через слои приложения.

## Требования

1. Покажите error-first callback паттерн и почему throw внутри callback опасен
2. Продемонстрируйте обработку ошибок в Promise chains и async/await
3. Покажите особенности ошибок в EventEmitter: обязательный обработчик error, captureRejections
4. Объясните почему pipe() не передаёт ошибки и почему pipeline() лучше
5. Продемонстрируйте паттерн пропагации ошибок с error.cause через слои приложения

## Чеклист

- [ ] Error-first callback паттерн с обработкой ошибки
- [ ] Promise .catch() и async/await try/catch
- [ ] EventEmitter error event и captureRejections
- [ ] pipeline() vs pipe() для потоков
- [ ] Пропагация ошибок с добавлением контекста на каждом слое

## Как проверить себя

1. Нажмите "Запустить" — должны отобразиться все паттерны обработки ошибок
2. Убедитесь, что показано, почему throw в callback ведёт к uncaughtException
3. Проверьте, что pipeline() рекомендуется вместо pipe()
4. Убедитесь, что error.cause используется для цепочки ошибок между слоями
