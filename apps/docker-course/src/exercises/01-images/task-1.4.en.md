# Task 1.4: Tags and Versioning

## Objective

Master tagging strategies for Docker images.

## Requirements

Create a component that displays:

1. **A tagging scheme** — show a versioning strategy for a project:
   - Semantic versioning (`1.0.0`, `1.0`, `1`)
   - Commit hash (`abc123f`)
   - Build date (`2024-01-15`)
   - Environment (`prod`, `staging`, `dev`)
2. **The `latest` tag problem** — explain why `latest` does not mean "the newest" and why this is dangerous
3. **Commands for working with tags**:
   - `docker tag` — creating additional tags
   - `docker push` — pushing to a registry
4. **Recommended strategy** for a CI/CD pipeline

## Hints

- `latest` is just the default tag; it is not updated automatically
- `docker tag myapp:latest myapp:1.0.0` — adding a tag to an existing image
- In CI/CD, images are usually tagged both by semver and by commit hash

## Checklist

- [ ] Different tagging strategies are shown
- [ ] The `latest` problem is explained
- [ ] Example `docker tag` commands are present
