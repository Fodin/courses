# Level 3: Topics and Messages — Extended Theory

## Topic as a Postal Address

Imagine you want to receive newspapers. You subscribe to the address "1 News Street" — and every day newspapers are delivered there. MQTT works the same way:

- **Publisher** — the one who puts the letter in the mailbox
- **Subscriber** — the one who picks up letters from the right address
- **Topic** — the address
- **Broker** — the postman who delivers everything

Key difference from HTTP: the publisher **doesn't know** about the subscribers. It just publishes. The broker decides who gets the message.

## Topic Syntax

### MQTT Specification Rules (v3.1.1 and v5)

A topic is a UTF-8 string. Technical limits:

```
Minimum length: 1 character
Maximum length: 65535 bytes (not characters — bytes!)
Level separator: /
Single-level wildcard: +
Multi-level wildcard: #
System prefix: $ (reserved)
```

📌 Forbidden symbols:
- `+` and `#` in names when publishing
- NULL character (U+0000)

📌 Allowed but not recommended:
- Spaces (technically valid, cause confusion)
- Special symbols `!@:;,`
- Unicode characters (work but complicate debugging)

### Empty First Level

The topic `/home/temp` starts with an empty level:

```
/home/temp  =  ["", "home", "temp"]  — three levels
home/temp   =  ["home", "temp"]       — two levels
```

This works, but creates an empty "root" and confuses wildcards. Avoid leading `/`.

## Designing Topic Hierarchy

### "General to Specific" Approach

The golden rule: move from **broad** context to **specific** parameter.

```
{area}/{object}/{parameter}
{place}/{type}/{device}/{metric}
```

Example for a smart home:
```
home/
├── living_room/
│   ├── temperature          # "22.5" (°C)
│   ├── humidity             # "65" (%)
│   ├── light/
│   │   ├── state            # "ON" / "OFF"
│   │   ├── brightness       # "75" (%)
│   │   └── color            # "255,128,0" (RGB)
│   └── motion               # "detected" / "clear"
├── kitchen/
│   ├── temperature
│   └── smoke_alarm          # "normal" / "alarm"
└── bedroom/
    ├── temperature
    └── humidity
```

This enables wildcards:
```
home/+/temperature      # temperature in all rooms
home/living_room/#      # EVERYTHING from the living room
home/+/light/state      # light state everywhere
```

### "Commands and Status" Approach

For device management, separate command and response topics:

```
device/{id}/cmd/set_state      # command → to device
device/{id}/state              # status ← from device
device/{id}/error              # errors ← from device
device/{id}/heartbeat          # ping ← from device
```

```
# Send a command
mosquitto_pub -t 'device/esp32-01/cmd/set_state' -m 'ON'

# Listen for response
mosquitto_sub -t 'device/esp32-01/state'
```

### Industrial IoT (IIoT)

```
plant/
├── line1/
│   ├── robot1/
│   │   ├── status           # "running" / "idle" / "fault"
│   │   ├── speed_rpm        # "3600"
│   │   └── temp_motor       # "65.2"
│   └── conveyor/
│       ├── speed_m_min      # "0.5"
│       └── items_count      # "1024"
└── utilities/
    ├── power_kw             # "45.2"
    └── water_pressure_bar  # "3.1"
```

## Wildcards in Detail

### `+` Wildcard (plus)

`+` replaces **exactly one level**. Like the `?` mask in file systems.

```
Subscription: home/+/temperature

Matches:
  home/living_room/temperature   ✅  (one level instead of +)
  home/kitchen/temperature       ✅
  home/bedroom/temperature       ✅

Does NOT match:
  home/temperature               ❌  (no level instead of +)
  home/floor1/room1/temperature  ❌  (two levels instead of one)
  home/living_room/humidity      ❌  (different last segment)
```

Multiple `+` in one topic:

```
+/+/temperature    # any room in any house
home/+/light/+    # light properties in any room
```

### `#` Wildcard (hash)

`#` replaces **the rest of the path** including the current level.

```
Subscription: home/#

Matches:
  home/temp                        ✅
  home/living_room/temp            ✅
  home/a/b/c/d/e/f                 ✅
  home/                            ✅  (empty level after /)

Does NOT match:
  home                             ❌  (no / after home)
  office/temp                      ❌  (different root)
```

> 📌 `#` must be the last character and come after `/` or be the only character.
> `home#` — invalid subscription topic.

A `#` subscription (hash only) means ALL topics, except `$`:
```
mosquitto_sub -t '#'   # all topics (except $SYS)
```

### Combining

```
home/+/light/#        # everything about light in any room
+/+/cmd/#             # any commands in any hierarchy
sensor/+/data/#       # all data from any sensor
```

## System Topics $SYS

Mosquitto provides built-in monitoring via `$SYS` topics. The broker publishes them automatically every N seconds (default — 10).

### Broker

```
$SYS/broker/version              # "mosquitto version 2.0.18"
$SYS/broker/uptime               # "3600 seconds"
$SYS/broker/timestamp            # build timestamp
$SYS/broker/changeset            # git revision
```

### Clients

```
$SYS/broker/clients/connected    # currently connected
$SYS/broker/clients/disconnected # disconnected with persistent sessions
$SYS/broker/clients/maximum      # maximum ever
$SYS/broker/clients/total        # total ever connected
```

### Messages

```
$SYS/broker/messages/sent        # total sent
$SYS/broker/messages/received    # total received
$SYS/broker/messages/dropped     # dropped (queues full)
$SYS/broker/messages/stored      # in retained + QoS 1/2 queues
$SYS/broker/publish/messages/sent
$SYS/broker/publish/messages/received
```

### Traffic in Bytes

```
$SYS/broker/bytes/sent           # bytes sent
$SYS/broker/bytes/received       # bytes received
```

### Load (moving average)

```
$SYS/broker/load/connections/1min   # connections/min in the last minute
$SYS/broker/load/connections/5min
$SYS/broker/load/connections/15min
$SYS/broker/load/messages/sent/1min
$SYS/broker/load/messages/sent/5min
$SYS/broker/load/messages/sent/15min
$SYS/broker/load/messages/received/1min
$SYS/broker/load/bytes/sent/1min
$SYS/broker/load/bytes/received/1min
```

### Persistence (if enabled)

```
$SYS/broker/store/messages/count    # stored messages
$SYS/broker/store/messages/bytes    # bytes in storage
```

### Subscriptions

```
$SYS/broker/subscriptions/count    # active subscriptions
```

### How to Read $SYS Topics

```bash
# Single topic
mosquitto_sub -t '$SYS/broker/clients/connected'

# All system topics
mosquitto_sub -t '$SYS/#'

# Real-time monitoring
mosquitto_sub -t '$SYS/broker/load/#' -v
```

> ⚠️ In the shell you need single quotes around topics with `$`, otherwise the shell expands the variable:
> `$SYS` → empty string → subscription to `/broker/clients`

### Disabling $SYS Topics

If not needed or you want to hide them from clients:

```
# mosquitto.conf
sys_interval 0   # 0 = disable $SYS publication
```

## Key Differences MQTT v3.1.1 vs v5

MQTT v5 added **Topic Aliases** — a client can replace a long topic with a short numeric alias to save traffic:

```
# Client tells broker: topic "home/living_room/temperature" = alias 1
# Further publishes just use alias=1 instead of the full name
```

On OpenWRT with Mosquitto 2.x this is supported, but the client library must know how to use it.

## Topic Performance on OpenWRT

On a router with 32-64 MB RAM:

1. **Avoid deep hierarchies** (>6 levels) — each level increases parsing time
2. **Don't use wildcards unnecessarily** — `#` requires traversing the entire subscription tree
3. **Short segment names** — save memory and traffic

```
# Bad for embedded systems
building/floor01/room007/sensor/temperature/celsius/current

# Good
b1/f1/r7/t   # if the structure is documented
```

## ⚠️ Common Mistakes

❌ **Wildcard when publishing:**
```bash
mosquitto_pub -t 'home/+/temp' -m '22'
# Error! + and # cannot be used in publish topics
```
✅ Publish to specific topics.

❌ **Forgot quotes for $SYS in bash:**
```bash
mosquitto_sub -t $SYS/broker/uptime   # shell expands $SYS to empty string!
```
✅ Always single quotes: `'$SYS/broker/uptime'`

❌ **Topic case sensitivity:**
```
home/Temperature  ≠  home/temperature  ≠  HOME/TEMPERATURE
```
✅ Agree on a single convention — and follow it.

❌ **Subscribing to `#` for monitoring** — fine for debugging, a disaster in production with thousands of messages per second.

❌ **Topic with spaces:**
```
home/ living room/temp   # space in the name — not a protocol error, but a debugging nightmare
```
✅ Use `_` or `-`: `home/living_room/temp`
