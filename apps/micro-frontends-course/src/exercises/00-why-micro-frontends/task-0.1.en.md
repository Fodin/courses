# Task 0.1 — Visualizer: Monolith vs Micro-Frontends

## Goal

Implement an interactive visualizer that clearly shows how deploy complexity grows for a monolithic frontend as teams and changes are added — and how MFEs keep deploy time stable.

## Requirements

1. Render two tabs: **Monolith** and **Micro-Frontends** — switchable by click.
2. **"Add Team"** button — adds a team (maximum 6). Each team gets a unique color and name.
3. **"Make Change"** button — adds a random commit to a random team. In the monolith, the probability of a merge conflict grows with the number of teams.
4. **"Deploy"** button — simulates a deploy (1 second delay), adds an entry to the deploy history with time.
5. Metrics panel: number of changes, merge conflicts, teams.
6. **Monolith tab**: CI time metrics, blocking risk, number of conflicts as progress bars. Warning at 3+ teams. Blocking notification at 3+ conflicts.
7. **MFE tab**: team cards with independent pipelines. Stable metrics. Notification that changes don't block each other.
8. **Comparison bar chart** at the bottom: monolith deploy time vs MFE.
9. **Change feed**: latest commits with team name and conflict flag.
10. **Deploy history**: last 10 deploys with mode (Monolith/MFE) and time.

## Formulas

```ts
// Monolith deploy time (minutes):
monolithTime = 5 + teamsCount * 4 + conflictsCount * 8

// MFE deploy time (minutes, stable):
mfeTime = 3 + Math.floor(Math.random() * 2)

// Conflict probability when making a change:
conflictChance = teams > 2 ? 0.3 + teams * 0.07 : 0.1
```

## Checklist

- [ ] Tabs are switchable, active tab is visually highlighted
- [ ] Adding teams works (up to 6), button is disabled at maximum
- [ ] Changes are added with a conflict flag according to the formula
- [ ] Deploy button simulates a delay (disabled during deploy)
- [ ] Metrics update reactively
- [ ] Monolith tab shows warnings as problems grow
- [ ] MFE tab shows stable independent pipelines
- [ ] Bar chart clearly displays the deploy time difference
- [ ] Change feed — conflicts are highlighted in red

## How to Test Yourself

1. Add 5 teams and make 10 changes.
2. In the monolith, deploy time should grow to 40+ minutes, blocking warnings should appear.
3. Switch to MFE — deploy time stays at 3-5 minutes regardless of the number of teams.
4. Click "Deploy" in both modes — the difference should be obvious in the deploy history.
