# Task 12.2: Container Registry and Tagging

## Objective

Create an interactive reference component for Container Registries and Docker image tagging strategies. Learn to choose an appropriate registry, tag images correctly, and automate the process.

## Requirements

1. Create a component with three switchable sections: "Container Registries", "Tagging Strategies", "Automation"
2. The "Registries" section: a table of 6 registries (Docker Hub, GHCR, ECR, ACR, GCR, Harbor) with provider and free tier information
3. A "Details" button for each registry expands the URL, features (list), and an "Show auth" button with the authentication command
4. The "Tagging Strategies" section: 5 strategies (Semver, Git SHA, Branch, Timestamp, Build Number) — each with a description, example tags, and a color indicator by purpose
5. A warning that `latest` is a bad practice for production
6. The "Automation" section: a version input field + a "Generate" button — shows the list of tags that will be created
7. An example configuration of `docker/metadata-action` for GitHub Actions

## Hints

- `useState<'registries' | 'tags' | 'automation'>` for sections
- `useState<number | null>` for the selected registry
- `useState<Record<number, boolean>>` for showing/hiding auth commands
- For the simulator: parse input with regex `/^v?\d+\.\d+\.\d+$/` and generate tags
- For color-coded strategy indicators, use `borderLeft` with a color

## Checklist

- [ ] Three sections switch correctly
- [ ] Table of 6 registries with a "Details" button
- [ ] Registry details: URL, features, auth command
- [ ] 5 tagging strategies with examples and color indicators
- [ ] Warning about `latest`
- [ ] Tag generation simulator works
- [ ] metadata-action example

## How to Verify

1. Switch sections — the content changes correctly
2. In "Registries", click "Details" — URL, features, and the auth button appear
3. Click "Show auth" — the authentication command is displayed
4. In "Tagging Strategies", 5 strategies are visible with a colored left border and examples
5. The `latest` warning is visible at the bottom of the section
6. In "Automation", enter "v1.2.3" and click "Generate" — tags appear (semver + sha + branch + date)
7. The metadata-action example is displayed with YAML configuration
