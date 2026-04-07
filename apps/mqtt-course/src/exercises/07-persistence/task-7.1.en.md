# Task 7.1: Configuring the Persistence Database

## Goal

Learn to configure persistence in Mosquitto to retain retained messages, sessions, and QoS 1/2 queues
across broker restarts.

## Requirements

1. Enable persistence with the correct `persistence_location` (not /tmp!)
2. Configure `autosave_interval` (recommended: 300 seconds)
3. Set `autosave_on_changes false` to conserve flash resources
4. Create the `/var/lib/mosquitto/` directory with correct permissions (owner `mosquitto`)
5. Visualize what is and isn't persisted with an interactive slider for autosave_interval

## Checklist

- [ ] `persistence true` is specified in the config
- [ ] `persistence_location` does NOT point to `/tmp`
- [ ] Directory exists and is accessible by Mosquitto: `chown mosquitto:mosquitto /var/lib/mosquitto`
- [ ] `autosave_interval` is set (not 0, not too small)
- [ ] `autosave_on_changes false` is set
- [ ] Component shows what gets persisted and what doesn't
- [ ] autosave_interval slider updates config preview

## How to verify

1. Restart Mosquitto and ensure there are no errors:
   ```bash
   service mosquitto restart && logread | grep mosquitto | tail -5
   ```
2. Publish a retained message:
   ```bash
   mosquitto_pub -t home/temp -m "22.5" -r
   ```
3. Restart Mosquitto and verify the retained message was not lost:
   ```bash
   service mosquitto restart
   mosquitto_sub -t home/temp -C 1
   # Should return "22.5" immediately
   ```
4. Verify the DB file was created:
   ```bash
   ls -la /var/lib/mosquitto/mosquitto.db
   ```
