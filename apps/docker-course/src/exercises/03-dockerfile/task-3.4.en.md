# Task 3.4: Multi-stage builds

## Objective

Master multi-stage Docker image builds to create compact production images, and learn to separate build and runtime stages.

## Requirements

1. Create a component with at least 3 multi-stage build examples: Node.js API, React + Nginx, Go API
2. For each example, show the build stages as cards: stage name, base image, purpose, contents, size
3. Implement a visual size comparison: single-stage vs multi-stage build with a size reduction percentage
4. Add a show/hide button for the full Dockerfile for each example
5. Add a block with the key principles of multi-stage builds

## Hints

- For each example, define an array of stages with fields: name, baseImage, purpose, contents, size, color
- Lay out stage cards horizontally using flex
- For the size comparison, use bars of different widths (proportional to size)
- The Go example with the `scratch` image gives the most impressive size reduction
- Dockerfile examples should be production-ready: USER, HEALTHCHECK, EXPOSE

## Checklist

- [ ] At least 3 examples (Node.js, React, Go) are implemented
- [ ] Build stages are shown as cards for each example
- [ ] Cards contain: name, base image, purpose, contents, size
- [ ] Visual comparison of single-stage vs multi-stage sizes
- [ ] Size reduction percentage is shown
- [ ] The show/hide Dockerfile button works
- [ ] Dockerfile examples follow best practices (USER, HEALTHCHECK)
- [ ] A block with multi-stage build principles is present

## How to verify

1. Switch between examples — each should show its own stages and sizes
2. Check the sizes: the Go application should show a reduction from ~1.2 GB to ~10 MB
3. Open a Dockerfile — it should contain COPY --from=builder and be production-ready
4. Make sure the multi-stage build principles are correct
