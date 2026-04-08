# Задание 11.3: Управление соединениями

## Цель

Настроить параметры сессий и keepalive для оптимальной работы IoT-устройств, которые периодически уходят в спящий режим.

## Требования

1. Создать двух пользователей: `dashboard` (clean session) и `sensor1` (persistent session)
2. В ACL настроить разные права доступа для каждого
3. Включить persistence (`persistence true`) с хранением в `/tmp/mosquitto/`
4. Настроить `persistent_client_expiration 1d`
5. Настроить `max_keepalive 300`
6. Проверить: после отключения `sensor1` брокер должен сохранить подписки
7. После переподключения `sensor1` — получить накопленные сообщения

## Чеклист

- [ ] `persistence true` с `persistence_location /tmp/mosquitto/`
- [ ] `persistent_client_expiration 1d`
- [ ] `max_keepalive 300`
- [ ] Каталог `/tmp/mosquitto/` создан и доступен для записи
- [ ] Пользователь sensor1 подключается с `clean=false` (persistent)
- [ ] После отключения sensor1 в `/tmp/mosquitto/` есть файл persistence.db
- [ ] После переподключения sensor1 получает накопленные сообщения

## Как проверить себя

```bash
# Шаг 1: Подключить sensor1 как persistent (в одном терминале):
mosquitto_sub -h localhost -u sensor1 -P pass \
  -i sensor1-device \
  -t "commands/#" \
  --clean-session 0  # false = persistent session

# Шаг 2: Отключить sensor1 (Ctrl+C)

# Шаг 3: Пока sensor1 offline — опубликовать команду (в другом терминале):
mosquitto_pub -h localhost -u admin -P pass \
  -t "commands/sensor1/config" \
  -m '{"interval":30}' -q 1

# Шаг 4: Переподключить sensor1:
mosquitto_sub -h localhost -u sensor1 -P pass \
  -i sensor1-device \
  -t "commands/#" \
  --clean-session 0
# Ожидаем: немедленно получить сообщение {"interval":30}

# Шаг 5: Проверить файл persistence:
ls -la /tmp/mosquitto/
# Должен быть файл mosquitto.db

# Шаг 6: Проверить keepalive ограничение:
# Клиент с keepalive=600 должен быть отклонён (превышает max_keepalive=300)
mosquitto_sub -h localhost -u sensor1 -P pass \
  -t "test" --keepalive 600
# Mosquitto 2.x установит keepalive = min(client_keepalive, max_keepalive) = 300
```
