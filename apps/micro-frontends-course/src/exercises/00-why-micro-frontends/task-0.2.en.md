# Task 0.2 — MFE Readiness Audit

## Goal

Implement an 8-question survey form that computes the project's readiness Index for transitioning to micro-frontends and provides justified recommendations with a category breakdown.

## Requirements

1. Render **8 questions** as cards:
   - Category (small text: Organization, Deploy, Development, Performance, Architecture)
   - Question number and text
   - Hint in italics — why this question is important
   - 4 answer options (radio buttons) with weights 0, 1, 2, 3

2. **Progress bar**: answered / total questions.

3. **"Get Results"** button — enabled only when all 8 questions are answered. Otherwise show how many are remaining.

4. **Result** (displayed after clicking the button):
   - Readiness Index: `Math.round(totalScore / maxScore * 100)`%
   - Color scale:
     - < 30% → green → "Monolith is fine"
     - 30-60% → orange → "Consider Partial Decomposition"
     - > 60% → blue → "Time to switch to MFEs"
   - Textual explanation of the recommendation
   - **Category breakdown**: for each category — readiness percentage + progress bar
   - After showing the result — show `explanation` for each selected answer
   - "Retake" button — resets state

5. Questions and their options:

| Question | Options (weight) |
|---|---|
| Number of teams | 1 (0), 2 (1), 3-5 (2), 6+ (3) |
| Deploy frequency | Once a month (0), Once a week (1), Several times/week (2), Several times/day (3) |
| Merge conflicts | Almost never (0), Sometimes (1), Regularly (2), Constantly (3) |
| Bundle size | < 200 KB (0), 200-500 KB (1), 500 KB-1 MB (2), > 1 MB (3) |
| CI time | < 5 min (0), 5-15 min (1), 15-30 min (2), > 30 min (3) |
| Shared state | Everything in one store (0), Some local (1), Minimal (2), Isolated (3) |
| Different stacks | No (0), For new features (1), There's legacy (2), Teams require it (3) |
| Team autonomy | One architect (0), RFC process (1), Autonomous within domains (2), Full autonomy (3) |

## Checklist

- [ ] 8 questions displayed as cards with category, hint, and options
- [ ] Radio buttons: selected option is visually highlighted
- [ ] Progress bar updates as answers are selected
- [ ] Result button is disabled until all questions are answered
- [ ] Index is calculated by the formula: `round(sum / (8*3) * 100)`
- [ ] Three levels of recommendations with different colors and texts
- [ ] Category breakdown with progress bars
- [ ] After showing the result, explanations appear for selected answers
- [ ] "Retake" button resets all answers

## How to Test Yourself

1. Answer all questions with minimum scores (0) → result should be < 30% → green recommendation "Monolith is fine".
2. Answer all questions with maximum scores (3) → result should be > 60% → blue recommendation "Time to switch to MFEs".
3. Mixed answers → orange recommendation in the 30-60% range.
4. Make sure explanations for options only appear after clicking "Get Results".
