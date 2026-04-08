# Exercise 8.6: Field Array with Validation and Control

## Goal

Learn to programmatically manage a Field Array: move, swap, insert elements, and enforce limits.

## Requirements

Build a team management form:

1. **Team name** — text field
2. **Member list** (useFieldArray) with fields: name and role (select)
3. **Constraints**: minimum 2 members, maximum 5
4. **Order control**: "Up" / "Down" buttons (move), "Swap" button (swap)
5. **Insert**: "Insert at beginning" button (insert)
6. **Indicator**: show current member count and limits
7. **Disable "Add" button** when maximum is reached

## Checklist

- [ ] Form with team name and member list
- [ ] Minimum 2 members on submit (validation error if fewer)
- [ ] Maximum 5 members (add button disabled)
- [ ] "Up" / "Down" buttons to reorder members
- [ ] "Swap" button to exchange positions of adjacent members
- [ ] "Insert at beginning" button adds a member at the first position
- [ ] Member count indicator

## How to verify

1. Open the form — 2 members by default
2. Remove one and try to submit — error "Minimum 2 members"
3. Add members up to 5 — "Add" button becomes disabled
4. Click "Down" on the first member — it moves to the second position
5. Click "Swap" — members swap positions
6. Click "Insert at beginning" — new member appears first
