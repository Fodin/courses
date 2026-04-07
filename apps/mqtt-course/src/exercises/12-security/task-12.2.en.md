# Task 12.2: Rate Limiting and Attack Protection

## Goal

Configure multi-layered protection against DoS attacks and password bruteforce: through Mosquitto, iptables, and an automatic ban script.

## Requirements

1. Configure `per_listener_settings true` with different `max_connections` for TCP and WebSocket listeners
2. Add iptables rate limiting: no more than 5 new TCP connections to port 1883 per minute from a single IP
3. Create script `/usr/local/bin/mqtt-autoban.sh` — automatically bans IPs with 5+ authentication errors
4. Add the script to cron: run every 5 minutes
5. Configure logging of banned IPs via `logger`

## Checklist

- [ ] `per_listener_settings true` added to mosquitto.conf
- [ ] Listener 1883 has `max_connections 50`
- [ ] Listener 9001 has `max_connections 20`
- [ ] iptables rate limiting applied for port 1883
- [ ] Script `mqtt-autoban.sh` created and executable (`chmod +x`)
- [ ] Script added to crontab: `*/5 * * * * ...`
- [ ] Script test-banned an IP with authentication errors

## How to verify

```bash
# 1. Check per_listener_settings:
grep -A3 "listener 1883" /etc/mosquitto/mosquitto.conf
# Should show max_connections 50

# 2. Test rate limiting — quickly create > 5 connections:
for i in $(seq 1 8); do
  mosquitto_pub -h 192.168.1.1 -u test -P test -t x -m x 2>&1 &
done
wait
# After the 5th attempt — should get Connection refused

# 3. Run the ban script manually:
/usr/local/bin/mqtt-autoban.sh

# 4. Check if IP is banned (if there were auth errors):
iptables -L INPUT -n | grep DROP

# 5. Check cron:
crontab -l | grep mqtt-autoban

# 6. Check log:
logread | grep mqtt-autoban | tail -10

# 7. Unban an IP for testing:
iptables -D INPUT -s <IP> -j DROP
```

Autoban script structure:
```sh
#!/bin/sh
THRESHOLD=5
FAILED_IPS=$(logread | grep "authentication failed" | \
  grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | \
  sort | uniq -c | awk -v t="$THRESHOLD" '$1>=t{print $2}')

for IP in $FAILED_IPS; do
  iptables -A INPUT -s "$IP" -j DROP
  logger -t mqtt-autoban "Banned $IP"
done
```
