# Task 15.1: E-commerce MFE Platform Architecture Visualizer

## Goal

Build an interactive visualizer of the full e-commerce platform architecture: Shell + 5 MFEs (Catalog, Cart, Checkout, Profile, Admin). Four switchable views — Dependency, Deploy, Team, Traffic — allow exploring different aspects of the platform. Clicking on an MFE opens a detail panel with information about technologies, event contracts, and metrics.

## Requirements

1. Implement data for 6 MFEs (shell, catalog, cart, checkout, profile, admin): each has id, label, color, team, framework, routes, shared deps, events (emit/listen), deploy strategy, canary percentage, version, traffic metrics (requestPct, latency, errorRate, SLO)
2. Implement 5 shared libraries: react, react-dom, @company/ui-kit, @company/analytics, react-router-dom
3. Implement a 4-view switcher: Dependencies / Deploy / Teams / Traffic
4. MfeCard — a clickable component showing relevant information for the current view: shared deps tags (Dependency), version and strategy (Deploy), team and SLO (Team), traffic metrics (Traffic)
5. DetailPanel: on MFE click, show a panel with three columns: Technologies, Events (emit/listen), Metrics and routes. Close with × button
6. Dependency view: show MFE cards + shared libs panel + dependency table MFE → deps
7. Deploy view: group MFEs by deploy strategy (Blue/Green, Canary, Rolling, Direct), show versions and canary status
8. Team view: show MFE cards + team grid with their MFEs and SLOs
9. Traffic view: show MFE cards + latency bar chart with color coding (green <100ms, yellow <200ms, red >=200ms)
10. Summary bar at the bottom: total MFEs, teams, shared libs, active canaries

## Checklist

- [ ] 6 MFEs defined with full data (all fields: color, team, framework, routes, deps, events, deploy, metrics)
- [ ] 4-view switcher works, on view change MfeCard displays relevant information
- [ ] MfeCard in Dependency mode shows shared deps tags (first 3 + remaining count)
- [ ] MfeCard in Deploy mode shows version and strategy badge (yellow for canary)
- [ ] MfeCard in Team mode shows team (colored badge) and SLO
- [ ] MfeCard in Traffic mode shows requestPct%, latency (with color) and errorRate%
- [ ] Click on MfeCard opens DetailPanel with 3 columns
- [ ] DetailPanel: Events — emit (yellow ↑) and listen (green ↓), Metrics: latency with color
- [ ] Deploy view: MFEs grouped by strategy
- [ ] Team view: team cards with list of their MFEs and SLOs
- [ ] Traffic view: latency bar chart with correct color coding
- [ ] Summary bar shows 4 metrics
- [ ] Dark theme, all styles inline

## How to Check Yourself

1. Open the task — 6 MFE cards should be displayed in Dependency view with shared deps tags
2. Click on Catalog MFE — a DetailPanel should appear with events cart:add, product:viewed (emit) and cart:updated (listen)
3. Switch to Traffic view — Checkout should have red latency (312ms), Shell — green (42ms)
4. In Deploy view, make sure Catalog shows a yellow "canary 15%" badge
5. In Team view, make sure Commerce Team contains Catalog and Cart, and Payments — Checkout
6. Summary bar: total MFEs = 6, Teams = 4, Shared libs = 5, Canary active = 1
