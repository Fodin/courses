# Task 6.1: Comparing Versioning Strategies

## Goal

Implement an interactive component that clearly demonstrates three API versioning strategies: URL versioning, Header versioning, and Query param versioning.

## Requirements

1. Create a switcher with three tabs — one for each strategy
2. Show a real HTTP request in a code block style for each strategy
3. Implement an accordion with three sections: "Advantages", "Disadvantages", "Who Uses It"
4. Each accordion section opens/closes by clicking on its heading
5. The active tab and active section are highlighted with the strategy's color
6. Add a tooltip with advice on choosing a strategy

## Checklist

- [ ] Three tab buttons with the strategy code in the label
- [ ] Code block with an example HTTP request (dark background, monospace font)
- [ ] "Advantages" section with at least 3 items
- [ ] "Disadvantages" section with at least 2 items
- [ ] "Who Uses It" section with real companies (GitHub, Stripe, AWS)
- [ ] Tab switching resets/preserves the open accordion state
- [ ] Hint block at the bottom with advice

## How to Check Yourself

Open the component and verify:
- Click on each tab — the request changes
- Expand the "Who Uses It" section for URL versioning — GitHub and Twitter should be listed
- Expand "Disadvantages" for Header versioning — should mention caching complexity
- Tab color and card border color match (blue, purple, green)
