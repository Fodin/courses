# Task 6.1: Structure of docker-compose.yml

## Objective

Understand the structure of the docker-compose.yml file: top-level sections, their purpose, the deprecated `version` key, and assembling a complete configuration example.

## Requirements

1. Create an interactive component with three sections: "File Sections", "Full Example", "version (deprecated)"
2. "File Sections" section — an interactive list of 3 top-level keys: `services` (required), `volumes`, `networks`. For each: a description and a YAML code example. Visually highlight the required section
3. "Full Example" section — a realistic docker-compose.yml for a web application (web + api + db) with 3 services, 2 networks, and 1 volume. Below the example, show statistics (number of services, networks, volumes)
4. "version (deprecated)" section — a comparison of the old format (with `version: '3.8'`) and the new format (without `version`), explaining why `version` is obsolete
5. Use tabs to switch between sections

## Hints

- An array of objects `{ key, label, required, desc, example }` for the sections
- For the full example, use `<pre>` with syntax highlighting
- `useState<'sections' | 'full' | 'version'>` for tab switching

## Checklist

- [ ] Three sections switchable via tabs
- [ ] All 3 top-level sections described with YAML examples
- [ ] `services` visually marked as required
- [ ] Full example contains services, networks, volumes
- [ ] Comparison of old and new format (version)
- [ ] Explanation of why version is obsolete

## How to Verify

1. Switch tabs — each shows its own content
2. In the section list, click each item — the YAML example changes
3. The full example must be syntactically valid YAML
4. The version section convincingly shows the key is no longer needed
