# Task 7.1: depends_on and healthcheck

## Objective

Understand the mechanisms for controlling service startup order: simple and extended forms of `depends_on`, configuring `healthcheck` for popular services, and the three dependency conditions.

## Requirements

1. Create a component with three tabs: "depends_on", "healthcheck", "Conditions"
2. "depends_on" tab — two switchable examples: simple form (list) and extended form (with `condition`). For the simple form show a warning that it does not wait for the service to be ready
3. "healthcheck" tab — an interactive list of healthcheck examples for different services: PostgreSQL, Redis, HTTP (curl), HTTP (wget), MySQL, MongoDB. Show the YAML configuration with parameters for each
4. Below the healthcheck examples show a description of the parameters: `interval`, `timeout`, `retries`, `start_period`
5. "Conditions" tab — a table with three `depends_on` conditions: `service_started`, `service_healthy`, `service_completed_successfully`. For each: what it means and when to use it
6. In the "Conditions" tab add a visualization of the stack startup order (7 steps)

## Hints

- Array of objects for depends_on examples: `{ key, label, yaml, warning }`
- Array for healthcheck: `{ service, yaml }`
- `useState<'depends_on' | 'healthcheck' | 'conditions'>` for tabs

## Checklist

- [ ] Three tabs switch correctly
- [ ] Simple depends_on form with warning
- [ ] Extended form with condition: service_healthy
- [ ] Healthcheck examples for 6 services
- [ ] Description of healthcheck parameters (interval, timeout, retries, start_period)
- [ ] Table with three depends_on conditions
- [ ] Visualization of stack startup order

## How to verify

1. Switch tabs — the content changes
2. In "depends_on" switch examples — YAML updates, warning appears only for the simple form
3. In "healthcheck" click services — YAML is unique for each
4. In "Conditions" all three table rows are filled in, startup order is visually clear
