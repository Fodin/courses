# Task 10.3: collectd Integration

## Goal

Configure collectd on OpenWRT for automatic MQTT metrics collection via the exec plugin and saving to RRD files.

## Requirements

1. Install `collectd` and `collectd-mod-exec` via opkg
2. Create script `/usr/local/bin/mqtt-collectd.sh` in collectd exec format
3. Script should output PUTVAL lines for 5+ metrics: clients, messages_rx, messages_tx, heap, retained
4. Configure `/etc/collectd.conf`: add exec plugin, specify script path
5. Store RRD files in `/tmp/rrd/` (RAM, not flash)
6. Start collectd and verify metrics are being collected

## Checklist

- [ ] `opkg install collectd collectd-mod-exec` completed without errors
- [ ] Script is created, executable, runs as user `nobody` without root
- [ ] Script outputs lines like `PUTVAL "hostname/mqtt-broker/gauge-clients" N:42`
- [ ] `collectd.conf` contains correct `<Plugin exec>` block
- [ ] RRD DataDir points to `/tmp/rrd/`
- [ ] `/etc/init.d/collectd restart` completes without errors
- [ ] RRD files appear in `/tmp/rrd/` within 60 seconds

## How to verify

```bash
# 1. Verify installation:
collectd -t  # Config test (should be error-free)

# 2. Run the script manually as nobody:
su -s /bin/sh nobody -c '/usr/local/bin/mqtt-collectd.sh'
# Expect PUTVAL lines:
# PUTVAL "router/mqtt-broker/gauge-clients" N:3
# PUTVAL "router/mqtt-broker/derive-messages_rx" N:1247
# ...

# 3. Check for RRD files one minute after starting collectd:
ls /tmp/rrd/$(hostname)/mqtt-broker/

# 4. View last value from RRD:
rrdtool lastupdate /tmp/rrd/$(hostname)/mqtt-broker/gauge-clients.rrd

# 5. collectd log (exec plugin errors):
logread | grep collectd | tail -20
```

PUTVAL line format:
```
PUTVAL "hostname/plugin-instance/type-instance" N:value
PUTVAL "router/mqtt-broker/gauge-clients" N:42
PUTVAL "router/mqtt-broker/derive-messages_rx" N:12847
PUTVAL "router/mqtt-broker/bytes-heap" N:524288
```
