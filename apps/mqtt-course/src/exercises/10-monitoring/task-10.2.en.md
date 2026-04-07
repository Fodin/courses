# Task 10.2: Monitoring Scripts

## Goal

Create a shell script for OpenWRT that collects Mosquitto metrics and sends an alert if the broker is overloaded.

## Requirements

1. Write a script `/usr/local/bin/mqtt-stats.sh` with a `get_metric()` function
2. The script should output: clients, messages/received, heap/current, uptime, retained/count, messages/publish/dropped
3. Add an alert threshold: if `clients > 50` — publish to `system/mqtt/alert`
4. Add CSV logging: `/tmp/mqtt-metrics.csv` (timestamp + all metrics)
5. Add the script to cron: run every 5 minutes
6. Implement log rotation (no more than 1000 lines)

## Checklist

- [ ] Script is created and executable (`chmod +x`)
- [ ] `get_metric()` function uses `-C 1 -W 5`
- [ ] All 6 metrics are output on run
- [ ] Alert is sent via `mosquitto_pub` when threshold is exceeded
- [ ] CSV log writes to `/tmp/` (not flash)
- [ ] Cron runs the script: `*/5 * * * * /usr/local/bin/mqtt-stats.sh`
- [ ] Rotation implemented: `tail -1001 "$LOG" > ...`

## How to verify

```bash
# 1. Run the script manually:
/usr/local/bin/mqtt-stats.sh

# Expected output:
# === Mosquitto Status ===
# Clients connected: 3
# Messages received:  1247
# Heap memory:         524288 bytes
# ...

# 2. Check CSV:
head -5 /tmp/mqtt-metrics.csv
# timestamp,clients,msg_rx,msg_tx,heap,retained,dropped

# 3. Check cron:
crontab -l | grep mqtt

# 4. Simulate alert (connect 50+ clients or lower threshold for testing):
# Change MAX_CLIENTS=1 and run — should publish an alert
mosquitto_sub -h localhost -u monitor -P monpass \
  -t 'system/mqtt/alert' -C 1 -W 10
```
