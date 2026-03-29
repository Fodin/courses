# Task 6.3: Hierarchical States

## Goal

Implement a hierarchical state machine with nested states for modeling a complex application with connection and authentication subsystems.

## Requirements

1. Create `ConnectionSubState` as a discriminated union: `connecting` (with attempt) and `connected` (with connectedAt, latency)
2. Create `AuthSubState` as a discriminated union: `anonymous`, `authenticating` (with provider), `authenticated` (with userId, token), `authError` (with reason)
3. Create a top-level `AppState`: `offline`, `online` (contains connection + auth), `maintenance` (with estimatedEnd, message)
4. Implement a `describeAppState` function that describes the full application state, handling all nesting levels
5. Implement a `reduceAppState(state, action)` reducer with actions: GO_ONLINE, GO_OFFLINE, CONNECTED, LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT, MAINTENANCE
6. Actions inapplicable to the current state (e.g., CONNECTED when offline) should return the state unchanged

## Checklist

- [ ] `AppState` has 3 top-level variants with different data
- [ ] `connection` and `auth` are only accessible in the `online` state
- [ ] `describeAppState` handles all combinations of top and nested levels
- [ ] Reducer correctly handles all 8 actions
- [ ] Actions inapplicable to the current phase are ignored
- [ ] Component demonstrates step-by-step transition through all phases

## How to Verify

1. Try accessing `state.connection` without checking `phase === 'online'` -- should get a TS error
2. Go through the full cycle: offline -> online(connecting) -> online(connected, anonymous) -> online(connected, authenticated)
3. Dispatch CONNECTED in offline state -- state should not change
