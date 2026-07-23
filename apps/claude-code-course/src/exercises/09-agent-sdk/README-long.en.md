# Level 9: Claude Agent SDK

## Introduction

Up to this level, we've worked with Claude Code as users: opening a terminal, writing prompts, getting a result. That's like driving a car manually -- you're behind the wheel, making every decision. The Agent SDK is a shift to autopilot: you set the route from code, and the agent drives itself.

The Agent SDK provides **programmatic access** to all of Claude Code's capabilities: the same tools (Read, Edit, Bash, Grep...), the same agent loop, the same project context. But now you control it from TypeScript or Python, embedding the agent into your scripts, pipelines, and applications.

🔥 **Key idea:** the Agent SDK isn't "just another wrapper around the API." It's a full-fledged autonomous agent that can plan, use tools, and iteratively solve tasks.

---

## Agent SDK vs. Client SDK (Anthropic SDK)

This is **the most common point of confusion** for beginners. Let's work through it with an analogy.

**Client SDK (Anthropic SDK)** is a phone. You call an expert, ask a question, get an answer. If something needs to be done with the answer, you do it yourself. If you need to ask a follow-up, you call again.

**Agent SDK** is a hired specialist. You give them a task, and they study the project themselves, open files, write code, run tests, fix errors. You get a finished result.

| Aspect | Client SDK | Agent SDK |
|--------|-----------|-----------|
| Import | `@anthropic-ai/sdk` | `@anthropic-ai/claude-agent-sdk` |
| What you write | Prompts + response handling | The task + configuration |
| Agent loop | You implement it yourself | Built in |
| Tools | You define and call them yourself | Built in (Read, Edit, Bash...) |
| Project context | You pass it in manually | CLAUDE.md, git, structure |
| Typical use | Chatbots, text generation | Development automation |

---

## Installation

```bash
# TypeScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
```

---

## Basic Example

### TypeScript

```typescript
import { query, ClaudeAgentOptions } from '@anthropic-ai/claude-agent-sdk'

const options: ClaudeAgentOptions = {
  allowedTools: ['Read', 'Edit', 'Bash', 'Glob', 'Grep'],
  maxTurns: 10
}

// Streaming — get results as they're generated
for await (const message of query({
  prompt: 'Find and fix the bug in auth.ts',
  options
})) {
  if (message.type === 'text') {
    process.stdout.write(message.content)
  }
  if (message.type === 'tool_use') {
    console.log(`Using tool: ${message.name}`)
  }
}
```

### Python

```python
from claude_agent_sdk import query

for message in query(
    prompt="Find and fix the bug in auth.ts",
    allowed_tools=["Read", "Edit", "Bash", "Glob", "Grep"],
    max_turns=10
):
    if message.type == "text":
        print(message.content, end="")
    elif message.type == "tool_use":
        print(f"Using tool: {message.name}")
```

---

## Built-in Tools

The Agent SDK provides the same tools as Claude Code in the terminal:

| Tool | Purpose | Example |
|-----------|------------|--------|
| `Read` | Reading files | Source code, configs |
| `Write` | Creating files | New modules |
| `Edit` | Editing files | Targeted changes |
| `Bash` | Running commands | `npm test`, `git status` |
| `Glob` | Finding files by pattern | `**/*.test.ts` |
| `Grep` | Searching content | Finding functions, patterns |
| `WebSearch` | Searching the internet | Documentation, examples |
| `WebFetch` | Fetching web pages | API documentation |

---

## Custom Tools

You can extend the agent's capabilities with your own tools:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

const customTools = [
  {
    name: 'deploy',
    description: 'Deploy a service to the staging environment',
    parameters: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name' },
        version: { type: 'string', description: 'Version tag' }
      },
      required: ['service', 'version']
    },
    execute: async ({ service, version }: { service: string, version: string }) => {
      // Your deployment logic
      const result = await deployToStaging(service, version)
      return JSON.stringify({ status: result.status, url: result.url })
    }
  },
]
```

The agent itself decides when to call a custom tool, based on the task. You can add as many tools as you like: deployment, Slack notifications, creating tickets.

---

## Hooks from Code

Hooks let you intercept the agent's actions programmatically:

```typescript
const options: ClaudeAgentOptions = {
  allowedTools: ['Read', 'Edit', 'Bash'],
  hooks: {
    preToolUse: async (tool, input) => {
      // Log every tool call
      await auditLog.write({
        tool: tool.name,
        input: JSON.stringify(input),
        timestamp: new Date()
      })
      // Block dangerous commands
      if (tool.name === 'Bash' && input.command.includes('rm -rf')) {
        return { decision: 'block', reason: 'Destructive command blocked' }
      }
      return { decision: 'allow' }
    },
    postToolUse: async (tool, input, output) => {
      // Verify results after editing
      if (tool.name === 'Edit') {
        await runLinter(input.file_path)
      }
    }
  }
}
```

---

## Sessions (Resume)

Sessions let you continue the agent's work across calls:

```typescript
// First call — start a review
let sessionId: string

for await (const msg of query({
  prompt: 'Review this codebase for performance issues'
})) {
  if (msg.type === 'session') {
    sessionId = msg.session_id // Save the session ID
  }
}

// Second call — continue in the same context
for await (const msg of query({
  prompt: 'Now focus on the database queries',
  sessionId // Pass in the saved ID
})) {
  console.log(msg)
}
```

This is useful for:
- Multi-stage tasks (review -> fix -> verify)
- Long-running processes with pauses
- Interactive scenarios involving a human

---

## Structured Outputs

Getting results in a structured format:

```typescript
for await (const msg of query({
  prompt: 'Analyze auth.ts and list all security issues',
  options: {
    outputFormat: 'json'
  }
})) {
  if (msg.type === 'result') {
    const issues: SecurityIssue[] = JSON.parse(msg.content)
    issues.forEach(issue => {
      createJiraTicket(issue)
    })
  }
}
```

---

## Cost Tracking

Monitoring spend is critical for production:

```typescript
let totalCost = 0

for await (const msg of query({
  prompt: 'Refactor the payment module',
  options: { allowedTools: ['Read', 'Edit', 'Bash'] }
})) {
  if (msg.type === 'cost') {
    totalCost = msg.total_cost_usd
    if (totalCost > 5.0) {
      console.warn(`Cost limit approaching: $${totalCost}`)
    }
  }
}

console.log(`Total cost: $${totalCost}`)
```

---

## CI/CD Integration

The Agent SDK is a great fit for automation in pipelines:

```typescript
// ci/code-review.ts
import { query } from '@anthropic-ai/claude-agent-sdk'

async function reviewPR(diffContent: string): Promise<ReviewResult> {
  const issues: string[] = []

  for await (const msg of query({
    prompt: `Review this diff for bugs, security issues, and style problems:\n${diffContent}`,
    options: {
      allowedTools: ['Read', 'Grep', 'Glob'],
      maxTurns: 5
    }
  })) {
    if (msg.type === 'text') {
      issues.push(msg.content)
    }
  }

  return { issues, passed: issues.length === 0 }
}
```

---

## Hosting

The Agent SDK runs on various platforms: a self-hosted server (full control), Amazon Bedrock (AWS integration), Google Vertex AI (GCP integration). The choice depends on your security requirements and existing infrastructure.

---

## ⚠️ Common Beginner Mistakes

### 🐛 1. Using the Client SDK Instead of the Agent SDK

```typescript
// ❌ Client SDK — you implement all the logic yourself
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()
const response = await client.messages.create({
  model: 'claude-opus-4-8',
  messages: [{ role: 'user', content: 'Fix the bug in auth.ts' }]
})
// Claude will give text advice, but won't open the file or fix the code
```

> **Why this is a mistake:** the Client SDK is an API for exchanging messages. The agent won't be able to read your file, edit it, or run tests. You'd have to implement all of that yourself.

```typescript
// ✅ Agent SDK — the agent finds the file itself, reads it, fixes it, and verifies it
import { query } from '@anthropic-ai/claude-agent-sdk'
for await (const msg of query({
  prompt: 'Fix the bug in auth.ts',
  options: { allowedTools: ['Read', 'Edit', 'Bash'] }
})) {
  console.log(msg)
}
```

### 🐛 2. Overly Broad Permissions

```typescript
// ❌ The agent can run any bash command
const options = {
  allowedTools: ['Bash']  // rm -rf / ? curl | sh ?
}
```

> **Why this is a mistake:** in a CI/CD or production environment, an agent with unrestricted Bash access can cause serious damage. Always follow the principle of least privilege.

```typescript
// ✅ Only the necessary tools
const options = {
  allowedTools: ['Read', 'Grep', 'Glob']  // Read-only
}

// ✅ Or Bash with hooks for filtering (see the "Hooks from Code" section)
```

### 🐛 3. Ignoring Cost Tracking

> **Why this is a mistake:** without monitoring spend, an agent in CI can burn through hundreds of dollars overnight, especially if it gets stuck looping on an unsolvable task. Always set `maxTurns` and watch `cost.total_cost_usd`.

---

## 📌 Best Practices

1. **Minimal permissions** -- give the agent only the tools needed for the task
2. **maxTurns** -- always limit the number of agent iterations
3. **Cost tracking** -- monitor spend, especially in automated scenarios
4. **Hooks** -- use PreToolUse for auditing and blocking dangerous actions
5. **Structured outputs** -- for CI/CD, use JSON format to parse results
6. **Sessions** -- for multi-stage tasks, save the session_id
7. **Test your prompts** -- the agent's prompt is code just like the rest; keep it in version control

---

## 📌 Summary

- 🔥 The Agent SDK is programmatic access to a full-fledged Claude Code agent
- 📌 Agent SDK != Client SDK: the agent is autonomous, the client is an API for messages
- 💡 Built-in tools (Read, Edit, Bash...) + the ability to add your own
- ✅ Sessions let you continue work across calls
- ⚠️ Always limit permissions and monitor spend
- 🔥 Ideal for CI/CD: automatic code review, testing, deployment
