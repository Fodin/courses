# Exercise 7. Subagents

## Goal

Learn to use Subagents in Claude Code — the ability to delegate tasks to specialized agents running in parallel.

## Theory

### What Are Subagents

Subagents are specialized Claude agents that run in parallel to handle specific tasks. The main agent delegates work to subagents, which then work independently and return results.

```
Main Agent (orchestrator)
├── Subagent 1: "Research the API"
├── Subagent 2: "Write tests for the module"
└── Subagent 3: "Refactor the utility"
```

### Why Subagents?

**Without subagents:** the main agent does everything sequentially. If a task takes 10 minutes, you wait 10 minutes.

**With subagents:** tasks run in parallel. Three 10-minute tasks take ~10 minutes total (not 30).

### When to Use Subagents

| Scenario | Subagent? |
|---|---|
| Independent tasks that can run in parallel | Yes |
| Tasks that require different context | Yes |
| Tasks that need to share state | No |
| Tasks that depend on each other | No |
| Simple one-line commands | No (use Bash) |

### Creating Subagents

#### Via CLAUDE.md

```markdown
## Subagents
- api-explorer: research and document external APIs
- test-writer: write and run tests for modules
- code-reviewer: review code for quality and security
```

#### Via Prompt

```
Use subagents to:
1. Research the Stripe API documentation
2. Write tests for the payment module
3. Review the authentication code
```

### Subagent Context

Each subagent receives:
- **System prompt** — from CLAUDE.md and project settings
- **Task description** — what the main agent asked it to do
- **File access** — can read and edit files
- **Tool access** — same tools as the main agent (Read, Edit, Bash, etc.)

### Subagent Isolation

Subagents work in **isolated contexts**:
- They do not see each other's work
- They do not see the main agent's full conversation
- They only know their specific task

### Results Aggregation

When subagents complete, results return to the main agent:

```
Subagent 1 result ──┐
Subagent 2 result ──┼──▶ Main Agent aggregates and decides
Subagent 3 result ──┘
```

The main agent can:
- Use results directly
- Combine results into a single output
- Delegate follow-up tasks based on results

## Task

1. **Create a project** with at least 3 independent tasks:
   - Research a topic (e.g., API documentation)
   - Write code (e.g., a utility module)
   - Write tests for existing code

2. **Delegate tasks to subagents** via prompt or CLAUDE.md

3. **Verify that subagents work in parallel** — check that total time is close to the longest task, not the sum of all tasks

4. **Aggregate results** — have the main agent combine subagent outputs into a single report

## Verification Criteria

- [ ] Subagents are properly configured
- [ ] Tasks run in parallel (not sequentially)
- [ ] Subagents work in isolated contexts
- [ ] Results are correctly aggregated
- [ ] Subagents do not interfere with each other

## Additional Materials

- [Claude Code Subagents Documentation](https://docs.anthropic.com/en/docs/claude-code/subagents)
- [Subagents Examples](https://github.com/anthropics/claude-code-examples)
