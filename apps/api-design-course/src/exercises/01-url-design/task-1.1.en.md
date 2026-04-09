# Task 1.1 — URL Builder

## Goal

Consolidate the skill of constructing correct REST endpoints: choosing the right HTTP method, forming a path from resources and identifiers, and adding query params only where needed.

## Requirements

1. The component displays one of several scenarios (e.g., "Get all orders of user with ID = 7").
2. The user selects an HTTP method, adds path segments using buttons (resources and IDs), and enters query params if needed.
3. The component assembles and displays the resulting URL in real time.
4. A "Check" button compares the assembled URL with the reference and shows the result.
5. A "Hint" button explains the principle without revealing the answer.
6. A "Next" button switches to the next scenario.
7. At least 4 different scenarios, covering: a collection, a single resource, a nested resource, filtering.

## Checklist

- [ ] HTTP method selection (GET, POST, PUT, PATCH, DELETE)
- [ ] Adding path segments from predefined options
- [ ] Manual query param input
- [ ] URL preview updates on every change
- [ ] Check shows the correct answer on error
- [ ] Hint does reveal the answer immediately
- [ ] At least 4 scenarios

## How to Check Yourself

Build an endpoint for each scenario without hints. Check the result. If you make a mistake — read the explanation of the correct version and figure out where the logical error was.
