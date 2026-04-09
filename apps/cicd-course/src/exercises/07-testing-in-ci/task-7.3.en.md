# Task 7.3: Coverage and JUnit Reports

## Goal

Create an interactive test reporting configurator: JUnit XML and coverage. The user selects a test framework, report format, and sees the ready configuration with the correct coverage regex and artifacts:reports settings.

## Requirements

1. Implement test framework selection: Jest, Vitest, pytest, go test — each with its own coverage output
2. When a framework is selected, show a simulated coverage stdout output (imitating real output)
3. Show a regex input field with a "Test" button — it tests the regex against the sample output and highlights the found number
4. Provide ready-made regex options for each framework (selectable by button)
5. Implement coverage report format selection: regex only, Cobertura XML, lcov
6. When Cobertura is selected — show an additional artifacts:reports:coverage_report block
7. Show an `artifacts:when` toggle with explanation of why `always` is important for test reports
8. Generate the final YAML config

## Checklist

- [ ] Framework selection buttons (Jest, Vitest, pytest, go test)
- [ ] Block with simulated coverage output for the selected framework
- [ ] Regex input field with live testing against sample output
- [ ] Highlighting of the found number in the sample output on regex match
- [ ] Buttons with ready-made regexes for each framework
- [ ] Format selection: regex only / Cobertura / lcov
- [ ] YAML with artifacts:reports:junit and coverage_report (for Cobertura)
- [ ] Explanation of why artifacts:when: always is important

## How to Verify

1. Select Jest — sample output should show lines like "Lines : 85.32%"
2. Press "Use ready-made regex" — it should highlight "85.32" in the sample output
3. Enter an incorrect regex — a "Regex did not match" message should appear
4. Select Cobertura — YAML should get a coverage_report block
5. Switch when to on_success — a warning about losing reports on failure should appear

## Hints

- Simulated output — just string constants for each framework
- Test regex: `new RegExp(userRegex).exec(exampleOutput)?.[1]`
- On regex error, use try/catch around `new RegExp()`
- Highlight the number in output via split + span with background
- Use `useState` for: `framework`, `userRegex`, `coverageFormat`, `artifactsWhen`
