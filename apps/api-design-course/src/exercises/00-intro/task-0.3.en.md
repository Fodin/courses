# Task 0.3: API Analysis (Self-check)

## Goal

Apply quality API design criteria to a real popular API and form your own assessment.

## Requirements

1. Create a `Task0_3` component that shows a breakdown of a **real public API** against selected criteria
2. Use at least **5 evaluation criteria** with each one's weight specified (in percentages, sum = 100%)
3. For each criterion, display:
   - The selected API's score (on a 1–10 scale)
   - A comment with justification
   - An example from the real API (HTTP request, response, or code snippet)
4. Show the final weighted score
5. Add a **self-check block**: suggest the user independently analyze another public API using the same criteria
6. The self-check block contains a list of criteria to fill in and a "Mark as completed" button

## Checklist

- [ ] At least 5 evaluation criteria
- [ ] Sum of criterion weights = 100%
- [ ] For each criterion: score + comment + code example
- [ ] Final weighted score is displayed
- [ ] Self-check block is present
- [ ] "Mark as completed" button changes state
- [ ] Criteria can be expanded/collapsed for detailed viewing
- [ ] Component wrapped in `<div className="exercise-container">`

## How to Check Yourself

1. Open the task and study the breakdown of the selected API
2. Click "Expand all criteria" — all details should become visible
3. Check: the sum of weights in the criterion headers should total 100%
4. Read the code example for each criterion — make sure it is real (not made up)
5. Go to the self-check block and pick any other public API (Stripe, Telegram Bot API, OpenWeatherMap, Spotify API)
6. Write down your own scores and comments
7. Click "Mark as completed" — the button should change its text to "Completed"

## Recommended APIs for Self-Check

- **Stripe API** (stripe.com/docs/api) — payment, industry gold standard
- **Telegram Bot API** (core.telegram.org/bots/api) — simple and predictable
- **OpenWeatherMap API** (openweathermap.org/api) — a good example with problems
- **Spotify Web API** (developer.spotify.com) — complex, feature-rich
- **JSONPlaceholder** (jsonplaceholder.typicode.com) — a simple learning API
