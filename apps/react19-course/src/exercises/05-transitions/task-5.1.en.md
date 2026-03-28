# Task 5.1: useTransition + isPending

## Objective

Use `useTransition` to switch between tabs without blocking the UI.

## Requirements

1. Create a component with 3 tabs, each "loading" data
2. Use `useTransition` for switching
3. Show `isPending` as a loading indicator (opacity or spinner)
4. The current tab stays visible while the new one is loading

## Checklist

- [ ] `useTransition` returns `[isPending, startTransition]`
- [ ] Tab switching is wrapped in `startTransition`
- [ ] `isPending` shows a loading indicator
- [ ] UI is not blocked during switching

## How to verify

1. Click a tab — the current content dims slightly
2. After a moment the new content appears
