# Task 6.1: Generating PKI Infrastructure for MQTT TLS

## Goal

Master creating self-signed certificates using OpenSSL for configuring TLS encryption in Mosquitto: root CA, server certificate, and client certificate for mTLS.

## Requirements

1. Create a root CA: generate `ca.key` (2048 bit) and self-signed `ca.crt` (10 years)
2. Create a server certificate: `server.key`, `server.csr`, sign `server.crt` via CA
3. Create a client certificate with CN=`sensor-01`: `client.key`, `client.csr`, `client.crt`
4. Place files in `/etc/mosquitto/certs/` with correct access permissions
5. Visualize the process: the component should show all steps and generated files

## Checklist

- [ ] `ca.key` — CA private key, 2048 bit
- [ ] `ca.crt` — self-signed CA certificate, 10 year validity
- [ ] `server.key` and `server.crt` — server certificate, signed by CA
- [ ] `client.key` and `client.crt` — client certificate `sensor-01`, signed by CA
- [ ] Server certificate CN matches the broker hostname
- [ ] `server.key` has permissions `600`, owner `mosquitto`
- [ ] Component displays steps with commands and generated files

## How to Check Yourself

1. Run the commands from the solution step by step — there should be no errors
2. Check the certificate: `openssl x509 -in server.crt -text -noout | grep CN`
3. Verify the certificate is signed by our CA: `openssl verify -CAfile ca.crt server.crt`
   Should return `server.crt: OK`
4. Check the client certificate: `openssl verify -CAfile ca.crt client.crt`
