# Task 6.2: Configuring TLS in Mosquitto

## Goal

Configure the Mosquitto 2.x MQTT broker to work over the encrypted TLS protocol on port 8883, using the certificates generated in Task 6.1.

## Requirements

1. Configure two listeners: `1883` (localhost, no TLS) and `8883` (with TLS)
2. Specify `cafile`, `certfile`, `keyfile` — paths to files from Task 6.1
3. Set the minimum TLS version: `tls_version tlsv1.2`
4. Restart Mosquitto and verify the broker starts without errors
5. Verify the connection with `mosquitto_pub` using the `--cafile` flag

## Checklist

- [ ] `listener 1883 localhost` — unencrypted port for localhost only
- [ ] `listener 8883` — TLS listener
- [ ] `cafile`, `certfile`, `keyfile` point to the correct files
- [ ] `tls_version tlsv1.2` is set
- [ ] `service mosquitto restart` completes without errors
- [ ] `mosquitto_pub --cafile ca.crt -h mqtt.home -p 8883 -t test -m hello` works
- [ ] Connection attempt without TLS on port 8883 fails

## How to Check Yourself

1. Check Mosquitto logs for errors:
   ```bash
   logread | grep mosquitto
   ```
2. Verify both ports are open:
   ```bash
   netstat -tlnp | grep mosquitto
   ```
3. Check TLS handshake:
   ```bash
   openssl s_client -connect mqtt.home:8883 -CAfile /etc/mosquitto/certs/ca.crt
   # Should output: Verify return code: 0 (ok)
   ```
4. Try connecting without a certificate — should get an error:
   ```bash
   mosquitto_pub -h mqtt.home -p 8883 -t test -m hello
   ```
