# Task 9.2: inspect, stats, top

## Objective

Master container inspection and monitoring commands: `docker inspect` with Go templates, `docker stats` for resource monitoring, `docker top` for viewing processes, and `docker events` for tracking events.

## Requirements

1. Create a component with four switchable sections: "docker inspect", "docker stats", "docker top", "docker events"
2. "docker inspect" section — a list of useful Go templates (IP address, status, exit code, env, mounts, OOMKilled, PID, ports) — each with the command and example output
3. "docker stats" section — a table of columns (CPU%, MEM, NET I/O, BLOCK I/O, PIDS) and an example custom format
4. "docker top" section — an example output and usage with additional ps fields
5. "docker events" section — filters (event, container, type) and typical container lifecycle events
6. Add a "Show Cheat Sheet" button — on click, display a compact summary of all four commands with the most useful variants

## Hints

- `useState<string>` for the active section, `useState<boolean>` for the cheat sheet
- For inspect templates: array `{ label, template, output }[]`
- For stats: array of columns `{ column, description }[]`
- For events: array of filters `{ filter, example }[]` and array of lifecycle events

## Checklist

- [ ] Four sections switch correctly
- [ ] docker inspect: at least 8 Go templates with commands and output
- [ ] docker stats: column table + format example
- [ ] docker top: example output + custom fields
- [ ] docker events: filters + lifecycle events
- [ ] Cheat sheet via button: summary of all four commands

## How to verify

1. Switch sections — each shows its own set of data
2. In "docker inspect" at least 8 templates with realistic output
3. In "docker stats" all columns are described + example custom format
4. In "docker top" there is an example of process output
5. In "docker events" filters and typical events are listed (create, start, die, stop, destroy)
6. Cheat sheet shows/hides via button, contains all 4 commands
