# Task 8.3: Multi-stage Builds — Dockerfile Optimization

## Goal

Create an interactive simulator that shows the difference between a naive Dockerfile and an optimized multi-stage variant: final image size, rebuild speed on code changes vs dependency changes.

## Requirements

1. Show two Dockerfile variants: **"Simple"** and **"Multi-stage + Optimized"** — switchable via tabs
2. Display the Dockerfile code for each variant with highlighting (monospace font)
3. Change scenario simulator: three buttons — **"Changed Code"**, **"Changed Dependencies"**, **"First Build"**
4. For each scenario show: list of rebuilt layers (with color coding: gray = from cache, orange = being rebuilt), build time in seconds (numbers for clarity)
5. Image size comparison block: simple ~600MB vs multi-stage ~30MB
6. Summary table: Simple vs Multi-stage on three parameters for the selected scenario

## Checklist

- [ ] Two tabs with Dockerfile code (Simple / Multi-stage)
- [ ] Three scenario buttons — change the simulation
- [ ] Layer list with indicators: cached (gray) / rebuilding (orange/red)
- [ ] Numeric build times for both variants
- [ ] Block with final image sizes (visually: progress bar or large numbers)
- [ ] Comparison table for the current scenario
- [ ] Active scenario highlighted button in pressed state

## How to Verify

1. Press "Changed Code" — in Multi-stage only 1-2 layers rebuild, in Simple — all of them
2. Press "Changed Dependencies" — in Multi-stage the npm ci layer rebuilds; in Simple — also, but the difference is in the final image
3. Press "First Build" — both variants rebuild everything, the difference is only in final size
4. Switch Dockerfile tabs — make sure the difference between simple and multi-stage is visible
5. Check that image sizes are displayed correctly: Simple ~600MB, Multi-stage ~30MB

## Hints

- Use `useState` for: `activeTab` ('simple' | 'multistage'), `scenario` ('first' | 'code-change' | 'deps-change')
- Hardcode layer data and times as constants — this is a simulator, not a real build
- For layers use an array of objects: `{ name: 'FROM node:20', cached: true }`
- Size progress bar: `width: (size / maxSize * 100) + '%'` in inline styles
- For the comparison table, 3-4 rows are enough: time, cached layers, final size, what's included in the image
