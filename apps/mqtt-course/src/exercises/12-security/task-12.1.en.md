# Task 12.1: Firewall Rules for MQTT

## Goal

Configure firewall rules on OpenWRT that allow MQTT only from the local network and block all WAN access.

## Requirements

1. Verify that port 1883 is not accessible from the internet (check via nmap from an external host)
2. Add an explicit blocking rule via UCI: `src='wan'`, `dest_port='1883 9001'`, `target='DROP'`
3. Set `bind_address` in mosquitto.conf to the LAN interface IP (192.168.1.1)
4. Add rate limiting via iptables: no more than 5 new connections per minute from a single IP
5. Verify that connections from LAN (another device on the network) work

## Checklist

- [ ] Block-MQTT-WAN rule added via UCI
- [ ] `uci commit firewall && /etc/init.d/firewall restart` executed
- [ ] `bind_address 192.168.1.1` added to mosquitto.conf
- [ ] After restart, Mosquitto listens only on 192.168.1.1
- [ ] Rate limiting via iptables added for port 1883
- [ ] From a LAN device: `mosquitto_sub -h 192.168.1.1 -t test` works
- [ ] From an external IP: port 1883 — `filtered` or `closed` (not `open`)

## How to verify

```bash
# 1. Verify bind_address applied:
netstat -tlnp | grep 1883
# Should show: 192.168.1.1:1883, not 0.0.0.0:1883

# 2. Check UCI rules:
uci show firewall | grep -A5 "Block-MQTT"

# 3. Check iptables:
iptables -L INPUT -n -v | grep 1883

# 4. Check from LAN (another host):
mosquitto_sub -h 192.168.1.1 -u user -P pass -t test/#

# 5. Rate limiting test (run 10 times quickly):
for i in $(seq 1 10); do
  mosquitto_pub -h 192.168.1.1 -u bad -P wrong -t x -m x 2>/dev/null &
done
wait
# After 5 attempts — should be blocked

# 6. View blocked packets in logs:
dmesg | grep "MQTT-BLOCKED\|MQTT-RATE" | tail -10
```
