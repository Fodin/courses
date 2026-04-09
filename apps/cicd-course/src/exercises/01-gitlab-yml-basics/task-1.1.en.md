# Task 1.1: .gitlab-ci.yml structure

## Goal

Learn to assemble a valid `.gitlab-ci.yml` from individual blocks, understand the purpose of each keyword, and reinforce YAML syntax rules.

---

## What to do

Create a `Task1_1` component that implements an interactive `.gitlab-ci.yml` constructor. The user assembles the config from blocks, and the component shows the result and errors.

### Requirements

1. Define a TypeScript interface `YamlBlock` with fields:
   - `id` — unique block identifier
   - `label` — block name (e.g., `'stages'`, `'image'`, `'script'`)
   - `content` — YAML content of the block (string)
   - `required` — whether the block is required (boolean)
   - `description` — short description for hint

2. Implement a set of 6 blocks for the constructor:
   - `stages` — stage declaration
   - `image` — Docker image
   - `job-name` — job name
   - `stage` — stage membership
   - `script` — list of commands
   - `after_script` — post-script

3. Implement a `selectedBlocks` state — array of selected block ids

4. Display two sections:
   - **"Available blocks"** — cards with blocks that can be added
   - **"Your config"** — selected blocks as YAML

5. Implement validation when pressing the "Check" button:
   - Is there at least one job with a name
   - Is there a `script` keyword inside the job
   - If `stage` is specified — is there a corresponding entry in `stages`

6. Show validation result: green block "Config is valid" or red list of errors

---

## Expected result

- List of blocks, clickable to add to the config
- Real-time preview of assembled YAML
- "Check" button with validation result
- "Reset" button to clear selection

---

## Checklist

- [ ] `YamlBlock` interface defined with all fields
- [ ] 6 blocks implemented with real YAML content
- [ ] `selectedBlocks` state controls selection
- [ ] YAML displayed as code (monospace font)
- [ ] "Check" button triggers validation
- [ ] Errors displayed in red, success — in green
- [ ] "Reset" button clears selection
- [ ] No `any` in typing

---

## How to check yourself

1. Click on the `script` block — did it appear in "Your config"?
2. Press "Check" without the `job-name` block — do you see an error about missing job name?
3. Add all required blocks and press "Check" — do you see green "Config is valid"?
4. Press "Reset" — is the config cleared?
