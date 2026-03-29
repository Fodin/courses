# Задание 14.1: BullMQ

## 🎯 Цель

Освоить BullMQ: создание очередей, producers для добавления задач, workers для обработки с concurrency, retry, events и monitoring.

## Требования

1. Создайте Queue с подключением к Redis (IORedis с maxRetriesPerRequest: null)
2. Реализуйте Producer: add с data, attempts (3), exponential backoff, removeOnComplete/Fail
3. Добавьте delayed job (задержка 24 часа) и bulk add
4. Реализуйте Worker: обработка задач с updateProgress, concurrency (5), rate limiter
5. Подключите QueueEvents для отслеживания completed/failed/progress и покажите getJobCounts()

## Чеклист

- [ ] Queue создана с Redis connection
- [ ] Producer добавляет задачи с retry и backoff
- [ ] Delayed и bulk jobs работают
- [ ] Worker обрабатывает с concurrency и отслеживает progress
- [ ] Events и метрики очереди доступны

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: очередь создана, задачи добавляются и обрабатываются, retry с backoff работает, события логируются.
