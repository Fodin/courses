# Task 4.3: Rollback on Error

## Objective

Demonstrate that an optimistic update automatically rolls back when a server error occurs.

## Requirements

1. Create an optimistic update (a like or adding to a list)
2. Simulate a random server failure (50% probability)
3. On error, the optimistic value must roll back
4. Display an error notification

## Checklist

- [ ] The optimistic update is applied instantly
- [ ] On server error, the UI rolls back to the previous state
- [ ] The user sees an error notification
- [ ] The user can try again

## How to Verify

1. Click the button several times
2. Occasionally the server "fails" and the change is rolled back
3. On success, the change is persisted
