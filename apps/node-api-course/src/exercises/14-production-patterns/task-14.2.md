# Задание 14.2: Cron Jobs

## 🎯 Цель

Освоить node-cron: планирование периодических задач, формат cron-выражений, overlap prevention, stop/start, graceful shutdown.

## Требования

1. Покажите формат cron-выражений с примерами: каждую минуту, ежедневно, будни, каждые 5 минут
2. Настройте cron.schedule с timezone
3. Реализуйте overlap prevention через флаг isRunning с try/finally
4. Покажите stop/start для управления задачами
5. Остановите cron-задачи при SIGTERM

## Чеклист

- [ ] Cron-выражения валидируются через cron.validate()
- [ ] Задачи запланированы с timezone
- [ ] Overlap prevention предотвращает параллельный запуск
- [ ] Stop/start позволяют управлять задачами
- [ ] SIGTERM корректно останавливает все cron-задачи

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: cron-задачи планируются и выполняются, overlap prevention работает, graceful shutdown останавливает задачи.
