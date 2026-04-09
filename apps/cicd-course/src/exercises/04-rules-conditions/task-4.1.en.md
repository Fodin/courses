# Task 4.1: rules:if — Variable-Based Conditions

## Goal

Create an interactive `rules:if` simulator — a visual condition builder that shows which GitLab CI jobs will run for different pipeline events.

## Requirements

1. Event selection block: buttons for 5 event types (push to main, push to feature branch, MR, tag, schedule)
2. When an event is selected — CI variables are automatically set ($CI_COMMIT_BRANCH, $CI_PIPELINE_SOURCE, $CI_COMMIT_TAG, $CI_MERGE_REQUEST_IID)
3. "Current variables" panel — shows set values as code blocks
4. List of 5 jobs with rules:if configuration (each with different conditions)
5. For each job — a "will run / won't run" indicator with explanation
6. Visual decision tree: rule evaluation order for the active job when an event is selected

## Data Structure

```ts
interface CIEvent {
  id: string
  label: string        // "Push to main"
  variables: {
    CI_COMMIT_BRANCH: string
    CI_PIPELINE_SOURCE: string
    CI_COMMIT_TAG: string
    CI_MERGE_REQUEST_IID: string
  }
}

interface CIJob {
  name: string
  rules: Array<{
    condition: string   // text description of the condition
    when: string        // on_success | never | manual
    evaluate: (vars: Record<string, string>) => boolean
  }>
}
```

## Events for Simulation

| ID | Name | branch | source | tag | MR IID |
|---|---|---|---|---|---|
| push-main | Push to main | main | push | "" | "" |
| push-feature | Push to feature | feature/auth | push | "" | "" |
| merge-request | Merge Request | "" | merge_request_event | "" | "42" |
| tag-release | Tag v1.2.3 | "" | push | v1.2.3 | "" |
| schedule | Schedule | main | schedule | "" | "" |

## Checklist

- [ ] 5 event selection buttons, active button highlighted
- [ ] "Current CI Variables" block with 4 variables in code tags
- [ ] 5 jobs with different rules:if (deploy-prod, test, mr-lint, release-publish, nightly-backup)
- [ ] Each job shows: will run (green) or won't (gray) with explanation
- [ ] Decision tree for the selected event shows rule evaluation order
- [ ] Uses useState for the active event

## How to Verify

- Select "Push to main" — deploy-prod and test should run, mr-lint and release-publish should not
- Select "Merge Request" — mr-lint should run, not deploy-prod
- Select "Tag v1.2.3" — release-publish should run
- Select "Schedule" — nightly-backup should run
- Variables in the block should change when switching events
