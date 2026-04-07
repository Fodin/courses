# Exercise 7. Subagents — Extended Guide

## What Are Subagents?

Subagents are a Claude Code feature that allows the main agent to delegate tasks to specialized agents running in parallel. Each subagent works in an isolated context with its own conversation and tool usage.

## Architecture

```
┌─────────────────────────────────────────┐
│          Main Agent (Claude)            │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐  │
│  │Subagent 1│  │Subagent 2│  │Subag.3│  │
│  │          │  │          │  │       │  │
│  │ Context A│  │ Context B│  │Ctx. C │  │
│  └──────────┘  └──────────┘  └───────┘  │
└─────────────────────────────────────────┘
```

### Key Properties

1. **Parallelism** — subagents run simultaneously
2. **Isolation** — each subagent has its own context
3. **Independence** — subagents do not see each other's work
4. **Full capabilities** — subagents have the same tools as the main agent

## When to Use Subagents

### Good Use Cases

- **Parallel research** — research multiple APIs simultaneously
- **Multiple file changes** — edit unrelated files in parallel
- **Test writing** — write tests while main agent continues development
- **Code review** — review multiple PRs at once
- **Documentation** — document multiple modules simultaneously

### Bad Use Cases

- **Sequential dependencies** — task B needs task A's result
- **Shared state** — multiple agents modifying the same file
- **Simple commands** — `ls`, `cat`, `grep` do not need a subagent
- **Quick questions** — the main agent can answer directly

## How Subagents Work

### 1. Delegation

The main agent identifies tasks that can be parallelized and delegates them:

```
User: "Research the Stripe and PayPal APIs, then write integration modules"

Main Agent delegates:
- Subagent 1: "Research Stripe API documentation"
- Subagent 2: "Research PayPal API documentation"
```

### 2. Execution

Subagents run in parallel, each with:
- Its own conversation with Claude
- Access to files and tools
- Isolated context (no cross-talk)

### 3. Aggregation

Results return to the main agent, which:
- Reviews all outputs
- Combines them into a coherent response
- May delegate follow-up tasks

## Subagent Configuration

### Via CLAUDE.md

```markdown
## Subagents
- api-researcher: specialized in API documentation
- test-writer: specialized in writing tests
- code-reviewer: specialized in code review
```

### Via Prompt

Simply ask Claude to use subagents:

```
Please use subagents to research both APIs in parallel.
```

Claude will automatically create subagents for independent tasks.

## Subagent Context and Tools

### What Subagents Receive

- **Project context** — CLAUDE.md, codebase structure
- **Task description** — specific instructions from the main agent
- **File access** — can read and edit files
- **Tool access** — Read, Edit, Bash, Grep, Glob, etc.

### What Subagents Do NOT Receive

- **Main agent's conversation** — only the task description
- **Other subagents' results** — each works independently
- **User's direct input** — communication goes through the main agent

## Subagent Lifecycle

```
1. Main agent identifies parallelizable tasks
2. Main agent creates subagents with task descriptions
3. Subagents run in parallel
4. Each subagent completes its task
5. Results return to main agent
6. Main agent aggregates and presents results
```

## Best Practices

### 1. Make Tasks Independent

Subagents work best when tasks do not depend on each other:

```
Good: "Research API A" and "Research API B" — independent
Bad: "Research API A" and "Use API A results to research B" — dependent
```

### 2. Give Clear Task Descriptions

The subagent needs specific instructions:

```
Good: "Find all endpoints in src/api/ that handle user authentication"
Bad: "Look at the API"
```

### 3. Limit Subagent Scope

Specify what the subagent should and should not do:

```
"Research the Stripe API for payments only. Do NOT look at subscriptions or invoicing."
```

### 4. Monitor Resource Usage

Each subagent consumes tokens and time:

- Too many subagents = high cost
- Too complex tasks = long execution
- Too many tools = context overhead

## Debugging Subagents

```bash
# Check subagent activity in verbose mode
claude --verbose

# Check subagent logs
claude --debug
```

## Common Mistakes

1. **Creating subagents for sequential tasks** — no parallelism benefit
2. **Vague task descriptions** — subagents waste time figuring out what to do
3. **Too many subagents** — overhead outweighs parallelism benefits
4. **Not aggregating results** — raw subagent output is not user-friendly
5. **Ignoring subagent errors** — errors in subagents need attention

## Subagents vs MCP vs Hooks

| Feature | Subagents | MCP | Hooks |
|---|---|---|---|
| Purpose | Parallel task execution | External tool integration | Action interception |
| Runs | In parallel | External process | Before/after tool use |
| Context | Isolated | N/A | Same as main agent |
| Configuration | CLAUDE.md / Prompt | .mcp.json | Hooks file |
