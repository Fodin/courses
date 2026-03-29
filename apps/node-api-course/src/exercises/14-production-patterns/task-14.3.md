# Задание 14.3: Graceful Shutdown

## 🎯 Цель

Освоить graceful shutdown: обработка SIGTERM/SIGINT, отклонение новых запросов, draining in-flight запросов, закрытие соединений, force timeout.

## Требования

1. Переключите health endpoint на 503 при isShuttingDown
2. Добавьте middleware для отклонения новых запросов с Connection: close
3. Вызовите server.close() для прекращения приёма новых соединений
4. Закройте все соединения через Promise.allSettled: pool, redis, mongoose, worker
5. Установите force timeout (30 сек) для принудительного завершения при зависании

## Чеклист

- [ ] SIGTERM и SIGINT обработаны через gracefulShutdown
- [ ] Health endpoint возвращает 503 при shutdown
- [ ] Новые запросы отклоняются с Connection: close
- [ ] In-flight запросы завершаются до закрытия
- [ ] Все соединения закрыты, force timeout предотвращает зависание

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: SIGTERM запускает shutdown, health возвращает 503, соединения закрываются в правильном порядке, процесс завершается с кодом 0.
