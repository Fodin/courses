# Task 11.1: Embedded System Resource Limits

## Goal

Understand the router's resource constraints and estimate how many clients and messages your device can handle.

## Requirements

1. Determine your router's specs: RAM, Flash, CPU
2. Calculate the maximum MQTT clients using the formula: `free_ram × 0.4 / 0.025`
3. Determine the appropriate `message_size_limit` for your IoT scenario
4. List the Mosquitto features that should be disabled on a budget router (≤32 MB RAM)
5. Write a `mosquitto.conf` with limits appropriate for your device's specs

## Checklist

- [ ] Device specs noted: RAM, Flash, CPU model
- [ ] `max_connections` calculated using the formula
- [ ] `message_size_limit` determined (not left at default)
- [ ] `memory_limit` written (at least 20% and no more than 40% of RAM)
- [ ] Config applied and Mosquitto starts without errors

## How to verify

```bash
# Device specs:
cat /proc/meminfo | grep MemTotal
cat /proc/cpuinfo | grep "model name\|cpu MHz"
df -h /overlay   # Free flash space

# Current Mosquitto consumption:
top -b -n 1 | grep mosquitto
# Or:
cat /proc/$(pidof mosquitto)/status | grep -E "VmRSS|VmPeak"

# Free memory after startup:
free -m

# Verify settings are applied:
mosquitto -c /etc/mosquitto/mosquitto.conf --help 2>/dev/null || \
  mosquitto -c /etc/mosquitto/mosquitto.conf -v & sleep 2; kill %1
```

Reference table (minimum recommendations):

| RAM | max_connections | memory_limit | message_size_limit |
|---|---|---|---|
| 32 MB | 10 | 8 MB | 512 |
| 64 MB | 30 | 20 MB | 4096 |
| 128 MB | 50 | 40 MB | 8192 |
| 256 MB | 150 | 80 MB | 65536 |
