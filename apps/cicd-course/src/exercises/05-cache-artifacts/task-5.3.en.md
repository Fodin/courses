# Task 5.3: Cache vs Artifacts — Choosing the Right One

## Goal

Create an interactive decision matrix that presents each scenario and asks the student to choose: cache or artifacts — then explains the correct answer.

## Requirements

1. Display 8 usage scenarios one at a time (or all at once as cards)
2. For each scenario, show a task description and two options: "Cache" and "Artifacts"
3. When an option is selected — show whether it's correct and explain why
4. After answering all scenarios — show final score and summary table
5. "Start Over" button to retake the quiz

Scenarios to use:
- Pass built `dist/` from build to deploy
- Speed up `npm install` between pipelines
- Save JUnit test results for display in MR
- Reuse Maven dependencies from `.m2/`
- Pass Docker image digest from build to sign-job
- Save failure logs for postmortem
- Store pip packages between runs
- Pass coverage-report from test to report-job

## Checklist

- [ ] 8 scenarios with descriptions in English
- [ ] For each scenario — two buttons: "Cache" and "Artifacts"
- [ ] After selection — color coding: green (correct) / red (incorrect)
- [ ] Explanation of the correct answer (2-3 sentences)
- [ ] Progress: "Scenario 3 of 8" or a progress bar
- [ ] Final screen: score, brief summary of each answer
- [ ] "Start Over" button resets all answers

## How to Verify

1. Answer "Artifacts" for the scenario "Pass dist/ from build to deploy" — should be correct
2. Answer "Cache" for the scenario "Speed up npm install" — should be correct
3. Intentionally answer incorrectly — make sure the explanation is useful and clear
4. Complete all 8 scenarios — final screen should appear
5. Press "Start Over" — everything should reset

## Hints

- Store scenario data in an array: `{ id, description, correct: 'cache'|'artifacts', explanation }`
- `useState` for: `currentIndex` (current scenario number), `answers` (array of answers), `showResults` (show final screen)
- On correct answer use `backgroundColor: '#e8f5e9'`, on incorrect — `'#ffebee'`
- For the final screen, count `answers.filter(a => a.isCorrect).length`
