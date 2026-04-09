# Task 1.4: The image keyword

## Goal

Learn to choose the right Docker image for different types of CI tasks: understand tradeoffs between image size, available tools, and pipeline speed.

---

## What to do

Create a `Task1_4` component that represents an interactive Docker image catalog for CI. The student sees characteristics of each image and can "assign" images to different project types.

### Requirements

1. Define TypeScript interface `DockerImage`:
   - `name` — image name (e.g., `'node:20-alpine'`)
   - `category` — category (`'javascript' | 'python' | 'go' | 'ruby' | 'generic'`)
   - `sizeMb` — approximate size in MB
   - `tools` — array of pre-installed tools (strings)
   - `useCases` — what tasks it suits (array of strings)
   - `pros` — advantages (array of strings)
   - `cons` — disadvantages (array of strings)

2. Create data for 6 images:
   - `node:20-alpine` (JS/TS projects, ~170 MB)
   - `python:3.11-slim` (Python projects, ~130 MB)
   - `golang:1.21-alpine` (Go projects, ~270 MB)
   - `ruby:3.2-alpine` (Ruby/Rails, ~80 MB)
   - `alpine:3.18` (Shell scripts, utilities, ~5 MB)
   - `ubuntu:22.04` (Complex builds, ~70 MB)

3. Display image cards in a grid (2-3 per row):
   - Image name
   - Size with color indicator (green — up to 100 MB, yellow — up to 300 MB, red — more)
   - Tool list
   - Click reveals details (pros/cons, use cases)

4. Implement a "Project → Image" matching task:
   - List of 4 project types (React app, Python script, Go microservice, Shell CI utility)
   - For each — a dropdown or button selection for image
   - "Check selection" button compares with correct answers

5. Show recommendations after checking: which image was chosen correctly, which not, and why

---

## Expected result

- Grid of Docker image cards
- Click on card reveals details with pros/cons
- Matching task with validation
- Explanation of correct answers

---

## Checklist

- [ ] `DockerImage` interface defined with all fields
- [ ] Data for 6 images implemented
- [ ] Cards displayed in a grid (grid or flex)
- [ ] Image size visually color-coded (green/yellow/red)
- [ ] Click on card shows details
- [ ] Matching task works
- [ ] "Check" button shows result with explanations
- [ ] No `any` in typing

---

## How to check yourself

1. Do you see a grid of 6 cards with sizes?
2. Card `alpine:3.18` has green size indicator (5 MB), and `golang:1.21-alpine` — yellow (270 MB)?
3. Click any card — did details with pros/cons expand?
4. In the matching task, select `ubuntu:22.04` for React app and press "Check" — do you see explanation why it's not optimal?
5. Select correct images for all projects — do you see green result?
