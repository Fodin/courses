# Level 5: Authentication — Extended Theory

## MQTT Security Model

MQTT itself does not provide encryption (that's the job of TLS/SSL). But the protocol supports `username` and `password` fields in the CONNECT packet. Mosquitto uses them for authentication.

Protection levels (from simple to complex):

```
1. allow_anonymous false     — require login/password
2. password_file             — verify password in file
3. acl_file                  — restrict topic access
4. TLS                       — encrypt the connection (level 6)
5. mTLS                      — mutual certificate authentication (level 6)
```

## Password File: Details

### Storage Format

Mosquitto 2.x uses **PBKDF2-SHA512** for password hashing:

```
username:$7$iterations$salt$hash
```

Example real entry:
```
admin:$7$101$5qOkbrpSgepR1Tld$...long_hash...
```

`$7` — algorithm version (bcrypt-compatible Mosquitto format)
`101` — number of iterations (default in Mosquitto 2.x)

Old format (Mosquitto 1.x):
```
username:$6$salt$sha512_hash
```

### Working with mosquitto_passwd

```bash
# Create a NEW file and add a user
# -c = create (will overwrite existing!)
mosquitto_passwd -c /etc/mosquitto/passwd admin

# Add a user to an existing file
mosquitto_passwd /etc/mosquitto/passwd sensor1

# Batch mode (-b = batch, password as argument)
# CAREFUL: password visible in shell history
mosquitto_passwd -b /etc/mosquitto/passwd sensor2 mypassword

# Delete a user
mosquitto_passwd -D /etc/mosquitto/passwd sensor1

# Update password (just add again — will overwrite)
mosquitto_passwd /etc/mosquitto/passwd admin
```

### Applying Changes Without Restart

```bash
# Send SIGHUP to the process — reloads config and auth files
kill -HUP $(cat /var/run/mosquitto.pid)
# or
kill -HUP $(pgrep mosquitto)

# On OpenWRT via init.d:
/etc/init.d/mosquitto reload
```

### Configuration in mosquitto.conf

```
# Disallow anonymous access
allow_anonymous false

# Password file
password_file /etc/mosquitto/passwd

# Optional: allow anonymous read-only $SYS
# (dangerous — don't use in production)
# allow_anonymous true
# password_file /etc/mosquitto/passwd
```

📌 Verification order: if `allow_anonymous false` and the client didn't provide credentials — rejected BEFORE ACL check.

## ACL: Detailed Format

### File Syntax

The ACL file is processed top to bottom. The first matching rule is applied.

```
# This is a comment

# === Global rules (for all clients, including anonymous) ===
topic read $SYS/#                    # everyone can read statistics

# === Rules for a specific user ===
user admin
topic readwrite #                    # full access to all topics

user sensor_kitchen
topic write home/kitchen/#           # can only write to their zone
topic read home/kitchen/cmd/#        # can read commands

user dashboard
topic read home/#                    # read-only for the whole house
topic read $SYS/broker/clients/#    # client monitoring

# === Rules for patterns (with client ID substitution) ===
pattern write sensor/%c/data         # client can only write to their topic
# %c = client_id, %u = username
```

### Special Variables in pattern

```
%c — client_id (client identifier)
%u — username
```

Example with `pattern`:
```
# Sensor with client_id="esp32-kitchen" can only publish to esp32-kitchen/#
pattern write sensor/%c/+
```

If client `esp32-kitchen` publishes to `sensor/esp32-kitchen/temp` → allowed.
If the same client publishes to `sensor/esp32-living/temp` → denied.

### Rule Hierarchy

1. `allow_anonymous false` → anonymous rejected without ACL check
2. `user X` → following `topic` rules apply to user X
3. `pattern` → applies to all users with substitution
4. `topic` without preceding `user` → global rules
5. No match → access **denied**

```
# IMPORTANT: no rule = denied
# You need to explicitly allow each required topic
```

### Full Smart Home Example

```
# /etc/mosquitto/acl

# Anonymous can only read statistics (if allow_anonymous true)
topic read $SYS/#

# Administrator — full access
user admin
topic readwrite #

# Sensors — write only their zone, read commands
user sensor_kitchen
topic write home/kitchen/sensor/#
topic read home/kitchen/cmd

user sensor_living
topic write home/living/sensor/#
topic read home/living/cmd

# Dashboard — read-only everything
user dashboard
topic read home/#
topic read $SYS/broker/clients/connected
topic read $SYS/broker/messages/sent

# Automation controller — reads everything, writes commands
user automation
topic read home/#
topic write home/+/cmd
topic write device/+/cmd

# Bridge (bridge connection) — full access
user bridge_slave
topic readwrite #

# Pattern: each client only in their own space
# client_id must match the device name
pattern write devices/%c/#
pattern read devices/%c/cmd/#
```

## Dynamic Security Plugin (Mosquitto 2.x)

Built-in plugin for dynamic user and ACL management via MQTT without restart.

### Initialization

```bash
# Create initial configuration
mosquitto_ctrl dynsec init /etc/mosquitto/dynamic-security.json admin admin_password

# Start with the plugin
# In mosquitto.conf:
plugin /usr/lib/mosquitto_dynamic_security.so
plugin_opt_config_file /etc/mosquitto/dynamic-security.json
```

### Management via MQTT Topics

```bash
# Create a role
mosquitto_ctrl dynsec createRole sensors
mosquitto_ctrl dynsec addRoleACL sensors publishClientSend "sensor/+/data" allow
mosquitto_ctrl dynsec addRoleACL sensors subscribeLiteral "sensor/+/cmd" allow

# Create a user and assign a role
mosquitto_ctrl dynsec createClient esp32_01 -p mypassword
mosquitto_ctrl dynsec addClientRole esp32_01 sensors
```

Or directly via MQTT:
```bash
# All management operations via topic $CONTROL/dynamic-security/v1
mosquitto_pub -t '$CONTROL/dynamic-security/v1' \
  -m '{"commands":[{"command":"createClient","username":"esp32_01","password":"pass"}]}'
```

### Role Concept

Dynamic Security introduces **roles** — sets of ACL rules:

```
Role "sensors" → can write sensor/+/data, read sensor/+/cmd
Role "dashboard" → can read home/#, read $SYS/#

User esp32_01 → role "sensors"
User grafana → role "dashboard"
```

This allows changing permissions for hundreds of devices by modifying a single role.

## mosquitto-go-auth: External Backends

Popular third-party plugin for authentication via external systems.

### Supported Backends

| Backend | Description |
|---|---|
| files | Files (analog of built-in) |
| postgres | PostgreSQL |
| mysql | MySQL/MariaDB |
| sqlite3 | SQLite |
| redis | Redis |
| http | HTTP API (any service) |
| jwt | JSON Web Tokens |
| grpc | gRPC service |

### Example: HTTP Authentication

```
# mosquitto.conf
plugin /usr/lib/mosquitto_go_auth.so
plugin_opt_backends http
plugin_opt_http_host localhost
plugin_opt_http_port 8080
plugin_opt_http_getuser_uri /auth/user
plugin_opt_http_aclcheck_uri /auth/acl
```

When a client connects, Mosquitto makes a POST request to your HTTP API:
```
POST /auth/user
{"username": "sensor1", "password": "mypass"}
→ 200 OK (allowed) / 403 (denied)
```

### On OpenWRT: Practical Limitations

- mosquitto-go-auth requires glibc or musl with CGO support
- OpenWRT uses musl, binaries are often incompatible
- Recommendation: for OpenWRT use the built-in Dynamic Security Plugin or files

## Storing Passwords on OpenWRT

Flash on OpenWRT is limited and can be wiped on reset. Recommended:

```bash
# Store auth files on overlay (persist across updates):
/etc/mosquitto/passwd      # ✅ persistent overlay
/etc/mosquitto/acl         # ✅ persistent overlay

# Do NOT store in /tmp/ — cleared on reboot
/tmp/mosquitto/passwd      # ❌ will be lost on reboot
```

Overlay configuration on OpenWRT:
```bash
# /etc/mosquitto/mosquitto.conf
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl

# Create files on first launch via init script
```

## ⚠️ Common Mistakes

❌ **allow_anonymous true + password_file:**
```
allow_anonymous true          # anonymous pass through!
password_file /etc/passwd     # only additionally checks authorized
```
✅ Always `allow_anonymous false` if using authentication.

❌ **ACL file exists but is empty:**
```
acl_file /etc/mosquitto/acl   # file exists but empty
# Result: NO ONE can access any topic!
```
✅ With an empty ACL file, all topics are denied. Add at least:
```
user admin
topic readwrite #
```

❌ **Forgot to update broker after changing passwd:**
```bash
# Added a user, try to connect — "Authentication failed"
mosquitto_passwd /etc/mosquitto/passwd newuser
# Need: kill -HUP or reload!
```

❌ **Too broad ACL permissions:**
```
user sensor1
topic readwrite #    # this sensor can now do everything!
```
✅ Principle of least privilege: allow only the necessary topics.

❌ **Password in command argument (remains in shell history):**
```bash
mosquitto_passwd -b /etc/mosquitto/passwd user password123
history | grep password123    # password is visible!
```
✅ Use interactive mode without `-b`, or clear the history.
