# Task 10.2: Multi-Stage Builds

## Objective

Study the multi-stage builds pattern: how to separate the build and runtime stages, use `COPY --from`, and apply the builder-runner pattern for different programming languages.

## Requirements

1. Create a component with four switchable tabs: "Node.js", "Go", "Python", "Java"
2. Each tab shows two code blocks side by side (or stacked): "Before optimization" (single-stage Dockerfile) and "Multi-stage Dockerfile"
3. For each language, show the image size before and after optimization with a visual comparison (two progress bars)
4. Add a "Show diagram" button — displays a text ASCII diagram illustrating what ends up in the final image and what is discarded
5. At the bottom: a table with commands for working with multi-stage builds (`--target`, `COPY --from=<stage>`, `COPY --from=<image>`)
6. A warning block about how `COPY --from` can copy from external images, not just from stages

## Hints

- `useState<string>` for the active language tab
- `useState<boolean>` for showing/hiding the ASCII diagram
- Data: `{ lang, beforeDockerfile, afterDockerfile, beforeSize, afterSize, sizeReduction }`
- Progress bars: beforeSize = 100%, afterSize proportionally

## Checklist

- [ ] Four tabs (Node.js, Go, Python, Java) are switchable
- [ ] For each language: "before" and "after" Dockerfile
- [ ] Visual size comparison (progress bars with numbers)
- [ ] "Show diagram" button with ASCII diagram
- [ ] Multi-stage commands table (--target, COPY --from)
- [ ] Warning about COPY --from with external images

## How to Verify

1. Switch language tabs — the Dockerfile examples change
2. Before/after sizes are visually distinct, numbers are shown
3. The "Show diagram" button shows/hides the diagram
4. The commands table contains at least 3 entries with examples
5. The warning is always visible
