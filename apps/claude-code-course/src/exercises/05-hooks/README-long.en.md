# Exercise 5. Hooks — Extended Guide

## What Are Hooks?

Hooks in Claude Code are a mechanism for intercepting and modifying the agent's actions. They work similarly to middleware in web frameworks: an action passes through hooks, and each hook can modify, block, or log it.

## Hook Types

### PreToolUse

Triggered **before** a tool is used.

**Use cases:**
- Blocking dangerous commands (`rm -rf`, `DROP DATABASE`)
- Requiring confirmation for sensitive operations
- Enforcing corporate security policies
- Limiting file access

### PostToolUse

Triggered **after** a tool is used.

**Use cases:**
- Adding context to error messages
- Logging actions for audit
- Auto-fixing common errors
- Notifications to external systems

## Hook Priority

```
Managed Policy (highest priority, cannot be overridden)
    ↓
User-level (~/.claude/CLAUDE.md)
    ↓
Project-level (./CLAUDE.md)
    ↓
Subdirectory (src/CLAUDE.md, src/components/CLAUDE.md)
```

All levels **merge**, they do not replace each other.

## CLAUDE.md Structure

### Commands

```markdown
## Commands
- Install: `pnpm install`
- Dev server: `pnpm dev` (port 3000)
- Build: `pnpm build`
- Tests: `pnpm test`
- Single test: `pnpm test -- -t "test name"`
- Linting: `pnpm lint`
- Auto-fix: `pnpm lint --fix`
- Type check: `pnpm tsc --noEmit`
```

### Code Style and Conventions

Describe only what **cannot be derived** from configuration files:

```markdown
## Code style
- TypeScript strict mode, no any
- No semicolons
- Single quotes
- Named export (not default)
- CSS Modules (.module.css)
- Components: PascalCase, utilities: kebab-case
```

### Architectural Decisions

```markdown
## Architecture
- Feature-sliced: src/{app,pages,features,entities,shared}/
- State: Zustand
- API: src/shared/api/
- Forms: React Hook Form + Zod
```

### Gotchas

The most valuable part — things that cannot be learned from the code:

```markdown
## Gotchas
- CI fails if you forget `pnpm run generate` after changing the GraphQL schema
- Auth module tests must run sequentially
- macOS requires Docker for e2e tests
```

## /init Command

```bash
claude
> /init
```

Claude Code will study:
- `package.json` (scripts, dependencies)
- `tsconfig.json` (TypeScript settings)
- `.eslintrc` / `eslint.config.js` (linting rules)
- `.prettierrc` (formatting)
- Directory structure
- `.gitignore`
- Existing documentation

And will generate a CLAUDE.md with basic instructions.

## HTML Comments for Maintainers

CLAUDE.md is a file for the agent, but people also read it. HTML comments allow leaving notes for maintainers that the agent will ignore:

```markdown
<!--
  Last updated: 2025-03-15 (Vasya)
  TODO: update after migration to React 19
-->
```

## Real CLAUDE.md Example

See the README.en.md for a complete example.
