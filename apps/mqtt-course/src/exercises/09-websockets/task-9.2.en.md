# Task 9.2: Reverse Proxy (uhttpd/nginx)

## Goal

Configure nginx on OpenWRT to proxy WebSocket traffic to Mosquitto, combining MQTT and web interface on a single port (443/HTTPS).

## Requirements

1. Install nginx (`opkg install nginx`)
2. Configure Mosquitto so the WebSocket listener only accepts connections from `127.0.0.1:9001`
3. Configure nginx: `location /mqtt` proxies WebSocket to `127.0.0.1:9001`
4. Be sure to add `Upgrade` and `Connection` headers in the proxy block
5. Set `proxy_read_timeout` to at least 3600 seconds
6. Verify the browser connects via `ws://router-ip/mqtt`

## Checklist

- [ ] nginx installed and running (`/etc/init.d/nginx status`)
- [ ] Mosquitto WebSocket listener bound to `127.0.0.1` or `127.0.0.1:9001`
- [ ] nginx.conf contains `location /mqtt` with `proxy_pass http://127.0.0.1:9001`
- [ ] Headers `Upgrade` and `Connection "upgrade"` are present
- [ ] `proxy_read_timeout 3600s` is set
- [ ] MQTT.js connects: `mqtt.connect('ws://192.168.1.1/mqtt')`

## How to verify

```bash
# 1. nginx status:
/etc/init.d/nginx status

# 2. Test nginx config:
nginx -t

# 3. Connection via nginx (port 80, path /mqtt):
# In the browser console:
const c = mqtt.connect('ws://192.168.1.1/mqtt', {username:'u', password:'p'})
c.on('connect', () => console.log('OK!'))

# 4. Header check (should be 101):
curl -v -N \
  -H "Upgrade: websocket" \
  -H "Connection: Upgrade" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://192.168.1.1/mqtt

# 5. nginx log:
tail -f /var/log/nginx/error.log
```

Minimal nginx configuration:
```nginx
server {
    listen 80;
    location /mqtt {
        proxy_pass http://127.0.0.1:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```
