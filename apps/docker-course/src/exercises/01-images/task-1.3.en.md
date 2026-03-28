# Task 1.3: docker build

## Objective

Understand the image build process and the key flags of the `docker build` command.

## Requirements

Create a component that shows:

1. **The main command** `docker build` with an explanation of each argument
2. **Key flags**:
   - `-t` / `--tag` — tagging the image
   - `-f` / `--file` — specifying the path to the Dockerfile
   - `--no-cache` — building without cache
   - `--build-arg` — passing build arguments
   - `--target` — building a specific stage (multi-stage)
3. **A sample build output** — show a typical log with an explanation of each step
4. **Build context** — explain what the build context is and why `.dockerignore` is needed

## Hints

- `docker build -t myapp:1.0 .` — the dot at the end is the build context
- Each instruction in the Dockerfile creates a new layer
- `--build-arg VERSION=1.0` passes a variable accessible via `ARG`

## Checklist

- [ ] The command is shown with the main flags
- [ ] The build context and `.dockerignore` are explained
- [ ] A sample build output is present
