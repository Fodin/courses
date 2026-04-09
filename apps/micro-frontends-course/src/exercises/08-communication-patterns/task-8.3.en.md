# Task 8.3: Communication Pattern Selector

## Goal

Implement an interactive training exercise for choosing communication patterns: 6 real microfrontend scenarios where you need to choose the optimal approach and get detailed feedback.

## Requirements

1. 6 scenarios with title and detailed description
2. 5 pattern options: Custom Events, Shared State, URL/localStorage, Props via Shell, Orchestrator
3. User selects a pattern for the current scenario
4. After clicking "Check" — verdict displayed (correct/incorrect)
5. Show explanation of the correct answer (green block)
6. Show explanation of why a popular wrong choice is a mistake (orange block)
7. Cheat sheet for all 5 patterns as cards
8. "Next scenario →" button with circular navigation
9. On scenario change — reset selection and result
10. Navigation buttons for direct jump to any scenario

## Checklist

- [ ] Navigation: 6 scenario selection buttons, active highlighted in blue
- [ ] Scenario card with title "Scenario N: {name}" and description
- [ ] 5 pattern buttons, selected one highlighted with pattern color
- [ ] "Check" button appears after pattern selection
- [ ] "Check" button hides after result is shown
- [ ] Green banner "Correct!" or red "Incorrect. Correct answer: ..."
- [ ] Green block: "Why {correct pattern}?" + explanation
- [ ] Orange block: "Why not {wrong pattern}?" + explanation
- [ ] Cheat sheet: 2-column grid, 5 cards with colored left border
- [ ] "Next scenario →" button advances to next (cyclically)
- [ ] On scenario change via navigation — selection and result reset
- [ ] All styles inline

## How to Check

1. Select scenario 1 "Catalog adds item to cart"
2. Select "Shared State" — click Check — should show "Incorrect", correct answer Custom Events
3. Read explanation of why Custom Events is correct and why Shared State is wrong
4. Click "Next scenario →" — go to scenario 2
5. Select "Shared State" for scenario 2 — should show "Correct!"
6. Check each scenario: verify correct answer matches pattern selection logic
7. Click scenario 4 button — previous scenario selection should reset
