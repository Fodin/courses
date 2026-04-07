# Task 6.3: Mutual Authentication (mTLS)

## Goal

Configure mTLS (mutual TLS) in Mosquitto, where the server verifies the client's certificate. Use the client certificate CN as the username for ACL.

## Requirements

1. Add `require_certificate true` and `use_identity_as_username true` to the configuration
2. Configure ACL rules based on certificate CNs (`sensor-01`, `gw-01`)
3. Create two client certificates with different CNs and different ACL permissions
4. Verify that connection without a certificate is rejected by the broker
5. Verify that a certificate with CN `sensor-01` can publish but not subscribe to other topics

## Checklist

- [ ] `require_certificate true` added to config
- [ ] `use_identity_as_username true` added to config
- [ ] ACL file contains rules for `sensor-01` (write) and `gw-01` (read)
- [ ] Connection without certificate is rejected (`Connection Refused`)
- [ ] `sensor-01.crt` + `sensor-01.key` work with correct topics
- [ ] `gw-01.crt` + `gw-01.key` can only read

## How to Check Yourself

1. Verify that connection without a certificate is rejected:
   ```bash
   mosquitto_pub --cafile ca.crt -h mqtt.home -p 8883 -t test -m hello
   # Expected: Connection Refused
   ```

2. Connect with the `sensor-01` certificate:
   ```bash
   mosquitto_pub \
     --cafile ca.crt --cert sensor-01.crt --key sensor-01.key \
     -h mqtt.home -p 8883 \
     -t sensors/01/temp -m "22.5"
   ```

3. Verify that `sensor-01` cannot read other topics:
   ```bash
   mosquitto_sub \
     --cafile ca.crt --cert sensor-01.crt --key sensor-01.key \
     -h mqtt.home -p 8883 -t "sensors/#"
   # Should get an authorization error
   ```

4. Verify that `gw-01` can read all sensor data:
   ```bash
   mosquitto_sub \
     --cafile ca.crt --cert gw-01.crt --key gw-01.key \
     -h mqtt.home -p 8883 -t "sensors/#" -v
   ```
