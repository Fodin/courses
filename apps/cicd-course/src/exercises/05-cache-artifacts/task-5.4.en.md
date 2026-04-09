# Task 5.4: Cache Key Strategies

## Goal

Create a `cache:key` configurator that visually demonstrates different cache key strategies and simulates behavior when switching branches — showing cache hits and cache misses.

## Requirements

1. Show three cache key strategies: static, based on variable `$CI_COMMIT_REF_SLUG`, based on `files: [package-lock.json]`
2. For each strategy — a brief description and YAML example
3. Add simulator: "Switch Branch" and "Update package-lock.json"
4. Simulator shows: cache hit or cache miss for each strategy
5. Add `prefix` configuration — input field or selection from options (`v1`, `$CI_COMMIT_REF_SLUG`, empty)
6. Final YAML config updates when any setting changes
7. Show a strategy comparison table: auto-invalidation / branch isolation / complexity

## Checklist

- [ ] Three strategy cards with name, description, and YAML example
- [ ] Active strategy visually highlighted (border, background)
- [ ] Simulator with two buttons: "Switch Branch" and "Update package-lock.json"
- [ ] For each strategy after simulation — indicator: Hit (green) or Miss (red)
- [ ] Prefix input or selector
- [ ] Final YAML updates in real time
- [ ] Comparison table of three strategies by key characteristics

## How to Verify

1. Select "Static key" strategy, press "Switch Branch" — should be Hit (branch doesn't affect key)
2. Select "By branch ($CI_COMMIT_REF_SLUG)", press "Switch Branch" — Miss (new key)
3. Select "By lock-file", press "Update package-lock.json" — Miss (key changed)
4. Press "Update package-lock.json" with static key — Hit (content doesn't affect the key)
5. Enter prefix `v2` — make sure it appears in YAML

## Hints

- Simulator state: `currentBranch: 'main'|'feature/auth'`, `lockfileChanged: boolean`
- `cacheKey` is computed based on strategy and current simulator state
- For key comparison: store the previous key in `useState`, on change compare — hit or miss
- Build the table using HTML `<table>` with inline styles — 4 rows (3 strategies + header) × 4 columns
