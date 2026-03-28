# Task 8.1: ENV and .env files

## Objective

Understand the mechanisms for passing environment variables: the `ENV` instruction in Dockerfile, the `-e` flag at runtime, `.env` files in Docker Compose, variable substitution syntax, and priority resolution.

## Requirements

1. Create a component with five switchable sections: "ENV in Dockerfile", "ARG vs ENV", "-e Flag at Runtime", ".env File", "Substitution in Compose"
2. Each section contains a code block (Dockerfile / bash / YAML) and a list of key points
3. For the "ARG vs ENV" section show the differences: availability at build/run time, override methods, warning about secrets in ARG
4. For the "Substitution in Compose" section show the syntax: `${VAR:-default}`, `${VAR:?error}`, `${VAR:+alt}`
5. Add a toggle button to show/hide the variable priority table (5 levels: from `environment:` in Compose to `ENV` in Dockerfile)
6. At the bottom of the component show a substitution syntax summary (4 variants as a grid)

## Hints

- Array of objects for sections: `{ key, label, code, notes }` — code is a multi-line string, notes is an array of strings
- `useState<string>` for the active section, `useState<boolean>` for showing/hiding the priority table
- Priority table: `{ source, priority, example }[]`
- Substitution summary: 2x2 grid with syntax variants

## Checklist

- [ ] Five sections switch correctly
- [ ] Each section: code block + list of key points
- [ ] ARG vs ENV: clear differences (build vs run, --build-arg vs -e)
- [ ] Substitution: ${VAR:-default}, ${VAR:?error}, ${VAR:+alt}
- [ ] Priority table (5 levels) via button
- [ ] Warning about secrets in ARG
- [ ] Substitution syntax summary at the bottom

## How to verify

1. Switch sections — content changes, code is unique for each section
2. In "ARG vs ENV" make sure there is a warning about docker history
3. Click the priority button — table appears/disappears, 5 rows sorted by priority
4. In "Substitution in Compose" all three syntax variants are described
5. The summary at the bottom shows 4 substitution variants as a grid
