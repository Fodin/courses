# Задание 12.1: Firewall правила для MQTT

## Цель

Настроить правила firewall на OpenWRT, которые разрешают MQTT только из локальной сети и блокируют любой доступ с WAN.

## Требования

1. Убедиться, что порт 1883 не доступен из интернета (проверить через nmap с внешнего хоста)
2. Добавить явное правило блокировки через UCI: `src='wan'`, `dest_port='1883 9001'`, `target='DROP'`
3. Настроить `bind_address` в mosquitto.conf на IP LAN-интерфейса (192.168.1.1)
4. Добавить rate limiting через iptables: не более 5 новых подключений в минуту с одного IP
5. Проверить, что из LAN (другого устройства в сети) подключение работает

## Чеклист

- [ ] Через UCI добавлено правило Block-MQTT-WAN
- [ ] `uci commit firewall && /etc/init.d/firewall restart` выполнен
- [ ] `bind_address 192.168.1.1` добавлен в mosquitto.conf
- [ ] Mosquitto после перезапуска слушает только на 192.168.1.1
- [ ] Rate limiting через iptables добавлен для порта 1883
- [ ] Из LAN-устройства: `mosquitto_sub -h 192.168.1.1 -t test` работает
- [ ] С внешнего IP: порт 1883 — `filtered` или `closed` (не `open`)

## Как проверить себя

```bash
# 1. Проверить что bind_address применился:
netstat -tlnp | grep 1883
# Должно быть: 192.168.1.1:1883, а не 0.0.0.0:1883

# 2. Проверить UCI правила:
uci show firewall | grep -A5 "Block-MQTT"

# 3. Проверить iptables:
iptables -L INPUT -n -v | grep 1883

# 4. Проверить с LAN (другой хост):
mosquitto_sub -h 192.168.1.1 -u user -P pass -t test/#

# 5. Rate limiting тест (запустить 10 раз быстро):
for i in $(seq 1 10); do
  mosquitto_pub -h 192.168.1.1 -u bad -P wrong -t x -m x 2>/dev/null &
done
wait
# После 5 попыток — должны блокироваться

# 6. Посмотреть заблокированные пакеты в логах:
dmesg | grep "MQTT-BLOCKED\|MQTT-RATE" | tail -10
```
