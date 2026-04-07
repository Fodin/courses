# Task 4.3: Last Will and Testament

## Goal

Master the LWT (Last Will and Testament) mechanism — automatic notification of client drop. Learn to configure the Online/Offline pattern for IoT devices.

## Requirements

1. Study the list of devices with configured LWT
2. Simulate an emergency disconnect (crash) for device esp32-01
3. Verify in the log: the broker automatically sent the LWT message
4. Simulate a normal disconnect (DISCONNECT) — LWT should not be sent
5. Reconnect the device and see how it publishes "online"

## Checklist

- [ ] Understood the difference between a crash disconnect and DISCONNECT
- [ ] Saw that on DISCONNECT the broker does NOT send LWT
- [ ] Know the Online/Offline pattern: will_set → connect → publish "online"
- [ ] Understood why LWT should use retain=true
- [ ] Know why QoS 1 is recommended for LWT, not 0

## How to Check Yourself

Write pseudocode for configuring LWT for a device with the Online/Offline pattern:

```python
client = mqtt.Client(client_id='sensor-01')

# 1. Set Last Will (before connect!)
client.will_set(
    topic=___,      # status topic
    payload=___,    # what to send on crash
    qos=___,        # which QoS? why?
    retain=___      # need retain? why?
)

# 2. Connect
client.connect('192.168.1.1', 1883)

# 3. Report readiness
client.publish(
    topic=___,      # same topic
    payload=___,    # "online"
    retain=___      # need retain?
)
```

Answer: topic `device/sensor-01/status`, LWT payload `offline`, QoS 1 (to ensure delivery), retain True (so new subscribers know the status immediately).
