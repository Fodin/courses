# Task 9.1: WebSocket Listener

## Goal

Configure Mosquitto to work over the WebSocket protocol so browsers can connect to the broker directly.

## Requirements

1. Add a second listener in `mosquitto.conf` with `protocol websockets` on port 9001
2. Keep the main TCP listener (port 1883)
3. Ensure authentication works for both listeners
4. Verify Mosquitto starts without errors and port 9001 is open
5. Test the WebSocket connection using a utility or browser console

## Checklist

- [ ] Two `listener` blocks in `mosquitto.conf`
- [ ] Second listener has `protocol websockets`
- [ ] `allow_anonymous false` applies to all listeners
- [ ] Command `netstat -tlnp | grep 9001` shows open port
- [ ] No errors in Mosquitto logs at startup
- [ ] WebSocket connection established successfully (code 101)

## How to verify

```bash
# 1. Restart the broker:
/etc/init.d/mosquitto restart

# 2. Check the port:
netstat -tlnp | grep mosquitto

# 3. Check startup log:
logread | grep mosquitto | tail -20

# 4. Test WebSocket handshake (curl):
curl -v -N \
  -H "Upgrade: websocket" \
  -H "Connection: Upgrade" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://192.168.1.1:9001/
# Should get: HTTP/1.1 101 Switching Protocols
```

Minimal config to complete the task:
```conf
listener 1883
protocol mqtt

listener 9001
protocol websockets

allow_anonymous false
password_file /etc/mosquitto/passwd
```
