# Task 3.2: CMD vs ENTRYPOINT

## Objective

Understand the difference between CMD and ENTRYPOINT, learn to choose the right instruction and form (exec vs shell) for different scenarios.

## Requirements

1. Create an interactive component with a set of container launch scenarios (at least 6)
2. For each scenario, show: the Dockerfile instruction, the `docker run` command, the execution result
3. Scenarios must include: CMD exec form, CMD shell form, CMD override, ENTRYPOINT exec form, ENTRYPOINT + arguments, ENTRYPOINT + CMD, ENTRYPOINT + CMD override
4. Add an exec form vs shell form comparison table (via a button): PID 1 process, SIGTERM handling, graceful shutdown, variable substitution, syntax
5. Add a section with the entrypoint.sh pattern (via a button): an example script with `exec "$@"` and its usage

## Hints

- For each scenario, create an object with fields: name, dockerfile, runCommand, result
- Use a dark theme for code blocks (background: #1e1e1e)
- Divide the code block into sections: Dockerfile, Run command, Result
- For the exec vs shell table, highlight exec form in green and shell form in red

## Checklist

- [ ] At least 6 scenarios with switching are implemented
- [ ] Each scenario shows the Dockerfile, the docker run command, and the result
- [ ] The exec vs shell table contains at least 4 rows
- [ ] The table shows/hides via a button
- [ ] The entrypoint.sh pattern section shows/hides via a button
- [ ] The entrypoint.sh example contains `exec "$@"` and an explanation

## How to verify

1. Switch between scenarios — make sure each one shows a unique CMD/ENTRYPOINT combination
2. Verify that the execution result is logically consistent with the Dockerfile and the run command
3. Open the exec vs shell table — exec form should be marked as recommended
4. Open the entrypoint.sh pattern — the example should be clear and contain an explanation
