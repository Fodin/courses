# Task 13.1: Strangler Fig Visualizer

## Goal

Build an interactive visualizer of monolith migration using the Strangler Fig pattern — with domain extraction animation, real-time metrics, and dependency warnings.

## Requirements

1. Display monolith as a block with 6 domains: Catalog, Cart, Checkout, Profile, Admin, Analytics — each with unique color, LOC percentage, team member count, and change frequency
2. Add "Extract →" button on each domain; on click, domain animates (opacity + scale) into "Microfrontends" block with 700ms delay
3. Before extraction, check dependencies: if domain depends on other domains still in monolith, show warning (don't block hard, but warn)
4. After domain extraction, convert all its direct connections (red) to EventBus connections (green) — display connection list at bottom
5. Display real-time metrics: migration progress (%), MFE count, direct connections, EventBus connections, traffic to MFE
6. Migration progress bar with color: red < 30%, yellow < 70%, green >= 70%
7. "← Return" button in MFE block — returns domain to monolith and converts connections back to direct

## Checklist

- [ ] 6 domains displayed in monolith block with color, LOC%, team, change frequency
- [ ] Each domain's dependencies visible in its card
- [ ] "Extract" button starts animation (opacity+scale for 700ms) and moves domain to MFE
- [ ] When unextracted dependencies exist, warning appears with dependency names
- [ ] Direct connections displayed in red, EventBus — in green
- [ ] After domain extraction, its connections become green (EventBus)
- [ ] Metrics (progress, MFE count, connections, traffic) update after each action
- [ ] Progress bar changes color based on percentage
- [ ] "Return" button works and rolls back connections to direct
- [ ] When all domains extracted — message "Monolith fully replaced"

## How to Check Yourself

1. Open the task and click "Extract" on "Analytics" domain — it should smoothly move to MFE block, metrics update, its connections (if any) turn green
2. Try to extract "Checkout" immediately — a warning about Cart and Catalog dependencies should appear
3. Extract all domains sequentially — monolith should show "Monolith fully replaced" message, progress bar fills green
4. Click "Return" on any MFE — domain returns to monolith, its connections turn red again
