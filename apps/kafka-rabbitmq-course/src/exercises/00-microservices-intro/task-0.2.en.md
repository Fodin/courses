# Task 0.2: Service Dependency Map

## Goal

Create an interactive dependency graph between microservices. Clicking on a service should clearly
show its dependencies and blast radius — which services would be affected if it goes down.

## Requirements

1. Display a graph of 5-6 microservices as SVG or HTML blocks:
   API Gateway, User Service, Order Service, Payment Service, Inventory Service, Notification Service
2. Lines/arrows showing dependencies must be drawn between services
3. When clicking on a service:
   - The service itself is highlighted in red (failed)
   - Services that depend on it are highlighted in red (directly affected)
   - Services it depends on are highlighted in blue (its dependencies)
   - Other services become semi-transparent
4. Below the graph, a text description of blast radius should appear:
   a list of services that will stop working when the selected one fails
5. Clicking the same service again removes the highlight
6. At least one service should have no dependents (isolated failure)

## Checklist

- [ ] Graph contains at least 5 services
- [ ] Dependency lines are displayed between services
- [ ] Click highlights the required services in different colors
- [ ] Unaffected services become semi-transparent
- [ ] Text block describes the blast radius
- [ ] Repeated click removes the highlight
- [ ] Legend explains the colors
- [ ] Component uses `useLanguage` and `t('task.0.2')` for the heading

## How to Check Yourself

1. Click on API Gateway — all services that use it should light up
2. Click on Notification Service — it has no downstream dependents, there should be a message
   about isolated failure (or minimal blast radius)
3. Click on Order Service — dependent services should light up
4. Make sure the legend shows the meaning of each color
5. Re-clicking the same service should clear all highlights