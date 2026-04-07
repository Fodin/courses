# Assignment 2.2: Load Balancing Simulator

## Goal

Build an interactive simulator that visually demonstrates how different load balancing algorithms distribute requests across servers of varying capacity.

## Requirements

1. Create a pool of 4 servers with different capacities (weight): e.g., 3, 1, 2, 1
2. Implement three load balancing algorithms with switching between them:
   - **Round Robin** — requests in rotation, ignoring capacity
   - **Weighted Round Robin** — accounting for server weights
   - **Least Connections** — to the server with the fewest active connections
3. Add a "Send N Requests" button (batch sending, e.g., 10-50 requests)
4. For each server, visualize:
   - Current load progress bar (% of capacity)
   - Processed request counter
   - Server weight
5. Show final statistics: standard deviation of load, most loaded/idle server
6. A "Reset" button to start a new experiment

## Checklist

- [ ] 4 servers with different weights displayed with progress bars
- [ ] 3 algorithms implemented (Round Robin, Weighted RR, Least Connections)
- [ ] Switching algorithms updates the strategy (doesn't reset counters)
- [ ] Batch request sending works correctly
- [ ] Difference in distribution between algorithms is visible
- [ ] Weighted RR sends more requests to higher-weight servers
- [ ] Least Connections accounts for current load

## How to Check Yourself

1. Reset counters, select Round Robin, send 40 requests — each server should receive 10
2. Reset, select Weighted RR — the server with weight=3 should receive ~43% of requests (3/7)
3. Reset, select Least Connections, send requests one by one — each request goes to the least loaded server
4. Compare standard deviation of load between algorithms on servers of different capacity
