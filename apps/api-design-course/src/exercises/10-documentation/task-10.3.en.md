# Task 10.3: Evaluating Real APIs

## Goal

Apply the criteria from Task 10.1 to real public APIs and form an objective assessment of their documentation quality.

## Requirements

1. Evaluate three public APIs: Stripe, GitHub, Twitter/X
2. Each API is rated on 10 criteria with a score from 1 to 10
3. Show the overall score (average) with color coding (green 9-10, yellow 7-8, red 5-6)
4. Each criterion is a clickable card that expands with a score justification comment
5. A mini progress bar inside each criterion card visualizes the score
6. "Show comparison of all three APIs" button — expands a summary table
7. In the table: rows are criteria, columns are APIs, last row is the overall score

## Evaluation Criteria

- Getting Started
- Authentication
- Reference
- Code Examples
- Error Codes
- Interactivity
- SDK / Libraries
- Sandbox / Test Environment
- Changelog
- Documentation Search

## Reference Scores

**Stripe** — the gold standard (average score ~9.8/10): best examples in 8 languages, excellent sandbox with test cards
**GitHub** — good documentation (average ~7.6/10): complete reference, but no Try it out or sandbox
**Twitter/X** — adequate (average ~6.2/10): has everything needed, but quality is below competitors

## Checklist

- [ ] Three tab buttons for selecting an API
- [ ] Summary card with colored score and tagline
- [ ] 10 criterion cards with scores and progress bars
- [ ] Clicking a card expands with justification
- [ ] Color coding for scores (green / yellow / red)
- [ ] "Show comparison" button — summary table
- [ ] Final row in the table with scores for all three APIs

## How to Check Yourself

1. Switch between Stripe, GitHub, and Twitter/X — data should change
2. Click on several criterion cards — comments should expand
3. Click "Show comparison" — a table with all three APIs should appear
4. Make sure the overall scores in the table match the card scores
5. Check color coding: Stripe should be green, Twitter/X — red
