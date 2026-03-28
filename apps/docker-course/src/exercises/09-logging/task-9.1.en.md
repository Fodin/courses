# Task 9.1: docker logs

## Objective

Understand the `docker logs` command and its flags, learn the difference between STDOUT and STDERR, study logging drivers and log rotation configuration.

## Requirements

1. Create a component with three switchable sections: "docker logs Flags", "Logging Drivers", "Log Rotation"
2. "docker logs Flags" section — a table of flags (`-f`, `--tail`, `--since`, `--until`, `-t`, `--details`) with description and example command
3. "Logging Drivers" section — a table of drivers (json-file, local, journald, syslog, fluentd, awslogs, none) indicating `docker logs` support
4. "Log Rotation" section — examples of rotation configuration: via CLI flags, in docker-compose.yml, and in daemon.json
5. Add a toggle button "Show STDOUT vs STDERR" — on click, display a block with examples of writing to both streams (bash, Node.js, Python)
6. At the bottom of the component: a warning that docker logs only shows STDOUT/STDERR and logs written to files are invisible

## Hints

- Array of objects for sections: `{ key, label, content }` — content can be JSX or data for rendering
- `useState<string>` for the active section, `useState<boolean>` for the STDOUT/STDERR toggle
- Flags table: `{ flag, description, example }[]`
- Drivers table: `{ name, description, supportsLogs }[]`

## Checklist

- [ ] Three sections switch correctly
- [ ] docker logs flags table (6 flags)
- [ ] Logging drivers table (7 drivers) with "docker logs" column
- [ ] Rotation examples: CLI, Compose, daemon.json
- [ ] STDOUT vs STDERR button shows/hides the block
- [ ] Warning about file-based logs at the bottom

## How to verify

1. Switch sections — content changes, each section is unique
2. In "docker logs Flags" make sure all 6 flags are in the table with examples
3. In "Logging Drivers" json-file, local, journald show "yes", others show "no"
4. In "Log Rotation" there are three configuration variants (CLI, Compose, daemon.json)
5. The STDOUT/STDERR button correctly shows/hides the block with examples for three languages
6. The warning at the bottom is always visible
