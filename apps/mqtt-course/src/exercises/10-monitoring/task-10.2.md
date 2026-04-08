# Задание 10.2: Скрипты мониторинга

## Цель

Создать shell-скрипт для OpenWRT, который собирает метрики Mosquitto и отправляет алерт, если брокер перегружен.

## Требования

1. Написать скрипт `/usr/local/bin/mqtt-stats.sh` с функцией `get_metric()`
2. Скрипт должен выводить: clients, messages/received, heap/current, uptime, retained/count, messages/publish/dropped
3. Добавить порог алерта: если `clients > 50` — публиковать в `system/mqtt/alert`
4. Добавить запись в CSV: `/tmp/mqtt-metrics.csv` (timestamp + все метрики)
5. Добавить скрипт в cron: запускать каждые 5 минут
6. Реализовать ротацию лога (не более 1000 строк)

## Чеклист

- [ ] Скрипт создан и исполняем (`chmod +x`)
- [ ] Функция `get_metric()` использует `-C 1 -W 5`
- [ ] Все 6 метрик выводятся при запуске
- [ ] Алерт отправляется через `mosquitto_pub` при превышении порога
- [ ] CSV-лог записывается в `/tmp/` (не в flash)
- [ ] Cron запускает скрипт: `*/5 * * * * /usr/local/bin/mqtt-stats.sh`
- [ ] Реализована ротация: `tail -1001 "$LOG" > ...`

## Как проверить себя

```bash
# 1. Запустить скрипт вручную:
/usr/local/bin/mqtt-stats.sh

# Ожидаемый вывод:
# === Mosquitto Status ===
# Клиентов подключено: 3
# Сообщений получено:  1247
# Heap memory:         524288 bytes
# ...

# 2. Проверить CSV:
head -5 /tmp/mqtt-metrics.csv
# timestamp,clients,msg_rx,msg_tx,heap,retained,dropped

# 3. Проверить cron:
crontab -l | grep mqtt

# 4. Симулировать алерт (подключить 50+ клиентов или изменить порог для теста):
# Изменить MAX_CLIENTS=1 и запустить — должно опубликовать алерт
mosquitto_sub -h localhost -u monitor -P monpass \
  -t 'system/mqtt/alert' -C 1 -W 10
```
