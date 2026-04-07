# Задание 11.1: Ограничения встраиваемых систем

## Цель

Понять ресурсные ограничения роутера и оценить, сколько клиентов и сообщений может обработать ваше устройство.

## Требования

1. Определить характеристики вашего роутера: RAM, Flash, CPU
2. Рассчитать максимальное количество MQTT-клиентов по формуле: `free_ram × 0.4 / 0.025`
3. Определить подходящий `message_size_limit` для вашего IoT-сценария
4. Составить список функций Mosquitto, которые следует отключить на бюджетном роутере (≤32 MB RAM)
5. Написать `mosquitto.conf` с ограничениями, учитывающими характеристики устройства

## Чеклист

- [ ] Характеристики устройства выписаны: RAM, Flash, CPU модель
- [ ] Рассчитан `max_connections` по формуле
- [ ] Определён `message_size_limit` (не оставлен по умолчанию)
- [ ] Написан `memory_limit` (не менее 20% и не более 40% от RAM)
- [ ] Конфиг применён и Mosquitto запущен без ошибок

## Как проверить себя

```bash
# Характеристики устройства:
cat /proc/meminfo | grep MemTotal
cat /proc/cpuinfo | grep "model name\|cpu MHz"
df -h /overlay   # Свободное место в flash

# Текущее потребление Mosquitto:
top -b -n 1 | grep mosquitto
# Или:
cat /proc/$(pidof mosquitto)/status | grep -E "VmRSS|VmPeak"

# Свободная память после запуска:
free -m

# Убедиться в применении настроек:
mosquitto -c /etc/mosquitto/mosquitto.conf --help 2>/dev/null || \
  mosquitto -c /etc/mosquitto/mosquitto.conf -v & sleep 2; kill %1
```

Справочная таблица (min рекомендации):

| RAM | max_connections | memory_limit | message_size_limit |
|---|---|---|---|
| 32 MB | 10 | 8 MB | 512 |
| 64 MB | 30 | 20 MB | 4096 |
| 128 MB | 50 | 40 MB | 8192 |
| 256 MB | 150 | 80 MB | 65536 |
