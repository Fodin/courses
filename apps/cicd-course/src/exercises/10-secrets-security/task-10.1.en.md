# Task 10.1: CI/CD Variables — Types, Masking, Scope

## Goal

Create an interactive CI/CD variable builder. The user configures variable parameters (type, masked, protected, scope), sees the resulting YAML, and understands under which conditions a job will have access to the variable.

## Requirements

1. Implement **variable type** selection: `Variable` (string) or `File` (path to temp file). When File is selected, show an explanation that `$MY_VAR` will contain a path like `/tmp/gitlab-runner-file123`.
2. Implement **Masked** and **Protected** toggles (checkboxes or toggle buttons). When Masked is enabled, show how the value looks in logs (`[MASKED]`). When Protected is enabled — visually show which branches the variable is available on.
3. Show a **warning** when these are selected simultaneously: type `Variable`, Masked enabled, and the entered value contains a space or line break — "Masked doesn't work for this value".
4. Implement **scope** selection via three buttons: `Project`, `Group`, `Instance`. Show a nesting diagram of the levels.
5. Implement an **access simulator**: show two scenarios — pipeline on `main (protected)` and pipeline on `feature/my-feature`. Highlight whether the job gets access to the variable in each case.
6. Display a generated **example of YAML usage** (not the variable definition, but how to reference it in a script).

## Checklist

- [ ] Type selector: Variable / File with description of the difference
- [ ] Masked and Protected checkboxes
- [ ] Variable value input field with masked validation
- [ ] Warning for incompatible parameters (masked + multiline/spaces)
- [ ] Three scope buttons with visual level hierarchy
- [ ] Simulator: two scenarios (protected branch / regular branch) with color-coded access
- [ ] Block with example YAML usage of the variable
- [ ] Example job log: with value and with [MASKED]

## How to Verify

1. Select type `File` — the usage example should show `kubectl --kubeconfig=$MY_VAR`, not a direct value
2. Enable `Masked`, enter a value with spaces — an incompatibility warning should appear
3. Enable `Protected`, select scope `Project` — in the simulator `feature/my-feature` should show "no access"
4. Disable `Protected` — both scenarios in the simulator should show access
5. Select scope `Group` — the hierarchy diagram should show group → project

## Hints

- Use `useState` for: `varType` ('variable'|'file'), `masked` (boolean), `protected` (boolean), `scope` ('project'|'group'|'instance'), `value` (string)
- For detecting multiline/spaces in value: `value.includes(' ') || value.includes('\n')`
- Simulator: two objects `{ branch: 'main', isProtected: true }` and `{ branch: 'feature/my-feature', isProtected: false }`
- Access color: green (#E8F5E9 / #2E7D32) for "has access", red (#FFEBEE / #C62828) for "no access"
