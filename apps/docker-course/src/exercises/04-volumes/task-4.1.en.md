# Task 4.1: Named Volumes

## Objective

Understand named volumes in Docker: creating them, their lifecycle, managing them with `docker volume` commands, and sharing data between containers.

## Requirements

1. Create an interactive component with three sections: "Lifecycle", "Commands", "Data Sharing"
2. "Lifecycle" section — a visual diagram (ASCII or div blocks) showing: volume creation, attaching to a container, removing the container (data remains), attaching to a new container
3. "Commands" section — an interactive terminal simulator: buttons with the commands `docker volume create/ls/inspect/rm/prune`, clicking a button shows a sample command output
4. "Data Sharing" section — a step-by-step demonstration: two containers connected to the same volume, "Write Data" and "Read Data" buttons with a data flow visualization
5. Use tabs or an accordion to switch between sections
6. Add a "Named vs Anonymous Volumes" comparison table with a show/hide toggle

## Hints

- Use `useState` for the active section, command output, and data state
- For the lifecycle diagram, use div blocks with arrow characters
- For the terminal: an array of objects `{ command: string, output: string }`
- For data sharing: `sharedData` state updated by the buttons

## Checklist

- [ ] Three sections switchable via tabs/buttons
- [ ] Lifecycle diagram clearly illustrates data persistence
- [ ] At least 5 `docker volume` commands with sample output
- [ ] Demonstration of writing/reading data through a shared volume
- [ ] Comparison table of named and anonymous volumes

## How to Verify

1. Switch between sections — each should display its own content
2. Click command buttons — the output should update
3. Click "Write Data", then "Read Data" — the data should be visible
4. Verify that the comparison table correctly shows the differences
