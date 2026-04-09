# Task 6.3: Setting Up a Self-Hosted Runner

## Goal

Create a step-by-step GitLab Runner registration wizard that guides the user through the entire process and generates a ready-to-use config.toml.

## Requirements

1. Define a `WizardStep` type as a union: `'url' | 'token' | 'executor' | 'tags' | 'settings' | 'result'`

2. Implement 6 wizard steps:
   - **Step 1 (url)**: Enter GitLab instance URL (https://gitlab.com or self-hosted). Validation: must start with https://
   - **Step 2 (token)**: Enter registration token (starts with glrt- or length > 20 characters). Show where to find it: Settings > CI/CD > Runners
   - **Step 3 (executor)**: Choose executor (Docker / Shell / Kubernetes) with a brief description of each
   - **Step 4 (tags)**: Enter tags comma-separated. Autocomplete: docker, linux, shell, windows, production, staging. Add checkbox "Accept jobs without tags"
   - **Step 5 (settings)**: Additional settings depending on executor: for Docker — default image and privileged, for Shell — nothing special, for Kubernetes — namespace and image
   - **Step 6 (result)**: Final screen with generated `gitlab-runner register` command and `config.toml` contents

3. Show progress: visual step indicator (1 of 6, 2 of 6...)

4. "Back" and "Next" buttons. "Next" is only enabled when the current step has valid data

5. On the result step, show:
   - Registration command with `--non-interactive` flags
   - config.toml contents in a code block
   - "Copy" button for each block (simulated: changes text to "Copied!")

6. Different executors generate different config.toml

## Expected Result

- 6 wizard steps with navigation
- Validation on each step (Next button is disabled with invalid data)
- Final screen with real registration command and config.toml

## Checklist

- [ ] 6 steps implemented and switch correctly
- [ ] Step 1: URL validation (https://)
- [ ] Step 2: Token validation (length or glrt- format)
- [ ] Step 3: Executor selection with description
- [ ] Step 4: Tag input + runUntagged checkbox
- [ ] Step 5: Executor-specific settings
- [ ] Step 6: Correct generation of command and config.toml
- [ ] "Copy" button works (changes text)
- [ ] "Next" button is disabled when required fields are empty

## How to Verify

Complete the entire wizard: enter https://gitlab.com, any token longer than 20 characters, select Docker, add tags "docker,linux", specify image "alpine:latest". On step 6, a config.toml with `executor = "docker"` and `image = "alpine:latest"` should appear. Press "Copy" — the button text should change to "Copied!".
