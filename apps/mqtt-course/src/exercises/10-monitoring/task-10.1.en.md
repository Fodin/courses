# Task 10.1: Broker $SYS Topics

## Goal

Study Mosquitto's built-in metrics system via $SYS topics and learn to retrieve real-time broker state data.

## Requirements

1. Subscribe to all $SYS topics with `mosquitto_sub -t '$SYS/#' -v`
2. Find and record current values for 6 key metrics: connected, messages/received, heap/current, uptime, subscriptions/count, retained/count
3. Ensure user `monitor` has permission to read `$SYS/#` via ACL
4. Set `sys_interval 30` in mosquitto.conf (reduce publish frequency)
5. Write a command that gets exactly one value from a specific topic and exits

## Checklist

- [ ] Command `mosquitto_sub -t '$SYS/#' -v` returns metrics
- [ ] ACL has `topic read $SYS/#` for user monitor
- [ ] `sys_interval 30` is set in mosquitto.conf
- [ ] Command `mosquitto_sub -t '$SYS/broker/clients/connected' -C 1 -W 5` works
- [ ] Values for all 6 metrics are recorded

## How to verify

```bash
# 1. Get connected client count:
mosquitto_sub -h localhost -u monitor -P monpass \
  -t '$SYS/broker/clients/connected' -C 1 -W 5

# 2. Get all metrics at once:
mosquitto_sub -h localhost -u monitor -P monpass \
  -t '$SYS/#' -v -W 15

# 3. Filter only heap metrics:
mosquitto_sub -h localhost -u monitor -P monpass \
  -t '$SYS/broker/heap/#' -v -W 10

# 4. Check sys_interval:
grep sys_interval /etc/mosquitto/mosquitto.conf
```

Expected output:
```
$SYS/broker/clients/connected 3
$SYS/broker/messages/received 1247
$SYS/broker/heap/current 524288
$SYS/broker/uptime 3600 seconds
$SYS/broker/subscriptions/count 12
$SYS/broker/messages/retained/count 45
```
