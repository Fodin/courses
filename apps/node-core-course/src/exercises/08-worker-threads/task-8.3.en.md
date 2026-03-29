# Task 8.3: Worker Pool

## Goal

Implement the Worker Pool pattern for thread reuse and efficient parallel task processing.

## Requirements

1. Create a Worker Pool simulation with a fixed number of workers
2. Implement a task queue: if all workers are busy, tasks are enqueued
3. Show task distribution across workers visually
4. Demonstrate WorkerPool class code with runTask and destroy methods
5. Show comparison: parallel vs sequential execution

## Checklist

- [ ] Pool created with configurable worker count
- [ ] Tasks distributed among free workers
- [ ] Task queue works when no free workers available
- [ ] Visual display of task distribution
- [ ] WorkerPool code shown and explained
- [ ] Performance comparison (parallel vs sequential)

## How to Verify

1. Click the run button
2. Verify tasks are distributed across workers (not all on one)
3. Check parallel execution time is less than sequential
4. Ensure WorkerPool code contains all necessary methods
