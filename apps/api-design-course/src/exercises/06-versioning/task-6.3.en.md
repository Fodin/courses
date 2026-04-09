# Task 6.3: Choosing a Versioning Strategy

## Goal

Implement a self-check component with 4 scenarios. In each scenario, the student chooses a versioning strategy and receives an explanation of the correct answer with justification.

## Requirements

1. Show 4 scenarios: public API, internal microservice, mobile app, SaaS platform
2. Display tags with characteristics for each scenario
3. Three answer options: URL versioning, Header versioning, Query param versioning
4. After selecting — a "Check" button appears (active only if an answer is selected)
5. After checking: show correct/incorrect answer with justification
6. Navigation between scenarios (buttons + progress indicator)
7. Final score after completing all scenarios

## Checklist

- [ ] Progress bar of 4 segments (green = correct, red = incorrect, blue = current)
- [ ] Scenario characteristic tags (API type, number of clients, etc.)
- [ ] Three option buttons, clickable before checking
- [ ] Selected option is highlighted (blue border before checking)
- [ ] After checking: correct answer — green, incorrect — red
- [ ] Justification block appears after pressing "Check"
- [ ] Optional warning for difficult scenarios
- [ ] Final score X/4 after completing all scenarios

## How to Check Yourself

Scenario 1 (Public API): correct answer — URL versioning
Scenario 2 (Internal microservice): correct answer — Header versioning
Scenario 3 (Mobile app): correct answer — URL versioning
Scenario 4 (SaaS platform): correct answer — Header versioning

- Intentionally answer incorrectly — a red block with justification should appear
- After completing all 4 scenarios, a final score should appear
