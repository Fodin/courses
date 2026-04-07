# Задание 11.2: Тюнинг Mosquitto

## Цель

Применить ключевые параметры оптимизации Mosquitto в `mosquitto.conf` для роутера с 64-128 MB RAM.

## Требования

1. Установить `max_connections` согласно доступной RAM (формула из задания 11.1)
2. Ограничить `message_size_limit` до разумного значения (не более 8192 для IoT)
3. Настроить `max_queued_messages 100` и `max_queued_bytes 524288`
4. Задать `memory_limit` (40% от RAM в байтах)
5. Увеличить `sys_interval` до 30 секунд
6. Настроить облегчённое логирование: только `error warning`

## Чеклист

- [ ] `max_connections` задан явно (не оставлен -1)
- [ ] `message_size_limit` задан явно (не оставлен на дефолте 268 MB)
- [ ] `max_queued_messages` ≤ 500
- [ ] `max_queued_bytes` задан (Mosquitto 2.x)
- [ ] `memory_limit` задан (не 0)
- [ ] `sys_interval 30` или больше
- [ ] `log_type error warning` (без debug/information)
- [ ] Mosquitto после перезапуска работает корректно

## Как проверить себя

```bash
# 1. Проверить применение конфига:
mosquitto -c /etc/mosquitto/mosquitto.conf -v 2>&1 | head -20
# Ищем строки о применении параметров

# 2. После подключения нескольких клиентов — мониторинг памяти:
cat /proc/$(pidof mosquitto)/status | grep VmRSS

# 3. Проверить heap через $SYS:
mosquitto_sub -h localhost -u admin -P pass \
  -t '$SYS/broker/heap/current' -C 1 -W 5

# 4. Попробовать отправить сообщение больше message_size_limit:
python3 -c "print('x' * 10000)" | \
  mosquitto_pub -h localhost -u user -P pass \
  -t test/big -s
# Должен получить ошибку: Message too large

# 5. Убедиться что sys_interval работает (метрики обновляются каждые 30с):
mosquitto_sub -h localhost -u admin -P pass \
  -t '$SYS/broker/uptime' -v -W 65
# Должно вывести 2 значения с интервалом ~30 сек
```
