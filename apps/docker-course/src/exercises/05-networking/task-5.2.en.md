# Task 5.2: Communication Between Containers

## Objective

Understand how containers communicate within a Docker network: DNS resolution by name, network isolation between different networks, and the use of network aliases.

## Requirements

1. Create a component with three sections: "DNS Resolution", "Network Isolation", "Aliases"
2. "DNS Resolution" section — a step-by-step demonstration (5 steps): creating a network, starting two containers, pinging by name, connecting to a database by DNS name. Buttons "Step 1"..."Step 5"; clicking each shows the command and its output
3. "Network Isolation" section — an architecture demonstration with two networks (frontend, backend) and a bridge container (api in both). Show the list of commands to create this configuration. Visualization: card blocks showing which connections work (web→api, api→db) and which don't (web→db)
4. "Aliases" section — a `--network-alias` example with an explanation. A list of advantages: abstraction, migration, load balancing
5. Use tabs to navigate between sections

## Hints

- For the step-by-step demonstration: an array `{ step, cmd, output, desc }`, `useState` for the active step
- For isolation: CSS Grid for connection cards (green — work, red — blocked)
- For aliases: a `<pre>` block with commands, a `<ul>` for the advantages list

## Checklist

- [ ] Three sections switchable via tabs
- [ ] Step-by-step DNS demonstration with 5 steps, each with a command and output
- [ ] Network isolation visualization: working and blocked connections
- [ ] Example of creating a multi-network architecture with commands
- [ ] Example of `--network-alias` usage with an explanation
- [ ] List of alias advantages (at least 3)

## How to Verify

1. Step through the DNS demonstration — the command and output should change
2. In the isolation section, it should be visually clear which connections work and which don't
3. The alias example is syntactically correct
4. All Docker commands are real and executable
