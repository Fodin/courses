# Task 6.2: services, image, build

## Objective

Understand the ways to define services: using pre-built images (`image`), building from a Dockerfile (`build`), extended build configuration, and `container_name`.

## Requirements

1. Create a component with switchable examples (at least 5): image (pre-built), build (simple), build (extended configuration), image + build (combination), container_name
2. Each example contains a YAML snippet and a text description
3. Add a summary table with columns: option, when to use, example
4. Add a tip block for choosing between `image` and `build`

## Hints

- An array of objects `{ key, label, yaml, desc }` for the examples
- Show the difference between `build: ./api` and the extended `build:` with context, dockerfile, args, target
- Explain why the `image + build` combination is useful

## Checklist

- [ ] At least 5 switchable examples
- [ ] image examples: Docker Hub, private registry, digest
- [ ] build examples: simple and extended (context, dockerfile, args, target)
- [ ] image + build example for tagging
- [ ] container_name example with a warning
- [ ] Summary table with recommendations
- [ ] Tip block for choosing between options

## How to Verify

1. Switch examples — each shows different YAML
2. The table should help quickly choose the right option
3. The container_name warning is visible and clear
