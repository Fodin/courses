# Task 0.1: CI vs CD vs CD — understanding the terms

## Goal

Understand and reinforce the difference between three key concepts: Continuous Integration, Continuous Delivery, and Continuous Deployment. Implement an interactive comparison table that clearly shows how they differ.

---

## What to do

Create a `Task0_1` component that displays an interactive comparison table of three CI/CD concepts.

### Requirements

1. Define a TypeScript interface `PhaseInfo` with fields:
   - `id` — unique identifier (`'ci' | 'delivery' | 'deployment'`)
   - `title` — concept name (e.g., `'Continuous Integration'`)
   - `shortName` — short name (`'CI'`, `'C.Delivery'`, `'C.Deployment'`)
   - `goal` — main goal of the phase (string)
   - `automatedSteps` — list of automated steps (array of strings)
   - `manualStep` — manual step, if any (string or `null`)
   - `frequency` — how often it happens (string)
   - `color` — color for visual highlighting (string with hex code)

2. Create a `phases` array with data for all three concepts

3. Implement a `selectedPhase` state — stores the id of the selected phase or `null`

4. Display three cards (one per concept) in a row via flex. Clicking a card should expand it and show detailed information

5. In the expanded card, show:
   - List of automatic steps with green check icons (✅)
   - Manual step (if any) with a yellow icon (⚠️) or "Fully automated" text with green icon (✅)
   - Deploy frequency

6. Add an "Activities" section — a list of 6-8 actions (e.g., "run tests", "deploy to prod", "build Docker image") that the student should assign to the correct phase using drag-and-drop or buttons

---

## Expected result

- Three cards with color highlighting: blue (CI), yellow (Delivery), green (Deployment)
- Clicking a card shows details of that phase
- Visual distinction between manual and automatic steps
- List of activities with the ability to assign each to a phase

---

## Checklist

- [ ] `PhaseInfo` interface defined with all fields
- [ ] `phases` data array created with three objects
- [ ] `selectedPhase` state implemented
- [ ] Three cards displayed in a row (flex)
- [ ] Clicking a card expands its details
- [ ] Details show automatic and manual steps
- [ ] Activities section for classification exists
- [ ] Component is correctly typed (no `any`)

---

## How to check yourself

1. Open the component in the browser — do you see three cards in a row?
2. Click on "Continuous Integration" — did the details expand?
3. Click on "Continuous Deployment" — do you see "Fully automated" (no manual step)?
4. Click on "Continuous Delivery" — do you see the manual step "Deploy to prod"?
5. Try classifying activities — do the buttons work?
