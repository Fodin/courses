# Task 2.3: Container lifecycle

## Objective
Understand container states and the transitions between them.

## Requirements
Create a component that shows:

1. **A state diagram**: Created → Running → Paused → Exited → Removed
2. For each state — a description and the commands to transition to it
3. **The difference** between `docker stop` (SIGTERM) and `docker kill` (SIGKILL)
4. Main management commands (`docker ps`, `start`, `stop`, `restart`, `rm`, `prune`)

## Checklist
- [ ] All 5 states are shown
- [ ] Each state has a description
- [ ] The difference between SIGTERM and SIGKILL is explained
