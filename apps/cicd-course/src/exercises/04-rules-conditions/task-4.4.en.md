# Task 4.4: Combining Rules

## Goal

Create a builder for complex `rules` — an interface for adding rules with `if`, `changes`, `exists` conditions, AND/OR logic visualization, and YAML preview.

## Requirements

1. Rule addition interface: form with fields for if, changes (list of patterns), when
2. List of added rules with ability to remove each
3. Logic visualization: rules — OR between rules, within a rule — AND between conditions
4. Simulator: select a test event → highlight the first matching rule
5. YAML preview — generate rules configuration from added rules
6. "Load Example" buttons with 3 ready-made configurations

## New Rule Form Fields

| Field | Type | Description |
|---|---|---|
| if (condition) | select + text | Variable selection + operator + value |
| changes patterns | textarea | One pattern per line |
| when | select | on_success / never / manual / always |

## Ready-Made Configuration Examples

**Example 1: MR + changes**
```yaml
rules:
  - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    changes: [src/**/*]
    when: on_success
  - if: $CI_COMMIT_BRANCH == "main"
    when: on_success
  - when: never
```

**Example 2: Production deploy**
```yaml
rules:
  - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
    when: on_success
  - if: $CI_COMMIT_BRANCH == "main"
    when: manual
  - when: never
```

**Example 3: Load tests**
```yaml
rules:
  - if: $CI_PIPELINE_SOURCE == "schedule"
    when: always
  - if: $CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"
    when: manual
  - when: never
```

## Checklist

- [ ] Rule addition form with three fields (if / changes / when)
- [ ] "Add Rule" button — adds to the list
- [ ] List of rules with delete button for each
- [ ] "AND/OR Logic" block — diagram: rule rectangles (OR) → condition circles within each rule (AND)
- [ ] Test simulator: event dropdown, "Check" button
- [ ] Highlight of the first matching rule during simulation
- [ ] YAML preview block, updated reactively
- [ ] 3 "Load Example" buttons with ready-made configurations

## How to Verify

- Load "Example 1" → select event "MR + changes in src/" → first rule should highlight
- Load "Example 1" → select "Push to main" → second rule should highlight
- Load "Example 1" → select "Push to feature" → no rule except fallback (never) should match
- Add your own rule → it should appear in the YAML preview
- Delete a rule → YAML should update without it
