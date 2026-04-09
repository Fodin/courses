# Task 16.3: Alerting — Alert Configurator

## Goal

Implement an **interactive alert configurator** with real-time metric simulation. Users create rules of the form "if metric > threshold → severity", observe alert firings and resolutions as simulated values change.

## Requirements

1. Declare types: `MetricId = 'consumer_lag' | 'queue_depth' | 'publish_rate' | 'error_rate'`, `Severity = 'warning' | 'critical'`, `AlertState = 'ok' | 'firing' | 'resolved'`.
2. Declare interfaces:
   - `AlertRule`: `id: string`, `metric: MetricId`, `threshold: number`, `severity: Severity`, `enabled: boolean`.
   - `AlertFiring`: `ruleId: string`, `metric: MetricId`, `currentValue: number`, `threshold: number`, `severity: Severity`, `firedAt: number`, `state: AlertState`.
3. Declare a constant `METRIC_META: Record<MetricId, { label, unit, defaultThreshold, min, max, step }>` with parameters for each metric:
   - `consumer_lag` — unit `'msgs'`, defaultThreshold 1000, min 100, max 10000, step 100.
   - `queue_depth` — unit `'msgs'`, defaultThreshold 5000, min 100, max 50000, step 500.
   - `publish_rate` — unit `'msg/s'`, defaultThreshold 1000, min 50, max 5000, step 50.
   - `error_rate` — unit `'%'`, defaultThreshold 1, min 0.1, max 10, step 0.1.
4. Declare a constant `SEVERITY_COLORS: Record<Severity, string>`: warning — `'#ed8936'`, critical — `'#e53e3e'`.
5. Implement a `generateSimValue(metric: MetricId): number` function returning a random number in the metric-specific range.
6. Declare component states:
   - `rules: AlertRule[]` — rule list (initial: 3 rules: lag warning 1000, lag critical 5000, error_rate critical 1).
   - `firing: AlertFiring[]` — list of active/resolved alerts.
   - `simValues: Record<MetricId, number>` — current simulated values.
   - `newMetric`, `newThreshold`, `newSeverity` — states for the add-rule form.
7. Implement a `useEffect` with 2000ms interval: generate new values via `generateSimValue`, update `simValues`, recalculate `firing`:
   - If `val > rule.threshold` and no active alert → add `{ state: 'firing', firedAt: Date.now(), ... }`.
   - If `val <= rule.threshold` and active alert exists → change its `state` to `'resolved'`.
   - Remove resolved alerts where `Date.now() - firedAt > 5000ms`.
8. Implement an `addRule` function: add a new rule with unique id, reset `newThreshold` to the selected metric's `defaultThreshold`.
9. Implement `removeRule(id)` and `toggleRule(id)` functions. When removing a rule, remove corresponding alerts from `firing`.
10. Compute `criticalCount` and `warningCount` — number of active alerts (state `'firing'`) by severity.
11. Render a two-column layout:
    - **Left column**: header with rule count, add form (metric select, threshold number input, severity buttons, "+ Add rule" button), list of existing rules.
    - **Right column**: Critical/Warning count summary, "Current Metrics" section with progress bars, list of active/resolved alerts.
12. Each rule in the list displays:
    - Enable/disable checkbox (`enabled`).
    - Metric name, threshold, and severity.
    - Current metric value.
    - "FIRING" badge (with pulse animation) if the rule is active and enabled.
    - Delete button "×".
    - Border with severity color when alert is firing; neutral when not.
13. In the "Current Metrics" section, display a progress bar for each metric with color: red if critical threshold breached, orange if warning threshold breached, green if all normal.
14. Add CSS `pulse` animation for the FIRING badge.

## Checklist

- [ ] Types `MetricId`, `Severity`, `AlertState` declared
- [ ] `AlertRule` and `AlertFiring` interfaces declared with correct fields
- [ ] `METRIC_META` constant contains all 4 metrics with correct parameters
- [ ] `generateSimValue` returns values in the expected range for each metric
- [ ] `useEffect` with 2000ms interval simulates metrics and recalculates `firing`
- [ ] Resolved alerts removed after 5 seconds
- [ ] `addRule` adds a rule and resets form to defaultThreshold
- [ ] `removeRule` removes the rule and related alerts from `firing`
- [ ] `toggleRule` toggles `enabled` on the rule
- [ ] Add form: metric select, number input, severity buttons, add button
- [ ] Rule list: checkbox, name, threshold, severity, current value, × button
- [ ] FIRING badge with pulse animation appears on active alert
- [ ] Metric progress bars change color based on breached thresholds
- [ ] Critical/Warning count summary updates in real time
- [ ] Alert list shows RESOLVED with fade effect before removal

## How to test yourself

1. Open the task — three initial rules visible. Metrics simulate every 2 seconds: values in progress bars change.
2. Wait a few seconds — when a threshold is exceeded, a "FIRING" badge with pulsation appears in the rule list, and the Critical or Warning counter increases in the right column.
3. Uncheck a rule — the FIRING badge disappears, the rule stops affecting alerts but remains in the list.
4. Add a new rule: select "Error Rate", threshold 0.1, severity "critical". Click "+ Add rule" — the rule appears in the list. It will start firing almost immediately.
5. Remove the rule with the "×" button — it disappears from the list, related alerts are removed from the right column.
6. Observe a RESOLVED alert: when the metric value drops below the threshold, the badge changes from "FIRING" to "RESOLVED" and after 5 seconds the alert disappears from the list.
