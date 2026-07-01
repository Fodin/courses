# Task 13.1: Hypermedia Navigator

## Goal

Build an interactive navigator that traverses an API **only through `_links`**, without knowing URLs in advance. The student starts from the entry point and clicks the available transitions — like a HATEOAS client driven by the server.

## Requirements

1. A predefined "mock API": a set of state-resources, each with data + `_links` (a transition map `rel → { href, method }`)
2. Start from the entry point (e.g. an order in the `pending` state); show the current resource as formatted JSON
3. Below the resource — buttons for each available `_link` (except `self`): the button label = `rel` + method + href
4. Clicking a link performs the "transition": replaces the current resource with the one the `rel` leads to and re-renders the new set of links
5. Breadcrumbs / transition log: which `rel` have been traversed (`pay → ship → ...`)
6. A "Reset" button returns to the entry point
7. Highlight `self` separately (it's not an action but the address of the resource itself)

## Checklist

- [ ] The current resource is shown as JSON with a `_links` block
- [ ] Transition buttons are built from `_links` (not hardcoded by hand)
- [ ] A click changes the resource state and the set of available links
- [ ] `self` is separated from actions
- [ ] A log of traversed transitions (`rel`)
- [ ] A reset button to the entry point
- [ ] A terminal state (e.g. `cancelled`) has no actions except `self`

## Mock API data (reference)

```
pending  → data { status: "pending" }, _links: self, pay, cancel
paid     → data { status: "paid" },    _links: self, ship, refund
shipped  → data { status: "shipped" }, _links: self, track, return
cancelled→ data { status: "cancelled"}, _links: self
```

Transitions: `pay`: pending→paid, `cancel`: pending→cancelled, `ship`: paid→shipped, `refund`: paid→cancelled.

## How to check yourself

1. Start — `pending`, the `pay` and `cancel` buttons are visible.
2. Click `pay` — the resource became `paid`, the buttons switched to `ship` and `refund`.
3. Click `ship` — `shipped`, buttons `track`/`return`.
4. Reset and click `cancel` — `cancelled`, no actions, only `self`.

## Hints

- State: `currentKey` (the current resource's key) and `history` (an array of traversed `rel`).
- The mock API is an object `{ [key]: { data, links: { rel: { href, method, to } } } }`, where `to` is the key of the next resource.
- Buttons: `Object.entries(resource.links).filter(([rel]) => rel !== 'self')`.
- Transition: `setCurrentKey(link.to)` + append `rel` to history.
