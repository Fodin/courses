# Задание 7.4: Транзакции и пулинг

## 🎯 Цель

Освоить транзакции (pg, Prisma) и настройку connection pool: атомарные операции, deadlock prevention и формулу размера пула.

## Требования

1. Реализуйте транзакцию в pg: BEGIN -> операции -> COMMIT / ROLLBACK + client.release()
2. Покажите транзакцию в Prisma: `prisma.$transaction(async (tx) => { ... })`
3. Продемонстрируйте атомарный банковский перевод: списание + зачисление + запись в журнал
4. Объясните настройку connection pool: формулу `(cpu_cores * 2) + disk_spindles`, min/max, таймауты
5. Покажите предотвращение deadlock: сортировка ресурсов + SELECT FOR UPDATE

## Чеклист

- [ ] pg: BEGIN/COMMIT/ROLLBACK с try/catch/finally и client.release()
- [ ] Prisma: $transaction с interactive callback
- [ ] Банковский перевод: 3 операции атомарно, проверка баланса внутри транзакции
- [ ] Pool: формула размера, min/max, idle/connection/query таймауты
- [ ] Deadlock: блокировка ресурсов в одном порядке (sorted IDs + FOR UPDATE)

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: транзакции показаны в pg и Prisma, банковский перевод атомарный, пул настроен по формуле, deadlock prevention объяснён.
