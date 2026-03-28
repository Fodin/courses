# Task 5.4: Custom Networks

## Objective

Learn to create and manage custom Docker networks: the full set of `docker network` commands, multi-network architectures, and practical deployment patterns.

## Requirements

1. Create a component with three sections: "Commands", "Multi-network", "Patterns"
2. "Commands" section — an interactive terminal simulator: a list of 8 commands (create, create with parameters, ls, inspect, connect, disconnect, rm, prune). Clicking a command shows its output. Each command is a separate button
3. "Multi-network" section — an example architecture with two networks: a code block with the creation commands, a text diagram (ASCII in a `<pre>` block) showing frontend/backend networks with api as the bridge. Visualization of working and blocked routes
4. "Patterns" section — three cards with real-world scenarios: web application with a database, reverse proxy, network debugging. Each card: name, commands, description
5. Use tabs for navigation

## Hints

- For the terminal: an array `{ cmd, output, desc }`, `useState` for the active command
- For multi-network: `<pre>` for the diagram, explanation in a separate block
- For patterns: an array of cards with `borderLeft` for visual emphasis
- Color scheme: purple (#7b1fa2) as the accent color

## Checklist

- [ ] Three sections switchable via tabs
- [ ] At least 8 docker network commands with output
- [ ] Multi-network example with an ASCII diagram
- [ ] Working and blocked routes are shown
- [ ] Three pattern cards: web+database, reverse proxy, debugging
- [ ] Each card contains real, executable commands

## How to Verify

1. Click on commands — the output should change
2. The multi-network ASCII diagram is readable and shows the isolation
3. All Docker commands are syntactically correct
4. Patterns show real production scenarios
