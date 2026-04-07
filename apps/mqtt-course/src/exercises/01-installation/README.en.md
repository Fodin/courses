# Level 1: Installing Mosquitto on OpenWRT

## OpenWRT and the opkg Package Manager

OpenWRT is a Linux distribution for routers. Instead of apt/yum, it uses **opkg** (Open Package Manager). Packages are stored in online repositories and downloaded directly to the device.

```bash
# Required before installing any packages:
opkg update
```

💡 Package lists are cached in `/var/opkg-lists/`. After a router reboot the cache is erased (tmpfs), so `opkg update` must be repeated.

---

## Available Mosquitto Packages

OpenWRT offers two options:

| Package | TLS | Size | When to use |
|-------|-----|------|------------|
| `mosquitto-nossl` | ❌ | ~100 KB | Isolated LAN, no external connections |
| `mosquitto` (full) | ✅ | ~300 KB | External clients, encryption required |
| `mosquitto-client-nossl` | ❌ | ~80 KB | CLI utilities (pub/sub) without TLS |
| `mosquitto-client` | ✅ | ~100 KB | CLI utilities with TLS |

To start — install `mosquitto-nossl`. If TLS is needed later, reinstall to the full version.

```bash
opkg update
opkg install mosquitto-nossl
opkg install mosquitto-client-nossl
```

---

## Managing the Service

OpenWRT uses **init.d** for service management:

```bash
/etc/init.d/mosquitto enable   # auto-start on boot
/etc/init.d/mosquitto start    # start now
/etc/init.d/mosquitto stop     # stop
/etc/init.d/mosquitto restart  # restart
/etc/init.d/mosquitto status   # check status
```

📌 `enable` only creates a symlink in `/etc/rc.d/` — it doesn't start the service immediately. A separate `start` is needed after `enable`.

---

## Mosquitto File Structure

```
/etc/mosquitto/
├── mosquitto.conf    ← main config (edit this)
├── passwd            ← password database (created by mosquitto_passwd)
└── acl               ← access control (create manually)

/usr/sbin/mosquitto   ← broker executable

/usr/bin/
├── mosquitto_pub     ← publish messages
└── mosquitto_sub     ← subscribe to topics

/var/run/mosquitto.pid  ← process PID
/var/lib/mosquitto/     ← persistence data (if enabled)
```

---

## Verification After Installation

```bash
# 1. Process status
ps | grep mosquitto

# 2. Is port 1883 listening?
netstat -tlnp | grep 1883

# 3. Test pub/sub (two terminals)
mosquitto_sub -h 127.0.0.1 -t "test/#" -v &
mosquitto_pub -h 127.0.0.1 -t "test/hello" -m "OK"
# Expected output: test/hello OK
```

---

## OpenWRT Specifics

⚠️ **Flash memory is limited.** On most routers, flash is 4–16 MB. Mosquitto with dependencies takes ~300 KB, but config files and logs must not grow uncontrollably.

⚠️ **Logs are written to syslog.** By default `log_dest syslog` — read via `logread | grep mosquitto`. The file is in `/tmp` (tmpfs) — safer for flash.

⚠️ **Persistence is disabled by default.** Retained messages are lost on reboot. If persistence is needed — use `/tmp` (RAM) or an external USB drive.

---

## ⚠️ Common Mistakes

**❌ Forgetting opkg update**
```bash
opkg install mosquitto-nossl
# Unknown package 'mosquitto-nossl'
```
✅ Always run `opkg update` before installing.

**❌ Confusing nossl and full versions**
```bash
# After installing the full version, trying to specify TLS in nossl config
cafile /etc/mosquitto/ca.crt  # ERROR: nossl version doesn't support TLS
```
✅ Check the version: `mosquitto --version | grep 'SSL'`.
