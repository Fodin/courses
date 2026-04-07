# Task 11.3: Connection Management

## Goal

Configure session and keepalive parameters for optimal operation of IoT devices that periodically enter sleep mode.

## Requirements

1. Create two users: `dashboard` (clean session) and `sensor1` (persistent session)
2. Configure different ACL permissions for each user
3. Enable persistence (`persistence true`) with storage in `/tmp/mosquitto/`
4. Configure `persistent_client_expiration 1d`
5. Configure `max_keepalive 300`
6. Verify: after `sensor1` disconnects, the broker should retain subscriptions
7. After `sensor1` reconnects — it should receive accumulated messages

## Checklist

- [ ] `persistence true` with `persistence_location /tmp/mosquitto/`
- [ ] `persistent_client_expiration 1d`
- [ ] `max_keepalive 300`
- [ ] Directory `/tmp/mosquitto/` created and writable
- [ ] User sensor1 connects with `clean=false` (persistent)
- [ ] After sensor1 disconnects, persistence.db exists in `/tmp/mosquitto/`
- [ ] After sensor1 reconnects, it receives accumulated messages

## How to verify

```bash
# Step 1: Connect sensor1 as persistent (in one terminal):
mosquitto_sub -h localhost -u sensor1 -P pass \
  -i sensor1-device \
  -t "commands/#" \
  --clean-session 0  # false = persistent session

# Step 2: Disconnect sensor1 (Ctrl+C)

# Step 3: While sensor1 is offline — publish a command (in another terminal):
mosquitto_pub -h localhost -u admin -P pass \
  -t "commands/sensor1/config" \
  -m '{"interval":30}' -q 1

# Step 4: Reconnect sensor1:
mosquitto_sub -h localhost -u sensor1 -P pass \
  -i sensor1-device \
  -t "commands/#" \
  --clean-session 0
# Expect: immediately receive the message {"interval":30}

# Step 5: Check persistence file:
ls -la /tmp/mosquitto/
# Should have mosquitto.db file

# Step 6: Verify keepalive limit:
# A client with keepalive=600 should be rejected (exceeds max_keepalive=300)
mosquitto_sub -h localhost -u sensor1 -P pass \
  -t "test" --keepalive 600
# Mosquitto 2.x will set keepalive = min(client_keepalive, max_keepalive) = 300
```
