# Task 9.3: Debugging Common Errors

## Objective

Learn to diagnose and resolve common container problems: immediate exit, OOM, port conflict, permission denied, network errors. Master the step-by-step debugging algorithm.

## Requirements

1. Create a component with switchable error scenarios: "Exit 0", "Exit 1", "Exit 137 (OOM)", "Port conflict", "Permission denied", "Network issues"
2. Each scenario contains: symptom (what the user sees), cause, diagnostic commands, and solution
3. The symptom is displayed as a code block with `docker ps -a` output
4. The solution is displayed as a code block with working commands or configuration
5. Add a "Show Debugging Algorithm" button — on click, display the step-by-step algorithm: ps → logs → inspect → exec → events → stats → system df
6. At the bottom of the component: a table of exit codes (0, 1, 126, 127, 137, 143) with descriptions

## Hints

- Array of scenarios: `{ key, label, symptom, cause, diagnosis, solution }[]`
- symptom, diagnosis, solution — multi-line strings for `<pre>`
- `useState<string>` for the active scenario, `useState<boolean>` for the algorithm
- Exit codes: `{ code, signal, meaning }[]`

## Checklist

- [ ] Six error scenarios switch correctly
- [ ] Each scenario: symptom + cause + diagnosis + solution
- [ ] Symptom and solution in code blocks
- [ ] Debugging algorithm (7 steps) via button
- [ ] Exit codes table (6 codes) at the bottom
- [ ] Exit 137 includes OOMKilled check via inspect

## How to verify

1. Switch scenarios — each shows a unique set of data
2. Each scenario has all 4 blocks: symptom, cause, diagnosis, solution
3. "Exit 137" scenario includes OOMKilled check and memory limit increase
4. "Port conflict" scenario includes lsof/netstat for finding the occupied port
5. Debugging algorithm: 7 numbered steps from ps to system df
6. Exit codes table: 0 (OK), 1 (error), 126, 127, 137 (OOM/SIGKILL), 143 (SIGTERM)
