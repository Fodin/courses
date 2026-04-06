# Задание 9.3: Веб-клиент MQTT

## Цель

Создать минимальную HTML-страницу, которая подключается к брокеру через WebSocket и отображает сообщения в реальном времени.

## Требования

1. Создать HTML-файл с подключением MQTT.js через CDN
2. Подключиться к брокеру: `ws://192.168.1.1:9001` (или через nginx)
3. Подписаться на топик `sensors/#` с QoS 1
4. Отображать полученные сообщения на странице (топик + значение + время)
5. Реализовать кнопку публикации: отправить сообщение в `home/cmd/test`
6. Обработать события `error`, `offline`, `reconnect`

## Чеклист

- [ ] HTML-файл содержит `<script src="...mqtt.min.js">`
- [ ] `clientId` генерируется уникально для каждого открытия страницы
- [ ] Событие `connect` обрабатывается, подписка выполняется внутри него
- [ ] Входящие сообщения отображаются в DOM (список или таблица)
- [ ] Кнопка публикации работает
- [ ] Обработаны события `error` и `offline`
- [ ] При закрытии страницы вызывается `client.end()`

## Как проверить себя

```bash
# Публикуйте тестовые сообщения с роутера:
mosquitto_pub -h localhost -u user -P pass \
  -t "sensors/room1/temp" -m "22.5" -q 1 -r

# Должно появиться на странице в браузере.

# Проверьте консоль браузера на ошибки (F12 -> Console).

# Проверьте, что clientId в логах Mosquitto уникален:
logread | grep "New client"
```

Минимальный код для выполнения:
```html
<!DOCTYPE html>
<html>
<head><title>MQTT Dashboard</title></head>
<body>
  <ul id="messages"></ul>
  <button id="publish">Отправить тест</button>

  <script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
  <script>
    const client = mqtt.connect('ws://192.168.1.1:9001', {
      clientId: 'web-' + Math.random().toString(16).slice(2),
      username: 'user',
      password: 'pass',
    })

    client.on('connect', () => {
      client.subscribe('sensors/#', { qos: 1 })
    })

    client.on('message', (topic, payload) => {
      const li = document.createElement('li')
      li.textContent = `[${topic}] ${payload.toString()}`
      document.getElementById('messages').prepend(li)
    })

    document.getElementById('publish').onclick = () => {
      client.publish('home/cmd/test', 'hello', { qos: 1 })
    }

    window.onbeforeunload = () => client.end()
  </script>
</body>
</html>
```
