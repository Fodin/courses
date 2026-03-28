# Task 11.1: Users and Capabilities

## Objective

Learn to run containers as an unprivileged user, understand the Linux Capabilities system, use `--cap-drop`/`--cap-add` correctly, and know why `--privileged` is dangerous. Create an interactive reference component on these topics.

## Requirements

1. Create a component with three switchable sections: "Users", "Capabilities", "Seccomp and AppArmor"
2. The "Users" section shows a table with examples of the `USER` directive in a Dockerfile: a bad variant (root), a good variant (custom user), and examples for popular images (node, postgres, nginx) — with descriptions and commands
3. For each example, add a "Show Dockerfile" button — clicking it displays a code block
4. The "Capabilities" section shows a table of Linux capabilities (at least 8) with the name, description, risk level (high/medium/low), and recommendation (drop/keep). Add visual color-coded risk indicators
5. At the bottom of the Capabilities section — a "Minimum sets" block for typical services (web server, Node.js, DB) listing the required capabilities
6. The "Seccomp and AppArmor" section shows a description of each technology, what is blocked by default, and example run commands with profiles
7. At the bottom of the component — a "Key Principle" block describing the principle of least privilege

## Hints

- `useState<string>` for switching the active section
- `useState<Record<string, boolean>>` for showing/hiding code blocks
- Use colors for risk levels: red (high), orange (medium), green (low)
- Array of objects for capabilities: `{ name, description, risk, recommendation }`

## Checklist

- [ ] Three sections switch correctly
- [ ] Users table with examples (at least 5 variants)
- [ ] "Show Dockerfile" buttons work independently
- [ ] Capabilities table (at least 8 entries) with color risk indicators
- [ ] Minimum sets for 3 service types
- [ ] Seccomp and AppArmor description with example commands
- [ ] "Key Principle" block at the bottom

## How to Verify

1. Switch sections — the content changes correctly
2. In "Users", click the buttons — Dockerfile examples appear/disappear independently
3. In "Capabilities", at least 8 entries are visible with color risk indicators
4. Colors match levels: red = high, orange = medium, green = low
5. Minimum set blocks are present for 3 service types
6. Seccomp and AppArmor are described with example commands
7. The "Key Principle" block is visible at the bottom
