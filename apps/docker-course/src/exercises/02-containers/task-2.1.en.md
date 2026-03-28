# Task 2.1: docker run

## Objective
Understand how to start containers and what happens when `docker run` is called.

## Requirements
Create a component that displays:

1. **Several examples** of `docker run` with different images and parameters
2. For each example — a **step-by-step description** of what happens inside Docker
3. Explain the format: `docker run [OPTIONS] IMAGE [COMMAND] [ARGS]`

## Hints
- `docker run ubuntu echo "Hello"` — foreground, the container will exit immediately
- `docker run -it ubuntu bash` — interactive shell
- `docker run -d nginx` — background mode
- `docker run --rm alpine echo hi` — auto-remove after exit

## Checklist
- [ ] At least 3 docker run examples are shown
- [ ] The execution steps are described for each one
- [ ] The command format is explained
