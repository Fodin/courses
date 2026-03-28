# Task 4.2: Bind Mounts

## Objective

Understand the bind mount mechanism — directly mounting host directories and files into a container, compare the `-v` and `--mount` syntaxes, and explore typical use cases.

## Requirements

1. Create a component with two main sections: "Use Cases" and "-v vs --mount Syntax"
2. "Use Cases" section — cards for three use cases: development (hot-reload), configuration files, logging. Each card: name, description, a command example in a `<pre>` block
3. "Syntax" section — a side-by-side comparison of `-v` and `--mount` for three operations: volume mount, bind mount, bind mount read-only. Show both variants next to each other for each operation
4. Add an interactive bind mount "command builder": dropdowns or buttons to select parameters (type: file/directory, access: rw/ro, syntax: -v/--mount), producing a ready-to-use `docker run` command
5. Show a "Common Pitfalls" block with two examples: relative path and overwriting node_modules

## Hints

- For cards: an array of objects with fields `title`, `description`, `command`
- For the builder: three state values (type, access, syntax), command generated via a template string
- For the syntax comparison: a table with 3 columns (operation, `-v`, `--mount`)

## Checklist

- [ ] At least 3 use case cards with command examples
- [ ] Side-by-side comparison of `-v` vs `--mount` for 3 operations
- [ ] Command builder generates a correct command when parameters are selected
- [ ] "Common Pitfalls" block with bad and correct code examples
- [ ] All examples use absolute paths

## How to Verify

1. Switch between sections — the content should change
2. In the builder, change parameters — the command should update
3. Verify that the generated commands are syntactically correct
4. Confirm that bind mount examples use absolute paths
