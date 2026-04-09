# Task 7.4: Parallel Test Execution

## Goal

Create an interactive parallel test execution simulator. Show the difference between sequential and parallel runs, allow configuring the number of shards, and observe how total pipeline time changes.

## Requirements

1. Show a test suite: 20 условных (conditional) tests with different execution times (1-5 seconds each)
2. Implement two modes: "Sequential" (1 shard) and "Parallel" (N shards)
3. Slider or buttons for selecting the number of shards (1, 2, 4, 8)
4. Visualize test distribution across shards — each shard as a horizontal bar, tests as blocks inside
5. Show total time for each mode and time savings
6. "Run Simulation" button — animates test execution (progress bars fill up)
7. Show YAML with correct `parallel: N` and `--shard=$CI_NODE_INDEX/$CI_NODE_TOTAL` usage

## Checklist

- [ ] Set of 12-20 tests displaying their relative size/time
- [ ] Buttons or slider for shard count selection (1, 2, 4, 8)
- [ ] Test distribution visualization across shards (horizontal bars)
- [ ] Display of each shard's execution time
- [ ] Total time (= slowest shard time) and comparison with sequential
- [ ] Time savings indicator in percentage
- [ ] Execution animation on "Run" press
- [ ] YAML with parallel: N and correct sharding command

## How to Verify

1. With 1 shard, total time should equal the sum of all tests
2. With 4 shards, total time should be roughly 4x less
3. With 8 shards, savings should be over 70% compared to 1 shard
4. Press "Run" — all shards should execute in parallel (simultaneous animation)
5. In YAML with parallel: 4, there should be a command with `--shard=$CI_NODE_INDEX/$CI_NODE_TOTAL`

## Hints

- Tests: array of objects `{id, name, duration}` where duration is in seconds (1-5)
- Distribution across shards: `tests.filter((_, i) => i % shards === shardIndex)`
- Shard time = sum of its test durations; total time = Math.max(...shardTimes)
- Use `useState` for `running` (boolean) and `setTimeout` for reset
- Progress can be shown via CSS transition on width (0% → 100%) with delay
- Savings: `Math.round((1 - parallelTime / sequentialTime) * 100)` %
