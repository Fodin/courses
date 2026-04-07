# Assignment 1.3: Scaling Strategy

## Goal

For an e-commerce system, determine which components are stateless/stateful, and choose a scaling strategy for each.

## Requirements

1. Analyze the components of the e-commerce system:
   - **User Sessions** — cart storage, authentication
   - **Product Catalog** — product catalog (reads)
   - **Search Service** — full-text product search
   - **Order Processing** — order creation and processing
   - **Notification Service** — sending email/push notifications
2. For each component, determine:
   - **Type**: stateless or stateful
   - **Scaling strategy**: Scale Up, Scale Out (X-axis), functional decomposition (Y-axis), sharding (Z-axis)
   - **Where to store state** (if stateful): Redis, DB, message queue
3. Justify each decision

## Checklist

- [ ] Type determined (stateless/stateful) for each of the 5 components
- [ ] Scaling strategy chosen for each component
- [ ] Specified where to store state for stateful components
- [ ] Justifications consider load characteristics (read-heavy, write-heavy, CPU-heavy)
- [ ] Answers match the solution or are reasonably justified

## How to Check Yourself

1. Open the assignment and select parameters for each component
2. Compare your answers with the solution
3. Think: how would the strategy change if load increased 100x?
4. Check for any "hidden" state you might have missed
