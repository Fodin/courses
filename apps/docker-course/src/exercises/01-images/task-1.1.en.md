# Task 1.1: docker pull and registries

## Objective

Get comfortable with the `docker pull` command and different image registries.

## Requirements

Create a component that displays:

1. **A list of registries** — at least 3 registries (Docker Hub, GitHub Container Registry, and one of your choice)
2. For each registry, show:
   - Name and a brief description
   - Example `docker pull` commands with explanations
3. **Image name format**: explain the scheme `[registry/][namespace/]name[:tag][@sha256:digest]`

## Hints

- Docker Hub is the default registry and can be omitted: `docker pull nginx` = `docker pull docker.io/library/nginx`
- `docker pull nginx:1.25-alpine` — a specific version
- `docker pull ghcr.io/owner/image:tag` — an image from GitHub Container Registry
- A digest (`@sha256:...`) guarantees reproducibility

## Checklist

- [ ] At least 3 registries are shown
- [ ] Each one has example commands
- [ ] The image name format is explained
