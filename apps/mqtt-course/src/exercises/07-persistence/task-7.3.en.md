# Task 7.3: Mosquitto Backup and Restore

## Goal

Create a backup system for Mosquitto on OpenWRT: automated scheduled backup
with rotation and a restore script from archive.

## Requirements

1. Write a `/usr/bin/mqtt-backup.sh` script that:
   - Sends SIGUSR1 to flush buffers before backup
   - Archives `mosquitto.db`, `mosquitto.conf`, certificates
   - Names the archive with a timestamp: `mosquitto_YYYYMMDD_HHMMSS.tar.gz`
   - Keeps only the last 7 backups (rotation)
   - Logs the result via `logger`
2. Configure cron to run the script daily at 02:00
3. Write a restore script from archive
4. Visualize all scripts in a component with tab switching between them

## Checklist

- [ ] Backup script sends SIGUSR1 before copying files
- [ ] Archive contains DB, config, and certificates
- [ ] Archive naming includes a timestamp
- [ ] Rotation: no more than 7 backups stored
- [ ] Logging via `logger` (visible in `logread`)
- [ ] Cron configured: `0 2 * * * /usr/bin/mqtt-backup.sh`
- [ ] Restore script stops, restores, and starts Mosquitto
- [ ] Component shows all 4 scripts with tab switching

## How to verify

1. Run the backup script manually and verify the archive was created:
   ```bash
   sh /usr/bin/mqtt-backup.sh
   ls -la /mnt/usb/backups/mosquitto/
   ```
2. Check the log:
   ```bash
   logread | grep mqtt-backup | tail -3
   ```
3. Check archive contents:
   ```bash
   tar tzf /mnt/usb/backups/mosquitto/mosquitto_*.tar.gz
   ```
4. Check cron:
   ```bash
   crontab -l | grep mqtt-backup
   ```
5. Test restore (on a test system!):
   ```bash
   sh /usr/bin/mqtt-restore.sh /mnt/usb/backups/mosquitto/mosquitto_LATEST.tar.gz
   ```
