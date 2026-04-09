# Task 13.2: Migration Plan Builder

## Goal

Create an interactive tool for building a monolith migration plan: enter domain characteristics, get automatic ranking by extraction priority, and generate a visual roadmap with phases, risks, and recommendations.

## Requirements

1. Display domain table with editable fields: name, size (S/M/L/XL with LOC), API dependencies (0–20), shared state entities (0–10), business criticality (low/medium/high/critical), change frequency (rare/monthly/weekly/daily)
2. Calculate priority score for each domain in real time: high frequency + low criticality + small size + few dependencies = high score
3. Sort domains by descending score and display priority bar next to each domain; first in list marked with 🥇 icon
4. Support adding new domains (input field + "Add" button, Enter also works) and deleting existing ones
5. "Generate Migration Roadmap" button — splits sorted domains into 3 phases and for each outputs: domain list, complexity estimate (low/medium/high), risk list, recommendation list, estimate in weeks
6. Display timeline — horizontal phase blocks, width proportional to weeks, color matches complexity
7. After any table change, roadmap resets (needs regeneration)

## Checklist

- [ ] Table with 6 predefined domains, all fields editable
- [ ] Domains sorted by descending priority score on every change
- [ ] First domain in list marked with 🥇 icon
- [ ] Priority bar changes width on parameter change (green/yellow/red)
- [ ] Can add domain via field + button or Enter
- [ ] Can delete any domain with "×" button
- [ ] After parameter change, roadmap disappears (requires regeneration)
- [ ] Generate button creates 3 phases with domains, complexity, risks, recommendations
- [ ] Timeline shows horizontal phase blocks with proportional sizes
- [ ] Phase color in timeline and card matches complexity: green/yellow/red
- [ ] Each phase card contains risks and recommendations

## How to Check Yourself

1. Open the task — you'll see a table with 6 domains. Analytics and Profile should be at the top (high score: non-critical, small, few dependencies)
2. Change Analytics size from S to XL — its score should drop and it moves down the list
3. Restore size, click "Generate Migration Roadmap" — 3 phases and timeline appear
4. Add new domain "Payments" with critical criticality and daily frequency — it should land in the last phase (high criticality reduces priority)
5. Change any parameter — roadmap should disappear, showing regeneration is needed
