# Task 12.1: Error Boundary and Circuit Breaker Simulator

## Goal

Create an interactive simulator demonstrating the difference between an application with and without Error Boundary, and showing Circuit Breaker operation in three states: Closed, Open, Half-Open.

## Requirements

1. Display three MFE blocks (Catalog, Cart, Profile) inside a Shell wrapper
2. Implement "Error Boundary: ON / OFF" toggle:
   - OFF: any error crashes the entire app (red crash screen with restart button)
   - ON: erroring MFE shows fallback block, others continue working
3. On each MFE — "Inject Error" button
4. Circuit Breaker for each MFE:
   - Threshold: 3 errors → transition Closed → Open
   - In Open state: "Try Again" button (checks timeout, transitions to Half-Open)
   - In Half-Open state: "Restore" button → transition to Closed
   - Color coding: Closed = green, Open = red, Half-Open = yellow
5. Error log: timestamp, MFE name, team tag, error message, circuit breaker state
6. Dark style (#0f172a background), all styles inline

## Checklist

- [ ] Shell with three MFE blocks with color labels
- [ ] Error Boundary toggle affects behavior on error
- [ ] "Red screen" on crash without Error Boundary
- [ ] Fallback block on error with Error Boundary
- [ ] "Inject Error" button on each MFE
- [ ] Circuit Breaker displays current state (Closed/Open/Half-Open)
- [ ] Transition Closed → Open after 3 errors
- [ ] "Try Again" button in Open state
- [ ] "Restore" button in Half-Open state
- [ ] Log: timestamp, MFE, team, error message, circuit state
- [ ] "Reset All" button returns to initial state

## How to Check Yourself

1. Turn off Error Boundary → click "Inject Error" on any MFE — red crash screen should appear
2. Restart → enable Error Boundary → click "Inject Error" on Catalog — only Catalog shows fallback, Cart and Profile work
3. Click "Inject Error" 3 times on one MFE — Circuit Breaker transitions to Open
4. In Open state, click "Try Again" — transition to Half-Open
5. In Half-Open state, click "Restore" — transition to Closed
6. Check the log — each entry should contain team tag (team-catalog / team-cart / team-profile)
