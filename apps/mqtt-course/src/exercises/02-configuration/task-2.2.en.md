# Task 2.2: Listeners and Ports

## Goal

Understand the concept of multiple listeners in Mosquitto 2.x and learn to compose configurations for various scenarios. Implement a listener configuration builder that generates a ready-to-use `mosquitto.conf` fragment.

---

## Requirements

1. Define the `ListenerConfig` interface with fields: `id`, `port`, `bindAddress`, `protocol` (`'mqtt' | 'websockets'`), `tls`, `description`, `useCase`, `color`, `bg`

2. Create a `listenerPresets` array of at least 5 presets:
   - MQTT localhost only (127.0.0.1:1883)
   - MQTT for LAN (192.168.1.1:1883)
   - MQTT+TLS (0.0.0.0:8883)
   - WebSocket for browsers (192.168.1.1:9001)
   - Secure WebSocket WSS (0.0.0.0:9883)

3. Display presets as cards with checkboxes. When multiple are selected — they combine. Cannot deselect the last selected preset.

4. Implement a `generateListenerConfig(listeners: ListenerConfig[]): string` function that generates a `mosquitto.conf` fragment for the selected listeners. TLS listener must include `cafile`, `certfile`, `keyfile`, `tls_version`.

5. A "Show Config" button reveals the generated config in terminal style

6. Add a reference table of standard MQTT ports (1883, 8883, 9001, 9883)

---

## Checklist

- [ ] Defined `ListenerConfig` interface with all fields
- [ ] 5+ presets with realistic descriptions
- [ ] Cards with checkboxes for multi-select
- [ ] Visual highlighting of active cards (border, background)
- [ ] Cannot deselect the only active preset
- [ ] List of active listeners with addresses and protocols
- [ ] `generateListenerConfig` generates a valid config
- [ ] TLS listener includes 4 lines: cafile, certfile, keyfile, tls_version
- [ ] Config visibility toggle button
- [ ] Port reference table
- [ ] Correct TypeScript typing

---

## How to Check Yourself

1. Do you see 5 preset cards?
2. Is the first preset selected by default, others not?
3. Select "MQTT+TLS" — does the card highlight?
4. Click "Show Config" — do you see `listener 8883` and a block of TLS parameters?
5. Remove all presets except one — can you not deselect the last one?
6. Does the table at the bottom have 4 rows with ports 1883, 8883, 9001, 9883?
