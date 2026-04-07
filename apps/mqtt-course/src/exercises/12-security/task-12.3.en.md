# Task 12.3: MQTT Security Checklist

## Goal

Perform a full security audit of the Mosquitto broker and fix all critical and high-priority issues.

## Requirements

Check and complete all items:

### CRITICAL (mandatory)
1. `allow_anonymous false` in mosquitto.conf
2. All users in password_file have passwords of length ≥12 characters
3. ACL configured: each user has access only to their own topics
4. Port 1883 not accessible from WAN (verify via nmap)
5. TLS configured (port 8883) if external access is used

### HIGH PRIORITY
6. `bind_address` set to LAN interface
7. `max_connections` set explicitly
8. `message_size_limit` set (no more than 8192 for IoT)
9. `memory_limit` set

### MEDIUM PRIORITY
10. Rate limiting via iptables
11. Monitoring via $SYS or collectd
12. Authentication error logging

## Checklist

- [ ] All critical items (1-5) completed
- [ ] All high-priority items (6-9) completed
- [ ] At least 2 of 3 medium items (10-12) completed
- [ ] Final mosquitto.conf documented
- [ ] Test passed: unknown client cannot connect
- [ ] Test passed: client cannot publish to another's topic

## How to verify

```bash
# === Test 1: No anonymous access ===
mosquitto_pub -h 192.168.1.1 -t test -m hello
# Expect: Connection Refused: not authorised

# === Test 2: Wrong password is rejected ===
mosquitto_pub -h 192.168.1.1 -u sensor1 -P wrongpass -t test -m hello
# Expect: Connection Refused: not authorised

# === Test 3: ACL — client can't write to another's topic ===
# sensor1 can only write to sensors/room1/#
mosquitto_pub -h 192.168.1.1 -u sensor1 -P pass1 \
  -t "sensors/room2/temperature" -m "22.5"
# Expect: silent (ACL blocked)

mosquitto_pub -h 192.168.1.1 -u sensor1 -P pass1 \
  -t "sensors/room1/temperature" -m "22.5"
# Expect: success (ACL allowed)

# === Test 4: Port blocked from WAN ===
# From an external IP or via VPN to another address:
nmap -p 1883 <external-IP>
# Expect: filtered or closed (not open)

# === Test 5: Connection limit ===
# Connect more than max_connections clients:
for i in $(seq 1 60); do
  mosquitto_sub -h 192.168.1.1 -u sensor1 -P pass1 \
    -t test -i "test-$i" &
done
wait
# Clients beyond the limit should get Connection Refused
```

Final config (template for verification):
```conf
# /etc/mosquitto/mosquitto.conf
listener 1883
protocol mqtt
bind_address 192.168.1.1          # LAN only
allow_anonymous false              # No anonymous access
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl
max_connections 50                 # Limit
message_size_limit 4096            # 4 KB max
memory_limit 25000000             # 25 MB heap
log_type error warning
log_dest syslog
```
