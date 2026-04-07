# Task 11.2: Mosquitto Tuning

## Goal

Apply key Mosquitto optimization parameters in `mosquitto.conf` for a router with 64-128 MB RAM.

## Requirements

1. Set `max_connections` according to available RAM (formula from task 11.1)
2. Limit `message_size_limit` to a reasonable value (no more than 8192 for IoT)
3. Configure `max_queued_messages 100` and `max_queued_bytes 524288`
4. Set `memory_limit` (40% of RAM in bytes)
5. Increase `sys_interval` to 30 seconds
6. Configure lightweight logging: `error warning` only

## Checklist

- [ ] `max_connections` is set explicitly (not left at -1)
- [ ] `message_size_limit` is set explicitly (not left at default 268 MB)
- [ ] `max_queued_messages` ≤ 500
- [ ] `max_queued_bytes` is set (Mosquitto 2.x)
- [ ] `memory_limit` is set (not 0)
- [ ] `sys_interval 30` or higher
- [ ] `log_type error warning` (no debug/information)
- [ ] Mosquitto runs correctly after restart

## How to verify

```bash
# 1. Verify config application:
mosquitto -c /etc/mosquitto/mosquitto.conf -v 2>&1 | head -20
# Look for parameter application lines

# 2. After connecting several clients — monitor memory:
cat /proc/$(pidof mosquitto)/status | grep VmRSS

# 3. Check heap via $SYS:
mosquitto_sub -h localhost -u admin -P pass \
  -t '$SYS/broker/heap/current' -C 1 -W 5

# 4. Try sending a message larger than message_size_limit:
python3 -c "print('x' * 10000)" | \
  mosquitto_pub -h localhost -u user -P pass \
  -t test/big -s
# Should get an error: Message too large

# 5. Verify sys_interval works (metrics update every 30s):
mosquitto_sub -h localhost -u admin -P pass \
  -t '$SYS/broker/uptime' -v -W 65
# Should output 2 values with ~30 sec interval
```
