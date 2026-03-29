# Задание 9.4: Cluster Module

## Цель

Научиться масштабировать Node.js HTTP-серверы через cluster: fork workers, load balancing, auto-restart и zero-downtime restart.

## Требования

1. Покажите базовый cluster-сервер: isPrimary → fork → listen
2. Продемонстрируйте автоматический перезапуск упавших workers
3. Покажите стратегии load balancing: Round-Robin vs OS-based
4. Реализуйте zero-downtime restart (rolling restart)
5. Покажите IPC между Primary и Workers

## Чеклист

- [ ] Базовый cluster с визуализацией workers
- [ ] Auto-restart при падении worker
- [ ] Описание стратегий балансировки
- [ ] Код rolling restart пошагово
- [ ] IPC обмен сообщениями

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что workers отображаются визуально с PID и статусом
3. Проверьте, что zero-downtime restart описан пошагово
