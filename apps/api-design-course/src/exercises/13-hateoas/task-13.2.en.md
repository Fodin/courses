# Task 13.2: State-driven `_links` Builder

## Goal

Build a conditional-links visualizer: the student picks a resource state (and optionally a user role), and the component computes the correct set of `_links` and shows the resulting hypermedia response. The goal is to feel the rule "state determines the available actions."

## Requirements

1. An order state switch: `pending`, `paid`, `shipped`, `delivered`, `cancelled`
2. A role switch: `customer` and `admin` — affects some links (e.g. `refund` is available only to admin)
3. For the chosen state and role, compute the set of `_links` (`self` is always present)
4. Show the resulting JSON resource response with a `_links` block (href + method)
5. Alongside — a list of "why exactly these links": which rule added/removed each transition
6. Show the "forbidden" actions separately (struck through or grayed out) with an explanation of why they're unavailable in this state — to see the contrast

## Checklist

- [ ] Switching state changes the set of `_links`
- [ ] Switching role changes the availability of role-based links (`refund`, etc.)
- [ ] `self` is always present
- [ ] The resulting JSON has correct href and method
- [ ] An explanation of why each link is available
- [ ] Unavailable actions are shown separately with a reason

## Rules (reference)

| State | customer | admin (additionally) |
|---|---|---|
| `pending` | self, pay, cancel | — |
| `paid` | self, ship* | refund |
| `shipped` | self, track | refund |
| `delivered` | self, review | refund |
| `cancelled` | self | — |

`ship` is more logically shown to admin/the system, but for the task's simplicity it's acceptable for both. The key rule: **a paid order doesn't show `pay`, a cancelled one shows nothing but `self`, `refund` is admin-only**.

## How to check yourself

1. `pending` + customer → `self, pay, cancel`.
2. Switch to `paid` → `pay` disappeared, `ship` appeared (and `refund` if admin).
3. Switch the role to admin while `paid` → `refund` was added.
4. `cancelled` → only `self`, everything else in "unavailable" with an explanation.

## Hints

- Describe the rules as a function `linksFor(status, role)` returning a `_links` object.
- Always start from `{ self: { href: '/orders/123' } }`, then add transitions by `status` and `role`.
- For the "unavailable" block, compare the full action list with the obtained set: the difference is the forbidden ones.
