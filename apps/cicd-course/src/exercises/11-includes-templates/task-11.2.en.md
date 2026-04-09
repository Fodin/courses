# Task 11.2: extends and !reference — Inheritance and Reuse

## Goal

Create an interactive config merge demonstrator. The user sees a base template and a child job, configures fields, and observes the deep merge result in real time.

## Requirements

1. Display two blocks: **Template** (`.base-job`) and **Child Job** on the left, **Result** on the right
2. In the template block, provide editable fields:
   - `image` (string)
   - `variables` (key-value pairs, at least 2)
   - `before_script` (list of commands)
   - `script` (list of commands)
3. In the child job block — the same fields (some may be empty)
4. The result block shows the deep merge outcome: for `variables` — key-by-key merge, for `script`/`before_script` — replaced by child
5. Visually highlight in the result: inherited fields (one color), overridden (another color), added (third color)
6. Add a "!reference" tab: show an example where `before_script` is taken from two different templates

## Checklist

- [ ] Two columns: template+child on left, result on right
- [ ] Editable fields: image, variables (at least 2 pairs), before_script, script
- [ ] Result updates in real time when fields change
- [ ] Color coding: inherited / overridden / added
- [ ] Color legend
- [ ] Tab or section with !reference example

## How to Verify

1. Leave `script` empty in child — result should show `script` from template
2. Fill in `script` in child — result should show ONLY the child script (override!)
3. Add a new variable in child (not in template) — result should contain variables from both
4. Change an existing variable value in child — result should show the child value
5. Switch to `!reference` tab — example should show correct syntax

## Hints

- Deep merge for `variables` (dictionary): `{ ...parent.variables, ...child.variables }`
- For lists (`script`, `before_script`): if child is non-empty — take child, otherwise — parent
- Color coding: `#E3F2FD` (blue, inherited), `#FFF3E0` (orange, overridden), `#E8F5E9` (green, added)
- For comparing variables: key from child not in parent = "added"; key in both with different values = "overridden"
