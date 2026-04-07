# Task 2.1: mosquitto.conf — Main Parameters

## Goal

Study the key Mosquitto configuration parameters and learn to work with the reference. Implement an interactive reference with search, category filtering, and detailed descriptions of each parameter.

---

## Requirements

1. Define the `ConfigParam` interface with fields: `key`, `defaultValue`, `type` (`'integer' | 'boolean' | 'string' | 'path'`), `category` (`'general' | 'network' | 'logging' | 'security' | 'persistence'`), `description`, `example`, optional `note`

2. Create a `configParams` array of at least 12 parameters covering all 5 categories. Include: `listener`, `bind_address`, `max_connections`, `persistence`, `persistence_location`, `log_dest`, `log_type`, `allow_anonymous`, `password_file`, `pid_file`, `message_size_limit`, `keepalive_interval`

3. Implement a search field (filtering by `key` and `description`)

4. Implement category filter buttons (including "All"). The active category is highlighted with that category's color.

5. Parameter list: scrollable list with: category icon, parameter name (monospace, bold), default value in a gray badge

6. Clicking a parameter opens a panel with: name and type, detailed description, default value, note (if present) in a yellow block, usage example in terminal style

---

## Checklist

- [ ] Defined `ConfigParam` interface with optional `note` field
- [ ] 12+ parameters with technically accurate data for Mosquitto 2.x
- [ ] Search field filters the list in real time
- [ ] 6 filter buttons (All + 5 categories) with color highlighting
- [ ] Counter "Found: N parameters"
- [ ] Scrollable list (maxHeight)
- [ ] Click opens detail panel
- [ ] Panel: type badge, description, default value
- [ ] Note `note` in yellow block with ⚠️
- [ ] Usage example in dark terminal
- [ ] Correct TypeScript typing

---

## How to Check Yourself

1. Do you see a parameter list with category buttons at the top?
2. Type "log" in the search — does the list shrink to logging parameters?
3. Press the "Persistence" filter — do you see only persistence parameters?
4. Click `persistence_location` — does the panel show a description and tmpfs note?
5. Is the note displayed in a yellow block with ⚠️?
6. Do you see real paths like `/tmp/mosquitto/` in the example?
