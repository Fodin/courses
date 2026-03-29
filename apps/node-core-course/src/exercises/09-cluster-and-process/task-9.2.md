# Задание 9.2: Signals & Graceful Shutdown

## Цель

Научиться перехватывать Unix-сигналы и реализовать паттерн graceful shutdown для production-приложений.

## Требования

1. Покажите основные Unix-сигналы: SIGINT, SIGTERM, SIGKILL, SIGHUP
2. Продемонстрируйте перехват сигналов через `process.on`
3. Реализуйте полный graceful shutdown: остановка сервера → drain connections → cleanup → exit
4. Покажите таймаут для force shutdown
5. Объясните особенности Docker (SIGTERM, PID 1)

## Чеклист

- [ ] Таблица сигналов с описанием и возможностью перехвата
- [ ] Перехват SIGINT и SIGTERM
- [ ] Пошаговый graceful shutdown с визуализацией фаз
- [ ] Таймаут force shutdown с unref()
- [ ] Docker-специфика описана

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что фазы shutdown отображаются визуально
3. Проверьте, что код shutdown содержит обработку ошибок и таймаут
