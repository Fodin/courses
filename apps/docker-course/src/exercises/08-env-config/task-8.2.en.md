# Task 8.2: Secrets and configs

## Objective

Study the mechanisms for securely passing confidential data (Docker Secrets) and configuration files (Docker Configs) to containers. Understand why environment variables are insecure for secrets and when to use each approach.

## Requirements

1. Create a component with four tabs: "Problem", "Secrets", "Configs", "Comparison"
2. "Problem" tab — three cards showing the problems with environment variables: visibility via docker inspect, /proc, and logs. Below, a block with the solution (Docker Secrets)
3. "Secrets" tab — three switchable examples: "Secrets in Compose" (YAML with secrets section), "Reading in Application" (Node.js code with env fallback), "Creating Files" (bash commands). Plus information about the `_FILE` suffix in official images
4. "Configs" tab — two switchable examples (nginx, prometheus). Plus a note about configs vs bind mount
5. "Comparison" tab — comparison table of environment / Secrets / Configs across 7 criteria

## Hints

- `useState<'problem' | 'secrets' | 'configs' | 'comparison'>` for tabs
- `useState<string>` for the active example within a tab
- Problem cards: `{ cmd, desc }[]`
- Comparison table: array of string arrays (table rows)

## Checklist

- [ ] Four tabs switch correctly
- [ ] "Problem": three cards with specific commands and threat description
- [ ] "Secrets": three switchable examples (compose, reading, creating)
- [ ] Information about the `_FILE` suffix for official images
- [ ] "Configs": two examples (nginx, prometheus)
- [ ] Note about configs vs bind mount (immutability)
- [ ] "Comparison": table with 7 criteria and 3 columns

## How to verify

1. Switch tabs — content changes
2. In "Problem" make sure there are specific commands (docker inspect, cat /proc, console.log)
3. In "Secrets" switch examples — YAML, Node.js code, bash commands
4. In "Configs" switch nginx/prometheus — different YAML
5. In "Comparison" the table is readable, 7 rows are filled in
