# Task 10.1: Anatomy of Good Documentation

## Goal

Study 12 key criteria of quality API documentation and learn to distinguish good implementations from bad ones.

## Requirements

1. Display an interactive checklist of 12 good documentation criteria
2. Each criterion must be checkable (checkbox) — when checked, text is strikethrough
3. A progress bar shows the percentage of completed criteria (X / 12, %)
4. Show a congratulatory message when reaching 100%
5. Implement filtering by categories (Structure, Security, Reference, Examples, Errors, Limits, Versioning, SDK, Tools)
6. Clicking on a criterion — expands details: why it matters, example of bad implementation (red), example of good (green)
7. Each criterion must have an importance marker: Critical / Important / Useful
8. Only one criterion can be open at a time (accordion)

## Checklist Criteria

- Getting Started / Quick Start
- Authentication and Authorization
- Complete endpoint reference
- Request examples (cURL + SDK)
- Response examples with real data
- Error code reference
- Rate limits and quotas
- Pagination and filtering
- Changelog and version history
- SDKs and libraries
- Sandbox / test environment
- Interactive sandbox (Try it out)

## Checklist

- [ ] Checklist of 12 criteria with ability to check them off
- [ ] Progress bar with percentage and counter
- [ ] Congratulation at 100%
- [ ] Filtering by category
- [ ] Accordion with details on click
- [ ] Importance markers (Critical / Important / Useful)
- [ ] Examples of bad and good implementation for each criterion

## How to Check Yourself

Open the component in a browser:
1. Make sure the progress bar grows when checking checkboxes
2. Click on a criterion — details with code examples should appear
3. Try the "Security" category filter — only criteria of that category should remain
4. Check all 12 criteria — a congratulation should appear
