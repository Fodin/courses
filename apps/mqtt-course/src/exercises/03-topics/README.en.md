# Level 3: Topics and Messages

## What is a Topic?

A topic in MQTT is a string address used for publishing and receiving messages. Think of a mailbox: the sender writes the address on the envelope, and the mail delivers to everyone subscribed to that address.

A topic is **not a queue** and not storage. It's simply a route.

```
home/living_room/temperature  →  "22.5"
home/kitchen/humidity         →  "65"
factory/line1/sensor3/rpm     →  "3600"
```

## Topic Hierarchy

Topics are built as a tree via `/`. Each segment is a hierarchy level:

```
home/
├── living_room/
│   ├── temperature
│   ├── humidity
│   └── light/state
├── kitchen/
│   ├── temperature
│   └── smoke_alarm
└── bedroom/
    └── temperature
```

📌 Naming rules:
- Separator is `/`
- Maximum 65535 bytes in topic name
- Don't start with `/` unless necessary (creates an empty first level)
- Case-sensitive: `Home/Temp` ≠ `home/temp`
- Cannot use `#` and `+` in topic names when publishing

## Wildcards: + and #

Wildcards are used **only when subscribing**, never when publishing.

### Single-level wildcard: `+`

Replaces exactly **one** topic level:

```
home/+/temperature    →  home/living_room/temperature ✅
                          home/kitchen/temperature     ✅
                          home/bedroom/temp            ❌ (different last segment)
                          home/floor1/room1/temp       ❌ (two levels instead of one)
```

### Multi-level wildcard: `#`

Replaces **any number** of levels from the current position to the end. Always placed last:

```
home/#           →  home/living_room/temperature  ✅
                    home/kitchen/humidity          ✅
                    home/a/b/c/d/e                ✅
                    office/temp                   ❌ (different root)

home/+/light/#   →  home/living_room/light/state  ✅
                    home/kitchen/light/brightness  ✅
                    home/kitchen/light/rgb/r       ✅
```

## System Topics $SYS

Mosquitto publishes broker statistics to reserved `$SYS` topics:

```
$SYS/broker/uptime                    →  "3600 seconds"
$SYS/broker/clients/connected         →  "42"
$SYS/broker/messages/sent            →  "100500"
$SYS/broker/load/messages/sent/1min  →  "15.23"
```

> ⚠️ Topics starting with `$` are invisible to root subscription `#`.
> `#` does not cover `$SYS/#` — this is intentional protection against system data leakage.

Update interval setting in `mosquitto.conf`:
```
sys_interval 10   # update every 10 seconds (0 = disabled)
```

## Naming Best Practices

| Context | Good | Bad |
|---|---|---|
| IoT home | `home/room/device/metric` | `home_room_device` |
| Industry | `plant/line/machine/param` | `data` |
| Commands | `device/id/cmd/action` | `device/cmd` |
| Status | `device/id/status` | `status/device/id` |

💡 Include the device ID so you can use `+`:
```
sensor/+/temperature   # all temperature sensors
sensor/esp32-01/+      # all metrics of a single device
```

## ⚠️ Common Beginner Mistakes

❌ **Subscribing to `#` for everything:**
```
mosquitto_sub -t '#'   # will receive EVERYTHING, will overload the client
```
✅ Use specific prefixes: `home/#`, `sensor/#`

❌ **Empty topic or spaces:**
```
publish " home/temp"   # space at the beginning — error
```

❌ **Wildcard when publishing:**
```
mosquitto_pub -t 'home/+/temp' -m '22'   # error! + is for subscriptions only
```
