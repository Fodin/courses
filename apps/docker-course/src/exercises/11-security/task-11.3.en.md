# Task 11.3: Security Checklist

## Objective

Build a comprehensive interactive Docker security checklist covering read-only filesystem, resource limits, network isolation, and secrets management. Create a component with progress tracking.

## Requirements

1. Create a component with an interactive security checklist divided into 5 categories: "Images", "Dockerfile", "Runtime", "Secrets", "Network"
2. Each category contains 4–6 checklist items with checkboxes that can be ticked
3. For each item, show: the recommendation text, and a code block with an example command/configuration (on click of "Show example")
4. At the top of the component — a progress bar showing the percentage of the entire checklist completed (how many items are checked out of the total)
5. Below the progress bar — individual mini progress bars for each category
6. Add a "Show secure docker-compose.yml" button — clicking it displays a complete example of a production-ready `docker-compose.yml` with all security measures applied
7. At the bottom of the component — a "Defense in Depth" block with a visualization of the protection layers

## Hints

- `useState<Record<string, boolean>>` for the checkbox state (key = unique item ID)
- `useState<Record<string, boolean>>` for the visibility of code examples
- `useState<boolean>` for showing the full `docker-compose.yml`
- Progress: `Object.values(checked).filter(Boolean).length / totalItems * 100`
- Grouping items by category: array of objects `{ category, items: [{ id, text, code }] }`

## Checklist

- [ ] 5 checklist categories
- [ ] At least 22 items with checkboxes in total
- [ ] "Show example" buttons for each item
- [ ] Overall progress bar (percentage completion)
- [ ] Mini progress bars for each category
- [ ] "Show secure docker-compose.yml" button
- [ ] "Defense in Depth" block with layer visualization

## How to Verify

1. Check checkboxes — the progress bar updates
2. Mini progress bars update when items in the corresponding category are checked
3. "Show example" buttons work independently for each item
4. The docker-compose.yml button shows a complete example
5. The "Defense in Depth" block visualizes the protection layers
6. When progress reaches 100%, a completion indicator is shown
