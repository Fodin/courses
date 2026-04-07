# Assignment 1.2: Scaling Planner

## Goal

Build an interactive calculator that estimates the number of servers needed and compares the cost of vertical vs horizontal scaling for a given load.

## Requirements

1. Create a component with load parameter inputs:
   - **Target RPS** — target requests per second
   - **CPU per request** — CPU percentage per request
   - **RAM per request** — MB of RAM per request
   - **Base server cost** — cost of a standard server ($/month)
2. Calculate how many standard servers are needed for horizontal scaling
3. Calculate the cost of equivalent vertical scaling (with exponential growth coefficient)
4. Visualize cost comparison: horizontal bar chart for both approaches
5. Show the point at which horizontal scaling becomes more cost-effective than vertical
6. Add load presets: "Startup", "Medium Business", "Highload"

## Checklist

- [ ] Input fields for RPS, CPU/request, RAM/request, server cost
- [ ] Calculates number of servers for horizontal scaling
- [ ] Vertical scaling cost grows exponentially
- [ ] Visualized cost comparison of both approaches
- [ ] At least 3 presets with realistic parameters
- [ ] Component uses `useState` for state management

## How to Check Yourself

1. Open the assignment in the browser
2. Switch between presets — parameters should update
3. Change RPS — server count and cost should recalculate
4. Verify that at low load, vertical is cheaper, and at high load — horizontal
5. Check edge cases: 0 RPS, very high RPS
