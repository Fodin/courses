# Task 13.3: HATEOAS API Design

## Goal

Build an interactive self-check on designing hypermedia for three resources with a lifecycle. The student works out the states and transitions (`_links`), then compares with a reference.

## Requirements

1. Three clickable scenario cards: a payment, a blog article (draft→published), a vacation request
2. On selecting a scenario — a textarea for the student's answer with a hint: list the states and for each — which `_links` (transitions) are available
3. A "Show reference" button reveals a panel: a "state → available `rel`" table + a short note about the scenario's key rule
4. The active card is highlighted with a border (#6366f1)
5. Student answers are preserved when switching scenarios; the "reference shown" state is kept per scenario

## Checklist

- [ ] Three scenario cards with icon, title, description
- [ ] An answer textarea, preserved when switching
- [ ] A "Show reference" button (toggle per scenario)
- [ ] Reference: a "state → `rel`" table + a note
- [ ] The revealed state is kept per scenario

## Scenario data (reference)

### Scenario 1: Payment
- `created` → self, authorize, cancel
- `authorized` → self, capture, void
- `captured` → self, refund
- `refunded` → self
- Rule: after `captured` you can't `void`, only `refund`; terminal states carry only `self`.

### Scenario 2: Blog article
- `draft` → self, edit, publish, delete
- `published` → self, edit, unpublish, archive
- `archived` → self, restore
- Rule: `delete` is available only in `draft`; a published article can be unpublished but not deleted directly.

### Scenario 3: Vacation request
- `submitted` → self, approve, reject, withdraw
- `approved` → self, cancel
- `rejected` → self, resubmit
- `cancelled` → self
- Rule: `approve`/`reject` are available to the approver (role), `withdraw`/`cancel` to the requester; the link set depends on both state and role.

## How to check yourself

1. For each scenario, write out the states and available transitions.
2. Click "Show reference" and compare — especially the terminal states (only `self`) and role-dependent transitions.
3. Notice: a correct design makes impossible transitions simply absent from `_links`.

## Hints

- State: `selected`, `answers` (scenario→text), `revealed` (scenario→bool).
- The reference is conveniently stored as an array: `{ icon, title, description, states: [{ state, rels: [...] }], rule }`.
- Build the reference table from `states` — one row per state.
