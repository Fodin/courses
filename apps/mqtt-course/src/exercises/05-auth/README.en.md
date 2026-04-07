# Level 5: Authentication

## Why Authentication is Needed

By default, Mosquitto accepts connections from **any** client without verification. On an internal network this is somewhat acceptable, but even there:

- A neighbor on the network can subscribe to `#` and read all your data
- Anyone can publish to `device/relay/cmd` = `ON` and turn anything on

Authentication in Mosquitto is three-tiered: password file → ACL → plugins.

## Password File

The simplest method — a password file. Passwords are stored in hashed form.

```bash
# Create a user (will prompt for password)
mosquitto_passwd -c /etc/mosquitto/passwd admin
mosquitto_passwd /etc/mosquitto/passwd sensor1

# Add with explicit password (-b = batch mode)
mosquitto_passwd -b /etc/mosquitto/passwd sensor2 s3cr3t

# Delete a user
mosquitto_passwd -D /etc/mosquitto/passwd sensor1
```

File contents (passwords are hashed with SHA512+salt):
```
admin:$7$101$...hash...
sensor1:$7$101$...hash...
```

Connect in `mosquitto.conf`:
```
allow_anonymous false
password_file /etc/mosquitto/passwd
```

📌 After changing the file, the broker needs to reload config or restart:
```bash
kill -HUP $(pidof mosquitto)   # or
mosquitto reload                # Mosquitto 2.x
```

## ACL — Access Control Lists

ACL controls **what** users can do after authorization. File format:

```
# Global rules (for all authenticated users)
topic read $SYS/#

# Rules for a specific user
user admin
topic readwrite #

user sensor1
topic write home/sensor1/#
topic read home/sensor1/cmd/#

user dashboard
topic read home/#
topic read $SYS/#
```

Keywords:
- `read` — read only (subscribe)
- `write` — write only (publish)
- `readwrite` — read and write
- `deny` — explicit denial

Connect in `mosquitto.conf`:
```
acl_file /etc/mosquitto/acl
```

⚠️ By default, if an ACL file is specified — access to a topic without explicit permission is **denied**.

## Authentication Plugins

For dynamic authentication (users in a database, Redis, JWT), plugins are used.

Mosquitto 2.x has the built-in `auth_plugin` mechanism:

```
# mosquitto.conf (Mosquitto 2.x)
plugin /usr/lib/mosquitto_dynamic_security.so
plugin_opt_config_file /etc/mosquitto/dynamic-security.json
```

Popular plugins:
- **mosquitto-go-auth** — supports PostgreSQL, MySQL, Redis, JWT, HTTP
- **Dynamic Security Plugin** — built into Mosquitto 2.x, managed via MQTT

On OpenWRT, due to RAM and flash limitations, preferred options are:
1. Password file + ACL (minimal resources)
2. Dynamic Security Plugin (built-in, no external dependencies)

## ⚠️ Common Mistakes

❌ **allow_anonymous true with password_file** — if `allow_anonymous false` is not specified, anonymous clients will still connect.

❌ **ACL without user applies to everyone** — the line `topic read $SYS/#` without a preceding `user` is a global rule.

❌ **Excessive ACL permissions** — `user sensor1` + `topic readwrite #` gives this sensor access to the entire broker.

❌ **Passwords in plain text in config** — never specify a password in `mosquitto.conf`. Only use `mosquitto_passwd`.
