# Задание 12.3: Чеклист безопасности MQTT

## Цель

Провести полный аудит безопасности Mosquitto-брокера и устранить все критические и высокоприоритетные проблемы.

## Требования

Проверить и выполнить все пункты:

### КРИТИЧНО (обязательно)
1. `allow_anonymous false` в mosquitto.conf
2. Все пользователи из password_file имеют пароли длиной ≥12 символов
3. ACL настроен: каждый пользователь имеет доступ только к своим топикам
4. Порт 1883 не доступен из WAN (проверка через nmap)
5. TLS настроен (порт 8883) если используется внешний доступ

### ВЫСОКИЙ ПРИОРИТЕТ
6. `bind_address` указан на LAN-интерфейс
7. `max_connections` задан явно
8. `message_size_limit` задан (не более 8192 для IoT)
9. `memory_limit` задан

### СРЕДНИЙ ПРИОРИТЕТ
10. Rate limiting через iptables
11. Мониторинг через $SYS или collectd
12. Логирование ошибок аутентификации

## Чеклист

- [ ] Все критические пункты (1-5) выполнены
- [ ] Все высокоприоритетные пункты (6-9) выполнены
- [ ] Минимум 2 из 3 средних пунктов (10-12) выполнены
- [ ] Итоговый конфиг mosquitto.conf задокументирован
- [ ] Выполнен тест: незнакомый клиент не может подключиться
- [ ] Выполнен тест: клиент не может публиковать в чужой топик

## Как проверить себя

```bash
# === Тест 1: Нет анонимного доступа ===
mosquitto_pub -h 192.168.1.1 -t test -m hello
# Ожидаем: Connection Refused: not authorised

# === Тест 2: Неверный пароль отклоняется ===
mosquitto_pub -h 192.168.1.1 -u sensor1 -P wrongpass -t test -m hello
# Ожидаем: Connection Refused: not authorised

# === Тест 3: ACL — клиент не пишет в чужой топик ===
# sensor1 может писать только в sensors/room1/#
mosquitto_pub -h 192.168.1.1 -u sensor1 -P pass1 \
  -t "sensors/room2/temperature" -m "22.5"
# Ожидаем: тишина (ACL заблокировал)

mosquitto_pub -h 192.168.1.1 -u sensor1 -P pass1 \
  -t "sensors/room1/temperature" -m "22.5"
# Ожидаем: успех (разрешено ACL)

# === Тест 4: Порт закрыт от WAN ===
# С внешнего IP или через VPN на другой адрес:
nmap -p 1883 <внешний-IP>
# Ожидаем: filtered или closed (не open)

# === Тест 5: Лимит соединений ===
# Подключить больше max_connections клиентов:
for i in $(seq 1 60); do
  mosquitto_sub -h 192.168.1.1 -u sensor1 -P pass1 \
    -t test -i "test-$i" &
done
wait
# Клиенты после лимита должны получить Connection Refused
```

Итоговый конфиг (шаблон для проверки):
```conf
# /etc/mosquitto/mosquitto.conf
listener 1883
protocol mqtt
bind_address 192.168.1.1          # LAN только
allow_anonymous false              # Нет анонимного доступа
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl
max_connections 50                 # Лимит
message_size_limit 4096            # 4 KB max
memory_limit 25000000             # 25 MB heap
log_type error warning
log_dest syslog
```
