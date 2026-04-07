# Task 1.2: Mosquitto File Structure

## Goal

Study the Mosquitto file structure on OpenWRT: where configs, executables, and data are stored. Implement an interactive file manager with descriptions and file content examples.

---

## Requirements

1. Define the `FileNode` interface with fields: `name` (display name), `path` (full path), `type: 'file' | 'dir'`, optional `size`, `description`, `content` (content example), `important` (importance flag)

2. Create a `fileStructure` array with at least 10 entries covering:
   - `/etc/mosquitto/` directory and its contents (mosquitto.conf, passwd, acl)
   - Executable files (`/usr/sbin/mosquitto`, `/usr/bin/mosquitto_pub`, `/usr/bin/mosquitto_sub`)
   - Runtime files (`/var/run/mosquitto.pid`)
   - Persistence data (`/var/lib/mosquitto/`, `mosquitto.db`)

3. Display the file tree in terminal style (dark background). Important files are highlighted in gold.

4. Clicking an entry opens a panel with: full path, description, "important file" badge (if `important`), content example in terminal style (if `content` exists)

5. File nesting is displayed through indentation (paddingLeft)

---

## Checklist

- [ ] Defined `FileNode` interface with all fields
- [ ] Array of 10+ files/directories with realistic paths
- [ ] Tree in dark terminal style
- [ ] Icons `📁` / `📄` for directories and files
- [ ] Important files highlighted in color (gold/yellow)
- [ ] File size displayed next to entry (if set)
- [ ] Click opens detail panel
- [ ] Panel: full path, description, importance badge
- [ ] Content example in terminal style (if available)
- [ ] `selected` state updates on click
- [ ] Correct TypeScript typing

---

## How to Check Yourself

1. Do you see a file tree on a dark background?
2. Are `mosquitto.conf` and `/usr/sbin/mosquitto` highlighted in gold?
3. Click on `mosquitto.conf` → do you see a description and config example in the right panel?
4. Click on `/var/run/mosquitto.pid` → does the description explain the PID file purpose?
5. Click on `passwd` → does it show the password file format?
6. Do nested files in `/etc/mosquitto/` have indentation?
