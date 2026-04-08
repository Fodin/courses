# Задание 12.2: Rate limiting и защита от атак

## Цель

Настроить многоуровневую защиту от DoS-атак и брутфорса пароля: через Mosquitto, iptables и скрипт автоматического бана.

## Требования

1. Настроить `per_listener_settings true` с разными `max_connections` для TCP и WebSocket слушателей
2. Добавить iptables rate limiting: не более 5 новых TCP-соединений на порт 1883 в минуту с одного IP
3. Создать скрипт `/usr/local/bin/mqtt-autoban.sh` — автоматически банит IP с 5+ ошибками аутентификации
4. Добавить скрипт в cron: запускать каждые 5 минут
5. Настроить логирование заблокированных IP через `logger`

## Чеклист

- [ ] `per_listener_settings true` добавлен в mosquitto.conf
- [ ] Слушатель 1883 имеет `max_connections 50`
- [ ] Слушатель 9001 имеет `max_connections 20`
- [ ] iptables rate limiting применён для порта 1883
- [ ] Скрипт `mqtt-autoban.sh` создан и исполняем (`chmod +x`)
- [ ] Скрипт добавлен в crontab: `*/5 * * * * ...`
- [ ] Скрипт тестово заблокировал IP с ошибками аутентификации

## Как проверить себя

```bash
# 1. Проверить per_listener_settings:
grep -A3 "listener 1883" /etc/mosquitto/mosquitto.conf
# Должно быть max_connections 50

# 2. Тест rate limiting — быстро создать > 5 подключений:
for i in $(seq 1 8); do
  mosquitto_pub -h 192.168.1.1 -u test -P test -t x -m x 2>&1 &
done
wait
# После 5-й попытки — должны получить Connection refused

# 3. Запустить скрипт бана вручную:
/usr/local/bin/mqtt-autoban.sh

# 4. Проверить, что IP забанен (если были ошибки аут.):
iptables -L INPUT -n | grep DROP

# 5. Проверить cron:
crontab -l | grep mqtt-autoban

# 6. Проверить лог:
logread | grep mqtt-autoban | tail -10

# 7. Разбанить IP для тестирования:
iptables -D INPUT -s <IP> -j DROP
```

Структура скрипта autoban:
```sh
#!/bin/sh
THRESHOLD=5
FAILED_IPS=$(logread | grep "authentication failed" | \
  grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | \
  sort | uniq -c | awk -v t="$THRESHOLD" '$1>=t{print $2}')

for IP in $FAILED_IPS; do
  iptables -A INPUT -s "$IP" -j DROP
  logger -t mqtt-autoban "Banned $IP"
done
```
