# Task 1.2: Dockerfile Structure

## Objective

Study the main Dockerfile instructions and understand their purpose.

## Requirements

Create a component that displays an example Dockerfile for a Node.js application with detailed comments:

1. Use the instructions: `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, `CMD`
2. For each instruction, add an explanation:
   - What it does
   - Why it appears in that particular order
3. Show a **bad** and a **good** example Dockerfile, explaining the difference

## Hints

- `FROM` always comes first — it sets the base image
- Instruction order affects layer caching
- `COPY package*.json ./` before `COPY . .` — a classic optimization
- `CMD` vs `ENTRYPOINT` — `CMD` is sufficient for now

## Checklist

- [ ] The Dockerfile contains all listed instructions
- [ ] Each instruction is commented
- [ ] A comparison of the good and bad approaches is present
