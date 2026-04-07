# Task 7.2: Choosing Storage on OpenWRT

## Goal

Understand the characteristics of different OpenWRT storage types (/tmp, /overlay, /mnt/usb)
for storing the Mosquitto database, taking flash memory wear-leveling into account.

## Requirements

1. Create a storage selection component: `/tmp`, `/overlay`, `/mnt/usb`
2. For each option, show: memory type, volatility, pros and cons
3. For `/overlay`, add an interactive flash wear calculator:
   - Slider for autosave_interval (60–3600 seconds)
   - Calculate: writes per day, data per day, estimated endurance in years
4. For `/mnt/usb`, show automount configuration commands
5. Add a recommendation for each option

## Checklist

- [ ] Three storage options with characteristics
- [ ] Visual distinction: volatile (yellow) vs non-volatile (green)
- [ ] Wear calculator for `/overlay` with formula
- [ ] Slider updates calculator in real time
- [ ] USB mount commands for the `/mnt/usb` option
- [ ] Mosquitto config for the selected option

## How to verify

1. Verify that `/tmp` is volatile storage:
   ```bash
   df -h /tmp    # should show tmpfs
   ```
2. Verify that `/overlay` survives reboot:
   ```bash
   echo "test" > /overlay/test.txt
   reboot
   cat /overlay/test.txt    # should show "test"
   ```
3. For USB: check mount:
   ```bash
   mountpoint /mnt/usb && echo "mounted" || echo "not mounted"
   ```
4. Set `persistence_location` to the selected path and verify Mosquitto starts.
