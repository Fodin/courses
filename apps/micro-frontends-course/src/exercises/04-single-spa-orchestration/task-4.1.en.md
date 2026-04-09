# Task 4.1 — Single-SPA Lifecycle Visualizer

## Goal

Create an interactive simulator that shows how Single-SPA manages application lifecycles during route transitions: which apps mount, which unmount, and in what order.

## Requirements

1. Navigation bar with 4-5 routes (/, /catalog, /cart, /profile, /admin).
   Each route has a predefined set of applications that should be active (MOUNTED).

2. Application state grid: at least 5-6 applications (e.g. shell, navbar, catalog, cart, profile, admin).
   Each application is displayed as a card with:
   - Name and framework
   - Current state from: NOT_LOADED, LOADING, NOT_BOOTSTRAPPED, BOOTSTRAPPING, NOT_MOUNTED, MOUNTING, MOUNTED, UNMOUNTING
   - Color coding: gray/green/blue/orange/red — based on state meaning

3. On route click — animated transition:
   - Apps that were MOUNTED but not needed on new route: UNMOUNTING → NOT_MOUNTED
   - Apps that are needed but NOT_LOADED: LOADING → NOT_BOOTSTRAPPED → BOOTSTRAPPING → NOT_MOUNTED → MOUNTING → MOUNTED
   - Apps that are NOT_MOUNTED (already bootstrapped): MOUNTING → MOUNTED
   - Each step has a 200-400ms delay for clarity
   - Navigation buttons are disabled during transition

4. Event log at the bottom (dark background, monospace):
   - Format: `HH:MM:SS  app-name  event`
   - Last ~40 events, auto-scroll to new ones

5. Timeline of the last transition:
   - Horizontal bars for each phase (load, bootstrap, mount, unmount)
   - Scale: bar width proportional to phase duration
   - Label with duration in ms

## Checklist

- [ ] At least 5 routes and 6 applications
- [ ] All 8 states (NOT_LOADED, LOADING, NOT_BOOTSTRAPPED, BOOTSTRAPPING, NOT_MOUNTED, MOUNTING, MOUNTED, UNMOUNTING) displayed and used
- [ ] On transition, old apps unmount, new ones go through full lifecycle
- [ ] Revisiting a route: apps transition NOT_MOUNTED → MOUNTED (no repeated bootstrap)
- [ ] Navigation buttons disabled during transition
- [ ] Event log updates in real time
- [ ] Timeline renders after each transition

## How to Check Yourself

- Navigate to /catalog — catalog app should mount through all phases
- Go from /catalog to /cart — catalog should go through UNMOUNTING, cart — full load cycle
- Return to /catalog — catalog should immediately go NOT_MOUNTED → MOUNTED (bootstrap already done)
- During transition, try clicking another route — should not work

## Hint

Use `async/await` with `setTimeout` (wrapped in a Promise) to simulate delays. Store all application states in a `useState` array of objects. For the timeline, capture `Date.now()` at the start of each phase.
