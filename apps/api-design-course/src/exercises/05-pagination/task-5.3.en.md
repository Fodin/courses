# Task 5.3 — Pagination Design: Self-Check

## Goal

Reinforce understanding of when to use offset vs cursor pagination, and learn to justify the choice based on product requirements.

## Requirements

1. The component contains 3 scenarios with different pagination requirements.
2. Each scenario has:
   - A product description and context
   - A list of requirements (at least 4 items)
   - Two answer options: "Offset (page/limit)" or "Cursor (after/first)"
   - A "Check" button (active after selecting an option)
3. After checking, the following is displayed:
   - If the answer is incorrect: a red block explaining why the selected option is not suitable
   - The correct answer with an example request URL
   - A list of justifications (at least 4 items)
   - An example JSON response
4. The selected option cannot be changed after pressing "Check."
5. The card expands/collapses by clicking on the heading.
6. After checking — a green or red border appears around the card.

## Checklist

- [ ] At least 3 scenarios
- [ ] Choice between offset and cursor for each scenario
- [ ] Locking selection after checking
- [ ] Displaying why the incorrect option is poorly suited
- [ ] Justification for the correct answer (at least 4 reasons)
- [ ] Example URL and example response for the correct option
- [ ] Visual correctness indicator (green / red)

## How to Check Yourself

Complete all 3 scenarios without looking at the theory. For each scenario:
1. Read the description and requirements.
2. Choose the pagination type.
3. Press "Check" and read the justification.
Goal — correctly answer all 3 scenarios on the first attempt, relying solely on the requirements.
