# Task 3.3: Variable Expansion — Expanding Variables

## Goal

Create an interactive variable expansion demonstrator: the user writes a YAML script with variables, presses "Resolve", and sees the expanded result — as it would appear in a real CI log.

## Requirements

1. Textarea for script input (multiline, with variables of the form `$VAR` and `${VAR}`)
2. Section of preset context variables (CI_COMMIT_SHA, CI_COMMIT_SHORT_SHA, CI_COMMIT_REF_NAME, CI_PROJECT_NAME, CI_REGISTRY_IMAGE)
3. Ability to add a custom variable (name + value) and remove it
4. "Resolve" button — replaces all `$VAR` and `${VAR}` in the text with real values
5. Output two panels: "Raw" (original script) and "Resolved" (with substituted values)
6. Support for `${VAR:-default}` syntax — if variable is not set, substitute the default

## Checklist

- [ ] Textarea with placeholder example script (3-5 lines with variables)
- [ ] Block of preset variables with realistic values
- [ ] Form for adding custom variables (two inputs: name and value, "+" button)
- [ ] Delete button on each custom variable
- [ ] "Resolve" button performs substitution
- [ ] "Raw" panel shows the original text
- [ ] "Resolved" panel shows the result, unresolved variables highlighted in red/italic
- [ ] Support for `${VAR:-default}`

## How to Verify

1. Enter `docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .` → should expand to real values
2. Enter `${UNKNOWN_VAR:-fallback}` → should substitute "fallback"
3. Add a custom variable `APP_NAME=myservice`, use it in the script → should be substituted
4. Enter `echo $CI_COMMIT_REF_NAME` → should return the branch name
5. Delete the custom variable, press "Resolve" again → the variable is no longer substituted

## Hints

- Store variables as `Record<string, string>` — easy to look up by name
- Use `String.replace()` with regular expressions for substitution:
  - `\$\{(\w+):-([^}]*)\}` — for `${VAR:-default}`
  - `\$\{(\w+)\}` — for `${VAR}`
  - `\$(\w+)` — for `$VAR`
- Order matters: first process `${VAR:-default}`, then `${VAR}`, then `$VAR`
- To highlight unresolved variables in the resolved panel, scan the text again and wrap `$...` in `<span style={{ color: 'red' }}>`
- Use `dangerouslySetInnerHTML` in React to render HTML from a string
