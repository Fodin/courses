# Task 5.3: Port Mapping

## Objective

Master the port mapping mechanism in Docker: the `-p` syntax, binding to interfaces, protocols, and the difference between `EXPOSE` and `-p`.

## Requirements

1. Create a component with a syntax table and interactive examples
2. Syntax table — all `-p` variants: `hostPort:containerPort`, `ip:hostPort:containerPort`, `containerPort` (random), `-P`, `/udp`. At least 5 rows
3. Interactive examples — at least 5 mapping variants: basic, localhost only, random port, UDP, multiple ports. Buttons to switch between them; selecting one shows the command and a description
4. A "Show: EXPOSE vs -p" button — clicking it expands a block with two cards: EXPOSE in the Dockerfile (documentation only) and -p in docker run (actual publishing)
5. A security warning: `-p 8080:80` opens the port on all interfaces; use `127.0.0.1:...` to restrict access

## Hints

- For the syntax table: an HTML `<table>` with "Syntax" and "Meaning" headers
- For the examples: an array `{ title, cmd, desc }`, `useState` for the selected example
- For EXPOSE vs -p: `useState<boolean>` for toggle, CSS Grid for two cards
- For the warning: a block with background `#fce4ec`

## Checklist

- [ ] Table with at least 5 -p syntax variants
- [ ] At least 5 interactive examples with switching
- [ ] Each example has a command + description
- [ ] Toggle block "EXPOSE vs -p" with two cards
- [ ] Security warning (binding to 0.0.0.0)
- [ ] Recommendation to use 127.0.0.1

## How to Verify

1. All syntax variants in the table are correct
2. Switching examples works; the command and description update
3. The EXPOSE vs -p button shows/hides the block
4. The security block is clearly visible
