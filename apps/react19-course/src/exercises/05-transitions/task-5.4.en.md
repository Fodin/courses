# Task 5.4: useDeferredValue initialValue

## Objective

Use the new `initialValue` parameter of `useDeferredValue` (React 19).

## Requirements

1. Create a search field that filters a list
2. Use `useDeferredValue(query, '')` — the second argument is the initialValue
3. On the first render the initialValue (empty string) is used
4. Show that filtering does not block typing

## Checklist

- [ ] `useDeferredValue` is used with two arguments
- [ ] `initialValue` sets the initial value
- [ ] Typing in the search field remains responsive
- [ ] List filtering updates with a slight delay

## How to verify

1. Type in the search field — the field responds instantly
2. The list filters with a slight delay
