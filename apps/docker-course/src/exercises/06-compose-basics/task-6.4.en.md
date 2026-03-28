# Task 6.4: docker compose up/down/logs

## Objective

Learn the core Docker Compose commands for managing an application's lifecycle: starting, stopping, viewing logs, checking status, and running commands.

## Requirements

1. Create a component with three command groups: "Lifecycle" (up, down), "Logs", "Status and Management" (ps, exec, restart, build)
2. In each group — a list of commands, clickable to view details. On click, show: the command, typical output, description
3. "Lifecycle" group: `up -d`, `up -d --build`, `down`, `down -v`. Output should be realistic
4. "Logs" group: `logs`, `logs -f <service>`, `logs --tail 20 -t`
5. "Status and Management" group: `ps`, `exec`, `restart`, `build --no-cache`
6. A stop vs down comparison block with visual highlighting
7. A warning about `down -v` (data loss)
8. A "Typical Workflow" block — a sequence of commands for development

## Hints

- An array of objects `{ key, label, commands: [{ cmd, output, desc }] }` for groups
- Reset activeCmd to 0 when switching groups
- Use realistic Docker Compose V2 output format

## Checklist

- [ ] Three command groups switchable via tabs
- [ ] Clickable command list in each group
- [ ] Realistic output for each command
- [ ] stop vs down comparison
- [ ] Warning about down -v
- [ ] "Typical Workflow" block

## How to Verify

1. Switch groups — the command list updates
2. Click commands — the output changes
3. Output looks like real Docker Compose output
4. The down -v warning is visually noticeable
