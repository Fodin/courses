# Task 9.3: MQTT Web Client

## Goal

Create a minimal HTML page that connects to the broker via WebSocket and displays messages in real time.

## Requirements

1. Create an HTML file with MQTT.js loaded via CDN
2. Connect to the broker: `ws://192.168.1.1:9001` (or through nginx)
3. Subscribe to topic `sensors/#` with QoS 1
4. Display received messages on the page (topic + value + time)
5. Implement a publish button: send a message to `home/cmd/test`
6. Handle `error`, `offline`, `reconnect` events

## Checklist

- [ ] HTML file contains `<script src="...mqtt.min.js">`
- [ ] `clientId` is generated uniquely each time the page opens
- [ ] `connect` event is handled, subscription is made inside it
- [ ] Incoming messages are displayed in the DOM (list or table)
- [ ] Publish button works
- [ ] `error` and `offline` events are handled
- [ ] `client.end()` is called when the page closes

## How to verify

```bash
# Publish test messages from the router:
mosquitto_pub -h localhost -u user -P pass \
  -t "sensors/room1/temp" -m "22.5" -q 1 -r

# Should appear on the browser page.

# Check the browser console for errors (F12 -> Console).

# Verify clientId is unique in Mosquitto logs:
logread | grep "New client"
```

Minimal code to complete the task:
```html
<!DOCTYPE html>
<html>
<head><title>MQTT Dashboard</title></head>
<body>
  <ul id="messages"></ul>
  <button id="publish">Send Test</button>

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
