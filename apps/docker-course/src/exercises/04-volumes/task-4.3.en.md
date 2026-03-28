# Task 4.3: tmpfs and Read-only

## Objective

Learn about tmpfs mounts for storing data in RAM and read-only modes for improving container security.

## Requirements

1. Create a component with three sections: "tmpfs", "Read-only Container", "Combining"
2. "tmpfs" section — description with use cases (secrets, temporary files, high-performance I/O), a table of tmpfs parameters (tmpfs-size, tmpfs-mode), command examples
3. "Read-only Container" section — a step-by-step demonstration: a "Launch --read-only" button shows an error, then an "Add tmpfs Exceptions" button shows a working configuration. Visualize which directories are writable and which are not
4. "Combining" section — an interactive production configuration builder: checkboxes to select options (--read-only, tmpfs /tmp, tmpfs /run, volume for data, bind mount :ro for config), producing a final `docker run` command and a visual mount diagram
5. Add a comparison table of all three storage types: volumes, bind mounts, tmpfs

## Hints

- For the step-by-step demonstration: a `step` state (0, 1, 2), each step shows its own content
- For the builder: a state object with boolean fields for each option
- For the visual diagram: div blocks with color coding (green=rw, yellow=ro, blue=tmpfs)

## Checklist

- [ ] tmpfs section contains at least 3 use cases and a parameters table
- [ ] Step-by-step read-only demonstration: error → solution
- [ ] Builder generates a command with the selected options
- [ ] Visual diagram shows mount types with color coding
- [ ] Comparison table of volumes / bind mounts / tmpfs

## How to Verify

1. Switch between sections — each displays its own content
2. In the step-by-step demonstration, click the buttons — you should see the error, then the solution
3. In the builder, toggle options — the command and diagram update
4. Verify that the generated commands are syntactically correct
