# Task 0.2: Richardson Maturity Model

## Goal

Understand the four levels of REST API maturity according to the Richardson model and learn to determine the level from an API example.

## Requirements

1. Create a `Task0_2` component with an interactive visualization of all **4 RMM levels** (Level 0–3)
2. For each level, display:
   - The name and description of the level
   - An example HTTP request and response for one scenario (e.g., "get order")
   - A list of level characteristics
3. Implement switching between levels (buttons or tabs) — Level 2 is active by default
4. Add a **mini-quiz**: at least 3 HTTP request examples, for each the user selects the RMM level
5. The quiz shows correct/incorrect answers and explanations
6. Count and display the number of correct answers

## Checklist

- [ ] All 4 levels (Level 0, 1, 2, 3) are implemented
- [ ] Each level has a request/response example
- [ ] Switching between levels works
- [ ] Mini-quiz with at least 3 questions
- [ ] Quiz shows the correct answer after selection
- [ ] Correct answer counter works
- [ ] After answering a question, it cannot be changed
- [ ] Component wrapped in `<div className="exercise-container">`

## How to Check Yourself

1. Open the task — Level 2 should be active
2. Switch to Level 0 — make sure the example shows "action tunneling" (everything through POST to a single endpoint)
3. Switch to Level 3 — the response example should contain `_links` with available actions
4. Answer the first quiz question — the correct answer and explanation should appear immediately
5. Try to answer the same question again — it should be locked
6. Answer all questions and check that the counter updates
