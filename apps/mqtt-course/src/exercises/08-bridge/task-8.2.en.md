# Task 8.2: Configuring a Bridge in Mosquitto

## Goal

Configure an MQTT Bridge in Mosquitto to connect the local OpenWRT broker with a remote broker.
Understand the main configuration parameters and their purpose.

## Requirements

1. Configure a `connection` named `bridge-to-cloud`
2. Specify the `address` — remote broker address and port
3. Add at least two `topic` rules: one `out`, one `in`
4. Configure authentication: `remote_username`, `remote_password`
5. Configure TLS: `bridge_cafile` (if TLS is used on the remote broker)
6. Add `start_type automatic` and `keepalive_interval`

## Checklist

- [ ] `connection bridge-to-cloud` — bridge name is set
- [ ] `address` — address and port are correct
- [ ] At least one `topic ... out` rule and one `... in` rule
- [ ] `remote_username` and `remote_password` are set
- [ ] `start_type automatic` — bridge auto-reconnects
- [ ] `keepalive_interval 60` — interval is set
- [ ] Component shows parameters with descriptions and generates the config

## How to verify

1. Check the bridge connection in the logs after starting:
   ```bash
   logread | grep mosquitto | grep -i "bridge\|connect"
   ```
2. Check the connection status via $SYS:
   ```bash
   mosquitto_sub -t '$SYS/broker/connection/bridge-to-cloud/state' -C 1
   # Should return 1 (connected) or 0 (disconnected)
   ```
3. Publish a message locally and verify it appears on the remote broker:
   ```bash
   mosquitto_pub -t sensors/test -m "bridge_test"
   # On the remote: mosquitto_sub -t sensors/test -C 1
   ```
