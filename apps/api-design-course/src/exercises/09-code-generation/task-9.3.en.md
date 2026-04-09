# Task 9.3: Setting Up Type Generation

## Goal

Create an interactive checklist — a step-by-step guide for setting up `openapi-typescript` in a real project. 6 steps: installation, package.json scripts, gitignore strategy, typed client, React component, CI/CD pipeline. Progress bar and checkboxes.

## Requirements

1. Implement a `ChecklistItem` interface with fields: `id`, `step`, `title`, `description`, `code`, `lang`
2. Create 6 steps with realistic code: bash, json, typescript, yaml
3. Progress bar in percentage — updates when steps are checked
4. Left panel: list of steps with clickable rows and checkboxes
5. Right panel: detailed view of the active step with code
6. "Back" and "Mark and Continue" buttons for step navigation

## What to Implement

- [ ] `ChecklistItem` interface and `SETUP_STEPS` array (6 elements)
- [ ] `checked: Set<string>` and `activeStep: string` states
- [ ] Progress bar: width = `(checked.size / SETUP_STEPS.length) * 100%`, green at 100%
- [ ] Counter: "N of 6 steps completed", at 100% add "Setup complete!"
- [ ] Left list: click on row → changes `activeStep`, click on checkbox → toggle in `checked`
- [ ] Right block: step number, title, description, mark button, code with highlighting
- [ ] Language colors: `bash` → `#a3e635`, `json` → `#fbbf24`, `typescript` → `#93c5fd`, `yaml` → `#f0abfc`
- [ ] "Mark and Continue" button simultaneously toggles check + moves to the next step

## Setup Steps

| Step | ID | Language |
|---|---|---|
| 1 | `install` | bash |
| 2 | `script` | json |
| 3 | `gitignore` | bash |
| 4 | `client` | typescript |
| 5 | `usage` | typescript |
| 6 | `ci` | yaml |

## How to Check Yourself

- When all 6 steps are checked, the progress bar turns green and "Setup complete!" appears
- Clicking a checkbox in the list (left panel) does not change the active step
- The "Mark and Continue" button checks the current step AND moves to the next one
- On the last step, the "Mark and Continue" button does not appear (only "Back")
- On the first step, the "Back" button does not appear
- Step 4 (`client`) contains an example with `openapi-fetch` and `createClient<paths>`
