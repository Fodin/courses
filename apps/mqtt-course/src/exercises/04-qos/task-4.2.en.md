# Task 4.2: Retained Messages

## Goal

Understand the retained message mechanism: how the broker stores the last value and immediately delivers it to new subscribers.

## Requirements

1. Publish a message with the retained flag (e.g., `home/light/state` = `ON`)
2. Verify it appeared in the broker storage
3. Click "Connect Client" — it should immediately receive the stored value
4. Publish a new value to the same topic — verify the retained message updated
5. Delete the retained message (publish empty payload with retain=true)

## Checklist

- [ ] Published a retained message and saw it in storage
- [ ] New subscriber immediately received retained without waiting for the next publish
- [ ] Understood that retained stores only the LAST value per topic
- [ ] Deleted retained via empty payload
- [ ] Know the `max_retained_messages` parameter and why to limit it on OpenWRT

## How to Check Yourself

On a real broker:
```bash
# Publish retained
mosquitto_pub -r -t 'home/temp' -m '22.5'

# New subscriber receives the value immediately on subscribe:
mosquitto_sub -t 'home/temp'
# Should output: home/temp 22.5

# Delete retained:
mosquitto_pub -r -t 'home/temp' -m ''
```

Answer: why does `mosquitto_pub -r -t 'home/#' -m 'test'` return an error?

Answer: wildcards cannot be used when publishing.
