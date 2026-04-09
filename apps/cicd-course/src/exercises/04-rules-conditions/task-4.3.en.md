# Task 4.3: workflow:rules — Pipeline Management

## Goal

Create a pipeline deduplication simulator: show the double-launch problem with branch + MR events and visualize how `workflow:rules` solves it.

## Requirements

1. Mode switcher: "Without workflow:rules" / "With workflow:rules"
2. Event simulator: "Push to feature/auth branch" and "Open MR from feature/auth" buttons
3. In "without rules" mode — both events create pipelines (display both)
4. In "with rules" mode — branch pipeline is blocked when push happens with an open MR
5. Event log — timeline of actions and created pipelines
6. Runner-minute counter (branch without MR — 5 min, MR — 5 min, duplicate = 10 min)
7. Visual pipeline card: type (branch/mr), status (created/blocked), source

## Simulation Scenario

```
Step 1: git push feature/auth
  → Without rules: branch pipeline created [push]
  → With rules: branch pipeline created [push] (MR not yet opened)

Step 2: Open MR from feature/auth to main
  → Without rules: MR pipeline created [merge_request_event]
                branch pipeline already running → two pipelines!
  → With rules: MR pipeline created [merge_request_event]
                branch pipeline blocked by workflow:rules
```

## workflow:rules Configuration for Display

```yaml
# Mode "With workflow:rules"
workflow:
  rules:
    - if: $CI_MERGE_REQUEST_IID      # MR exists → MR pipeline
    - if: $CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS
      when: never                     # MR exists → block branch
    - if: $CI_COMMIT_BRANCH           # no MR → branch pipeline
```

## Checklist

- [ ] Mode switcher (without/with workflow:rules) with visual highlight on active
- [ ] "Push to branch" button — adds event to log
- [ ] "Open MR" button — adds event to log
- [ ] "Reset" button — clears log and counters
- [ ] Pipeline cards: type, CI_PIPELINE_SOURCE, status
- [ ] Blocked pipelines displayed in gray with blocking reason
- [ ] Total runner-minute counter
- [ ] YAML configuration block for workflow:rules (activated in "with rules" mode)

## How to Verify

- "Without rules" mode: press "Push" → press "Open MR" → 2 pipelines should appear, 10 min
- "With rules" mode: press "Push" (1 pipeline, 5 min) → press "Open MR" → branch blocked, only MR pipeline
- Total in "with rules" mode — 1 pipeline instead of 2
- Reset clears everything to initial state
