# Task 2.1: Promise rejection

## Goal
Learn how to handle rejected promises through `.catch()`.

## Requirements
1. Create a promise that rejects through `setTimeout` with `Error('Timeout')`
2. Handle it through `.then().catch()`
3. Show how `Promise.reject` works
4. Demonstrate how an error "falls through" a chain of `.then` calls to `.catch`
5. Show that `.then` after `.catch` executes

## Checklist
- [ ] Promise with timeout created and handled
- [ ] `Promise.reject` demonstrated
- [ ] Chain of promises with an error in the middle
- [ ] Code after `.catch` executes
