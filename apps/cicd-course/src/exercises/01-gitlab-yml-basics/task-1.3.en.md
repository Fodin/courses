# Task 1.3: The script keyword

## Goal

Understand the nuances of the `script`, `before_script`, and `after_script` keywords: how they interact, what happens on errors, and how to properly organize multi-line commands.

---

## What to do

Create a `Task1_3` component that simulates CI job execution with console output. The student sees how commands execute and how exit code affects the result.

### Requirements

1. Define TypeScript interface `ScriptLine`:
   - `command` — command text
   - `output` — command output (string)
   - `exitCode` — exit code (0 = success, anything else = error)
   - `section` — `'before_script' | 'script' | 'after_script'`

2. Create three preset scenarios (`ScenarioId: 'success' | 'script-fail' | 'before-fail'`):
   - **"Successful execution"**: all commands return exit code 0
   - **"Error in script"**: one command in `script` returns exit code 1
   - **"Error in before_script"**: command in `before_script` returns exit code 1

3. Implement "console" output:
   - Dark background (e.g., `#1e1e1e`), green or white text
   - Each line starts with `$` for commands
   - Command output follows on the next line without `$`
   - Error lines are highlighted in red

4. Implement execution simulation with delay via `useState` + `useEffect`:
   - Commands appear one after another at ~500ms intervals
   - On error in `script` — subsequent `script` commands don't execute
   - `after_script` always runs (even after error in `script`)
   - `after_script` doesn't run if `before_script` failed

5. At the end, show the result: "Job succeeded" (green) or "Job failed" (red)

6. Add buttons for scenario selection and a "Run" button

---

## Expected result

- Three scenario selection buttons
- Dark-themed console with step-by-step command output
- Visual section separation (before_script / script / after_script)
- Clear demonstration that after_script runs on script error

---

## Checklist

- [ ] `ScriptLine` interface defined with all fields
- [ ] 3 scenarios implemented (success, script-fail, before-fail)
- [ ] Console has dark background and monospace font
- [ ] Commands and output are visually distinct
- [ ] Error lines highlighted in red
- [ ] after_script runs on error in script
- [ ] after_script does NOT run on error in before_script
- [ ] Final status "succeeded" / "failed" displayed at the end

---

## How to check yourself

1. Select "Successful execution" and press "Run" — all commands green, final status "Job succeeded"?
2. Select "Error in script" — after_script still ran, but Job failed?
3. Select "Error in before_script" — after_script didn't run, and Job failed?
4. Do you see visual boundaries between before_script, script, and after_script sections?
