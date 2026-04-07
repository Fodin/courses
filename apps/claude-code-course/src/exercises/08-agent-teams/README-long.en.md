# Exercise 8. Agent Teams — Extended Guide

## What Are Agent Teams?

Agent Teams allow multiple Claude Code agents to work together on complex tasks with explicit coordination. Unlike subagents (delegated by a single agent), teams involve structured roles and communication between agents.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Orchestrator                    │
│  (coordinates work, manages handoffs, decides)   │
│                                                  │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│    │Developer │  │ Reviewer │  │   QA     │     │
│    │  Agent   │  │  Agent   │  │  Agent   │     │
│    │          │  │          │  │          │     │
│    │ Context A│  │ Context B│  │ Context C│     │
│    └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
```

### Key Properties

1. **Specialized roles** — each agent has expertise in a specific area
2. **Explicit coordination** — orchestrator manages the workflow
3. **Structured handoffs** — clear communication between agents
4. **Quality through review** — multiple eyes on the work

## Orchestration Patterns

### 1. Sequential Pipeline

```
Researcher → Architect → Developer → Reviewer → QA
```

**When to use:**
- Complex features requiring thorough research
- Projects where quality is more important than speed
- Tasks where each step builds on the previous

**Pros:**
- High quality output
- Each stage validateses the previous
- Clear responsibility

**Cons:**
- Slowest pattern
- Most expensive (many agent turns)
- Bottleneck at each stage

### 2. Parallel Development + Review

```
Developer A (feature 1) ──┐
                          ├──▶ Reviewer
Developer B (feature 2) ──┘
```

**When to use:**
- Multiple independent features
- Tight deadline
- Need both speed and quality

**Pros:**
- Faster than sequential
- Still has review
- Good use of parallelism

**Cons:**
- Reviewer can become bottleneck
- Features may have inconsistencies
- More complex coordination

### 3. Iterative Refinement

```
Developer → Reviewer → Developer → Reviewer → Done
              ↑____________↓
               feedback loop
```

**When to use:**
- Critical code (security, infrastructure)
- Complex refactoring
- Learning/mentoring scenarios

**Pros:**
- Highest quality
- Developer learns from feedback
- Catches subtle bugs

**Cons:**
- Most expensive
- Can loop indefinitely
- Needs exit criteria

### 4. Hub and Spoke

```
         ┌─── Developer A
         ├─── Developer B
Orchestrator ─── Developer C
         ├─── QA
         └─── Reviewer
```

**When to use:**
- Large projects with many components
- Need centralized decision-making
- Components have dependencies

## Agent Roles in Detail

### Developer

```markdown
You are a senior software developer.
- Write clean, well-documented code
- Follow project conventions from CLAUDE.md
- Write tests for your code
- Handle errors properly
```

### Reviewer

```markdown
You are a code reviewer.
- Check for code quality and security
- Look for bugs and edge cases
- Suggest improvements
- Verify that tests are adequate
```

### QA Engineer

```markdown
You are a QA engineer.
- Write comprehensive tests
- Cover edge cases and error paths
- Ensure test names are descriptive
- Run tests and fix failures
```

### Architect

```markdown
You are a software architect.
- Design the overall solution
- Make technology choices
- Define interfaces and contracts
- Consider scalability and maintainability
```

### Researcher

```markdown
You are a technical researcher.
- Study API documentation
- Compare approaches
- Document findings
- Recommend best practices
```

## Handoff Protocol

### Good Handoff

```markdown
## Handoff: Developer → Reviewer

### Completed work
- src/auth/login.ts — login endpoint with JWT
- src/auth/jwt.ts — token generation and validation
- src/api/auth-routes.ts — route definitions

### What to focus on
- JWT expiration logic (line 45 in jwt.ts)
- Error handling in login endpoint
- Input validation on request body

### Known limitations
- Does not handle refresh tokens yet
- Rate limiting not implemented
```

### Bad Handoff

```markdown
## Handoff
Done with auth. Review it.
```

## Team Configuration

```json
{
  "agentTeams": {
    "feature-team": {
      "orchestrator": {
        "prompt": "You manage a team. Delegate work based on expertise."
      },
      "agents": [
        {
          "name": "developer",
          "role": "Writes code",
          "prompt": "You are a senior developer..."
        },
        {
          "name": "reviewer",
          "role": "Reviews code",
          "prompt": "You are a code reviewer..."
        },
        {
          "name": "qa",
          "role": "Tests code",
          "prompt": "You are a QA engineer..."
        }
      ],
      "workflow": "sequential",
      "maxIterations": 3
    }
  }
}
```

## Best Practices

### 1. Clear Role Definitions

Each agent should know exactly what to do:

```
Good: "You are a senior React developer specializing in forms"
Bad: "You write code"
```

### 2. Structured Handoffs

Include what was done, what needs attention, and known issues.

### 3. Exit Criteria

Define when the team is done:

```markdown
Done when:
- [ ] All tests pass
- [ ] Reviewer approves
- [ ] No security issues
- [ ] Code follows project conventions
```

### 4. Limit Iterations

Prevent infinite loops:

```json
{
  "maxIterations": 3
}
```

### 5. Monitor Costs

Agent teams consume many tokens. Monitor usage:

- Each agent turn costs tokens
- Review cycles multiply costs
- Large teams = more overhead

## Common Mistakes

1. **Undefined roles** — agents step on each other's toes
2. **No handoff structure** — information is lost between agents
3. **Infinite review loops** — no exit criteria
4. **Too many agents** — overhead outweighs benefits
5. **No orchestrator** — agents work without coordination

## Agent Teams vs Subagents

| Feature | Agent Teams | Subagents |
|---|---|---|
| Coordination | Explicit orchestrator | Delegated by main agent |
| Communication | Structured handoffs | Results returned to main |
| Roles | Specialized per agent | Same capabilities |
| Use case | Complex multi-step workflows | Parallel independent tasks |
| Cost | Higher (many turns) | Moderate |
