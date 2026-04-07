# Task 1.3: First Launch and Verification

## Goal

Learn how to verify Mosquitto functionality after installation using a set of diagnostic commands. Implement an interactive "terminal simulator" with verification commands and their realistic output.

---

## Requirements

1. Define the `VerifyCommand` interface with fields: `id`, `title`, `command`, `description`, `expectedOutput`, `category` (`'status' | 'publish' | 'subscribe' | 'debug'`)

2. Create a `verifyCommands` array with at least 6 commands covering:
   - Process status check (`/etc/init.d/mosquitto status`, `ps | grep mosquitto`)
   - Port check (`netstat -tlnp | grep 1883`)
   - Subscription (`mosquitto_sub`)
   - Publishing (`mosquitto_pub`)
   - System topics (`mosquitto_sub -t '$SYS/#'`)
   - Log viewing (`logread | grep mosquitto`)

3. Group commands by category. Each group has a header with an icon and color.

4. For each command display: the command itself (code), description, "Run" button. On click — a 400–800 ms delay, then output appears in terminal style. Button changes to "✓ Done".

5. The simulator should not require a real connection — all outputs are hardcoded in `expectedOutput`.

---

## Checklist

- [ ] Defined `VerifyCommand` interface with `category` field
- [ ] At least 6 commands covering all verification aspects
- [ ] Grouping by categories with headers and icons
- [ ] "Run" button simulates execution (with delay)
- [ ] Output displayed in dark terminal style
- [ ] Button changes after completion ("✓ Done")
- [ ] Realistic command output (matches OpenWRT/Mosquitto 2.x)
- [ ] Log command output contains real OpenWRT syslog format
- [ ] `runOutput` state — object with id → output string
- [ ] Correct TypeScript typing

---

## How to Check Yourself

1. Do you see several command groups (Status, Subscription, Publishing, Debug)?
2. Click "Run" next to `ps | grep mosquitto` — does output appear after a second?
3. Does `netstat` output show port 1883 and mosquitto process?
4. Does `mosquitto_sub -t '$SYS/#'` output contain several system topics?
5. Does `logread | grep mosquitto` output contain lines in OpenWRT syslog format?
6. Do completed command buttons show "✓ Done"?
