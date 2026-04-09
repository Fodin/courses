# Task 15.3: Decision Matrix — Technology Selection for a Scenario

## Goal

Implement an interactive decision matrix with 4 real MFE architecture scenarios. For each scenario, choose a tech stack (integration + repository + deploy), then compare with an expert recommendation and get justification. The final score shows the level of course understanding.

## Requirements

1. Implement 4 scenarios (tabs/cards): Startup / Bank / E-commerce / SaaS, each with — title, description, constraints[], expertChoice, expertRationale, and a matchCriteria function for score calculation
2. Scenario tabs: active — blue, filled — green border + ✓ prefix
3. 2-column layout: left — description and constraint list (bullet points), right — user selection
4. Three selects for stack selection: Integration (5 options), Repository Structure (4 options), Deploy Strategy (5 options)
5. "Show Expert Recommendation" button activates only when all 3 fields are filled
6. After reveal: show score/3, feedback (explanation of matches/mismatches), expert choice with rationale. Block color: green (3/3), orange (2/3), red (<=1/3)
7. Implement matchCriteria logic for each scenario (score 0/0.5/1 for each of the 3 choices):
   - Startup: MF (1) / MF+SSPA (0.5) + monorepo (1) + independent deploy (1) / canary (0.5)
   - Bank: Web Components (1) / MF+SSPA (0.5) + polyrepo (1) + blue/green (1) / rolling (0.5)
   - E-commerce: MF (1) / MF+SSPA (0.5) + monorepo (1) + canary+FF (1) / blue/green (0.5)
   - SaaS: MF+SSPA (1) / MF (0.5) + monorepo (1) + independent deploy (1) / canary+FF (0.5)
8. Changing any select hides the reveal (resets revealed state)
9. "Final Score" button appears when all 4 scenarios are filled (not necessarily revealed)
10. Final score: X/12, label — "Senior-level Architect" (≥10), "Good understanding" (≥7), "Study theory deeper" (<7)

## Checklist

- [ ] 4 scenarios implemented with description, constraints, and expertChoice
- [ ] Tabs: green border and ✓ for filled scenarios
- [ ] 2-column layout: left — description, right — selection form
- [ ] 3 select dropdowns for each scenario with correct options
- [ ] "Show Expert Recommendation" button is disabled until all 3 fields are filled
- [ ] matchCriteria returns score (0-3) and feedback string
- [ ] Result block changes color: green (3/3), orange (2/3), red (<=1)
- [ ] Result block shows: total score, feedback, expert choice (3 lines), rationale
- [ ] Changing select hides reveal and resets score
- [ ] "Final Score" button is active only when all 4 scenarios are fully filled
- [ ] Final score X/12 with correct level label

## How to Check Yourself

1. Open the task — 4 tabs should be visible, first one active (Startup)
2. For Startup scenario, select: Module Federation + Monorepo (Nx) + Independent deploy → click "Show" → a green block "Great decision! 3/3" should appear
3. For Bank scenario, select: Module Federation + Monorepo + Blue/Green → expected score 1/3 (red)
4. For Bank scenario, select: Web Components + Polyrepo + Blue/Green → expected 3/3 (green)
5. Fill all 4 scenarios → "Final Score" button should appear
6. If all 4 match expert choices → 12/12 "Senior-level Architect"
