# Exercise 8. Agent Teams

## Goal

Learn to orchestrate multiple Claude Code agents working together on complex tasks.

## Theory

### What Are Agent Teams

Agent Teams is a Claude Code feature that allows multiple agents to work together on complex tasks. Unlike subagents (which are delegated by a single agent), teams involve explicit coordination between agents.

```
┌─────────────────────────────────────────────┐
│               Orchestrator                   │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Developer│  │  Reviewer │  │   QA     │   │
│  │  Agent   │  │   Agent   │  │  Agent   │   │
│  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────┘
```

### Agent Roles

Each agent in a team can have a specialized role:

- **Developer** — writes code, implements features
- **Reviewer** — reviews code, checks quality
- **QA** — writes and runs tests
- **Architect** — designs solutions, makes decisions
- **Researcher** — gathers information, studies APIs

### Orchestration Patterns

#### 1. Sequential Pipeline

```
Researcher → Architect → Developer → Reviewer → QA
```

Each agent works on the output of the previous one. Good for quality-focused workflows.

#### 2. Parallel Work + Review

```
Developer A ──┐
              ├──▶ Reviewer
Developer B ──┘
```

Multiple developers work in parallel, then a reviewer checks everything.

#### 3. Iterative Refinement

```
Developer → Reviewer → Developer → Reviewer → Done
              ↑___________↓
                feedback loop
```

Agents iterate back and forth until quality standards are met.

### Agent Communication

Agents communicate through:
- **Shared files** — agents read/write to the same codebase
- **Handoff messages** — structured messages between agents
- **Shared context** — common CLAUDE.md and project settings

### Team Configuration

```json
{
  "agentTeams": {
    "feature-team": {
      "orchestrator": {
        "prompt": "You manage a team of 3 agents. Coordinate their work."
      },
      "agents": [
        {
          "name": "developer",
          "prompt": "You are a senior developer. Write clean, tested code."
        },
        {
          "name": "reviewer",
          "prompt": "You are a code reviewer. Check for quality and security."
        },
        {
          "name": "qa",
          "prompt": "You are a QA engineer. Write comprehensive tests."
        }
      ]
    }
  }
}
```

### Handoff Protocol

When one agent passes work to another:

```markdown
## Handoff from Developer to Reviewer

### What was done
- Implemented user authentication module
- Added JWT token generation
- Created login/logout endpoints

### What needs review
- src/auth/login.ts
- src/auth/jwt.ts
- src/api/auth-routes.ts

### Known issues
- Password validation could be stricter
```

## Task

1. **Create an agent team** for a feature development workflow:
   - Developer agent writes code
   - Reviewer agent checks quality
   - QA agent writes tests

2. **Implement a feature** using the team:
   - Define the feature requirements
   - Let the orchestrator delegate work
   - Ensure each agent does its role

3. **Test different orchestration patterns**:
   - Sequential pipeline
   - Parallel development + review
   - Iterative refinement

4. **Compare quality** of team output vs. single-agent output

## Verification Criteria

- [ ] Agent team is properly configured
- [ ] Each agent has a clear role and prompt
- [ ] Agents communicate through handoffs
- [ ] Orchestrator delegates work effectively
- [ ] Final output is higher quality than single-agent

## Additional Materials

- [Claude Code Agent Teams Documentation](https://docs.anthropic.com/en/docs/claude-code/agent-teams)
- [Multi-Agent Patterns](https://docs.anthropic.com/en/docs/build-with-claude/patterns/multi-agent)
