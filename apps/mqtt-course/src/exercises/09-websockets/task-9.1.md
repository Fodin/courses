# Задание 9.1: WebSocket listener

## Цель

Настроить Mosquitto для работы через WebSocket-протокол, чтобы браузеры могли подключаться к брокеру напрямую.

## Требования

1. Добавить второй слушатель в `mosquitto.conf` с `protocol websockets` на порту 9001
2. Основной TCP-слушатель (порт 1883) сохранить
3. Убедиться, что аутентификация работает для обоих слушателей
4. Проверить, что Mosquitto запускается без ошибок и порт 9001 открыт
5. Протестировать WebSocket-подключение с помощью утилиты или браузерной консоли

## Чеклист

- [ ] В `mosquitto.conf` есть два блока `listener`
- [ ] Второй listener имеет `protocol websockets`
- [ ] `allow_anonymous false` применяется ко всем слушателям
- [ ] Команда `netstat -tlnp | grep 9001` показывает открытый порт
- [ ] В логах Mosquitto нет ошибок при старте
- [ ] WebSocket-соединение успешно устанавливается (код 101)

## Как проверить себя

```bash
# 1. Перезапустить брокер:
/etc/init.d/mosquitto restart

# 2. Проверить порт:
netstat -tlnp | grep mosquitto

# 3. Проверить лог старта:
logread | grep mosquitto | tail -20

# 4. Тест WebSocket handshake (curl):
curl -v -N \
  -H "Upgrade: websocket" \
  -H "Connection: Upgrade" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://192.168.1.1:9001/
# Должен получить: HTTP/1.1 101 Switching Protocols
```

Минимальный конфиг для выполнения:
```conf
listener 1883
protocol mqtt

listener 9001
protocol websockets

allow_anonymous false
password_file /etc/mosquitto/passwd
```
