# Task 12.3: Deployment and Monitoring

## Objective

Create an interactive reference component for Docker application deployment strategies and production monitoring. Learn to choose a deployment strategy, configure health checks, and understand which metrics to monitor.

## Requirements

1. Create a component with three switchable sections: "Deployment Strategies", "Health Checks", "Monitoring"
2. The "Deployment Strategies" section: three toggle buttons (Rolling Update, Blue-Green, Canary) — clicking one displays the description, pros/cons in two columns, an ASCII process diagram, and a "Show config" button
3. The "Health Checks" section: three cards (Liveness, Readiness, Startup) — each with a colored top border, description, action, and example
4. Health Check simulator: a "Run check" button that sequentially checks database, redis, app — shows the status of each (OK/FAIL) with color indicators
5. A final message: a green "All checks passed" or a red "Health check failed! Rollback required"
6. An example Docker Compose healthcheck configuration
7. The "Monitoring" section: three metric groups (Container, Application, Infrastructure) with metrics displayed as badges
8. An example Prometheus + Grafana + cAdvisor stack in docker-compose

## Hints

- `useState<'deploy' | 'health' | 'monitoring'>` for sections
- `useState<number | null>` for the selected deployment strategy
- `setTimeout` for sequential health check simulation
- `Math.random() > 0.3` for a random app check result (sometimes FAIL)
- Array of objects for strategies: `{ name, description, pros, cons, diagram, config }`

## Checklist

- [ ] Three sections switch correctly
- [ ] Three deployment strategies with pros/cons and diagrams
- [ ] "Show config" button for each strategy
- [ ] Three health check type cards (Liveness, Readiness, Startup)
- [ ] Health check simulator with sequential checking
- [ ] Final message (green/red) after the check
- [ ] Three monitoring metric groups with badges
- [ ] Example docker-compose monitoring stack

## How to Verify

1. Switch sections — the content changes correctly
2. In "Deployment Strategies", switch strategies — the description, pros/cons, and diagram update
3. Click "Show config" — the deployment configuration is displayed
4. In "Health Checks", three cards with colored top borders are visible
5. Click "Run check" — database, redis, app sequentially receive a status
6. After the check, a green or red final message appears
7. In "Monitoring", three metric groups and docker-compose configuration are visible
