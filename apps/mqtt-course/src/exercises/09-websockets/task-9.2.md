# Задание 9.2: Reverse proxy (uhttpd/nginx)

## Цель

Настроить nginx на OpenWRT для проксирования WebSocket-трафика к Mosquitto, объединив MQTT и веб-интерфейс на одном порту (443/HTTPS).

## Требования

1. Установить nginx (`opkg install nginx`)
2. Настроить Mosquitto так, чтобы WebSocket-слушатель принимал подключения только с `127.0.0.1:9001`
3. Настроить nginx: `location /mqtt` проксирует WebSocket к `127.0.0.1:9001`
4. Обязательно добавить заголовки `Upgrade` и `Connection` в proxy-блок
5. Установить `proxy_read_timeout` не менее 3600 секунд
6. Проверить, что браузер подключается через `ws://router-ip/mqtt`

## Чеклист

- [ ] nginx установлен и запущен (`/etc/init.d/nginx status`)
- [ ] Mosquitto WebSocket-слушатель привязан к `127.0.0.1` или `127.0.0.1:9001`
- [ ] nginx.conf содержит `location /mqtt` с `proxy_pass http://127.0.0.1:9001`
- [ ] Присутствуют заголовки `Upgrade` и `Connection "upgrade"`
- [ ] `proxy_read_timeout 3600s` установлен
- [ ] MQTT.js подключается: `mqtt.connect('ws://192.168.1.1/mqtt')`

## Как проверить себя

```bash
# 1. Статус nginx:
/etc/init.d/nginx status

# 2. Тест nginx конфига:
nginx -t

# 3. Подключение через nginx (порт 80, путь /mqtt):
# В браузерной консоли:
const c = mqtt.connect('ws://192.168.1.1/mqtt', {username:'u', password:'p'})
c.on('connect', () => console.log('OK!'))

# 4. Проверка заголовков (должен быть 101):
curl -v -N \
  -H "Upgrade: websocket" \
  -H "Connection: Upgrade" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://192.168.1.1/mqtt

# 5. Лог nginx:
tail -f /var/log/nginx/error.log
```

Минимальная конфигурация nginx:
```nginx
server {
    listen 80;
    location /mqtt {
        proxy_pass http://127.0.0.1:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```
