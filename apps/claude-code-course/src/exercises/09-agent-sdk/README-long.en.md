# Exercise 9. Agent SDK — Extended Guide

## What is Agent SDK?

The Anthropic Agent SDK is a programmatic interface to Claude Code. It allows you to run Claude Code as a library from your own code, enabling:

- **CI/CD automation** — code review, security checks, testing
- **Custom tooling** — build tools on top of Claude Code
- **Integration** — connect with Jira, Slack, GitHub, etc.
- **Batch processing** — analyze multiple files or repos

## Client SDK vs Agent SDK

### Client SDK (Anthropic SDK)

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
```

**What it can do:**
- Send messages to Claude
- Receive text responses
- Use tool calling (define custom tools)

**What it cannot do:**
- Read files on disk
- Edit files
- Run terminal commands
- Access the filesystem

### Agent SDK

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const response = await query({
  prompt: "Fix all TypeScript errors in src/",
});

for await (const chunk of response) {
  console.log(chunk);
}
```

**What it can do:**
- Everything Client SDK can do, PLUS:
- Read and edit files
- Run terminal commands
- Search codebase (Grep, Glob)
- Full Claude Code tool set
- Agent loop (think → tool → evaluate → repeat)

### Analogy

| Client SDK | Agent SDK |
|---|---|
| Calling a consultant for advice | Hiring a specialist |
| Consultant answers questions | Specialist studies your project |
| You implement the advice | Specialist writes code and tests it |
| One conversation | Autonomous work cycle |

## Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

```bash
pip install anthropic[agent-sdk]
```

## Basic Usage

### Simple Query

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

async function fixErrors() {
  const response = await query({
    prompt: "Fix all TypeScript errors in src/",
    model: "claude-sonnet-4-20250514",
    maxTurns: 10,
  });

  for await (const chunk of response) {
    if (chunk.type === "assistant") {
      console.log(chunk.content);
    }
  }
}

fixErrors();
```

### Streaming Response

```typescript
const response = await query({
  prompt: "Analyze the codebase architecture",
});

for await (const chunk of response) {
  switch (chunk.type) {
    case "assistant":
      console.log("Assistant:", chunk.content);
      break;
    case "result":
      console.log("Final result:", chunk.content);
      break;
    case "error":
      console.error("Error:", chunk.error);
      break;
  }
}
```

## Parameters Reference

| Parameter | Type | Description |
|---|---|---|
| `prompt` | string | Task description for the agent |
| `model` | string | Model identifier |
| `maxTurns` | number | Maximum iterations in the agent loop |
| `allowedTools` | string[] | Whitelist of tools |
| `disallowedTools` | string[] | Blacklist of tools |
| `workspace` | string | Working directory path |
| `sessionKey` | string | Session ID for resuming |
| `outputFormat` | string | Output format (text, json) |
| `hooks` | object | PreToolUse and PostToolUse hooks |

## Session Management

Sessions allow you to continue a previous conversation with the agent:

```typescript
// First session
const response1 = await query({
  prompt: "Analyze the codebase and list issues",
  maxTurns: 5,
});

let sessionId: string | undefined;
for await (const chunk of response1) {
  if (chunk.type === "session_update") {
    sessionId = chunk.sessionId;
  }
}

// Save sessionId to database or file

// Later... resume the session
const response2 = await query({
  prompt: "Now fix the critical issues you found",
  sessionKey: sessionId,
  maxTurns: 10,
});
```

## Tool Control

### Whitelist (Recommended for CI/CD)

```typescript
const response = await query({
  prompt: "Review the code for security issues",
  allowedTools: ["Read", "Grep", "Glob"],
  maxTurns: 5,
});
```

### Blacklist

```typescript
const response = await query({
  prompt: "Analyze the project structure",
  disallowedTools: ["Bash", "Edit"],
  maxTurns: 5,
});
```

### Built-in Tools

| Tool | Description |
|---|---|
| Read | Read file contents |
| Edit | Edit files |
| Bash | Run shell commands |
| Grep | Search file contents |
| Glob | Find files by pattern |
| WebFetch | Fetch web content |
| WebSearch | Search the internet |

## Hooks

Hooks work the same way as in Claude Code CLI:

```typescript
const response = await query({
  prompt: "Fix all TypeScript errors",
  hooks: {
    PreToolUse: async (hookInput) => {
      const { tool } = hookInput;

      // Block dangerous commands
      if (tool.name === "Bash") {
        const dangerousPatterns = ["rm -rf", "drop", "curl | sh"];
        for (const pattern of dangerousPatterns) {
          if (tool.input.includes(pattern)) {
            return {
              decision: "block",
              errorMessage: `Blocked: ${pattern}`,
            };
          }
        }
      }

      return { decision: "allow" };
    },
    PostToolUse: async (hookInput) => {
      const { tool, result } = hookInput;

      // Log all actions
      console.log(`[${tool.name}] ${tool.input}`);

      return result;
    },
  },
});
```

## Structured Output

```typescript
const response = await query({
  prompt: "Find all security issues. Return as JSON array.",
  outputFormat: "json",
  maxTurns: 10,
});

for await (const chunk of response) {
  if (chunk.type === "result") {
    const issues = JSON.parse(chunk.content);
    for (const issue of issues) {
      console.log(`Issue: ${issue.file}:${issue.line} — ${issue.description}`);
    }
  }
}
```

## Cost Tracking

```typescript
const response = await query({
  prompt: "Refactor src/utils/",
});

let totalCost = 0;
let inputTokens = 0;
let outputTokens = 0;

for await (const chunk of response) {
  if (chunk.type === "cost") {
    totalCost += chunk.cost;
    inputTokens += chunk.inputTokens;
    outputTokens += chunk.outputTokens;
  }
}

console.log(`Total cost: $${totalCost.toFixed(4)}`);
console.log(`Input tokens: ${inputTokens}`);
console.log(`Output tokens: ${outputTokens}`);
```

## CI/CD Example

```typescript
// ci-review.ts
import { query } from "@anthropic-ai/claude-agent-sdk";

async function runCodeReview(prUrl: string) {
  // Get changed files
  const changedFiles = await getChangedFiles(prUrl);

  const response = await query({
    prompt: `Review these files for security and quality issues:\n${changedFiles.join("\n")}`,
    allowedTools: ["Read", "Grep", "Glob"],
    disallowedTools: ["Bash", "Edit"],
    maxTurns: 10,
    outputFormat: "json",
    hooks: {
      PreToolUse: async (hookInput) => {
        if (hookInput.tool.name === "Bash") {
          return {
            decision: "block",
            errorMessage: "Bash is not allowed in CI review",
          };
        }
        return { decision: "allow" };
      },
    },
  });

  // Collect and post results
  let review = "";
  for await (const chunk of response) {
    if (chunk.type === "result") {
      review = chunk.content;
    }
  }

  await postComment(prUrl, review);
}

runCodeReview(process.argv[2]);
```

## Deployment Options

### Self-hosted

- Full control over infrastructure
- Data stays on your servers
- Requires own API keys

### Amazon Bedrock

- AWS integration
- Billing through AWS
- Managed infrastructure

### Google Vertex AI

- GCP integration
- Billing through GCP
- Managed infrastructure

### Direct API

- Direct access to Anthropic API
- Most flexible option
- Pay per use

## Best Practices

### 1. Limit Tools for Safety

```typescript
// CI review — read-only tools only
allowedTools: ["Read", "Grep", "Glob"]

// Automated fix — allow edits but block dangerous commands
allowedTools: ["Read", "Edit", "Grep"]
disallowedTools: ["Bash"]
```

### 2. Set Reasonable maxTurns

```typescript
// Quick review
maxTurns: 5

// Deep analysis
maxTurns: 15

// Refactoring
maxTurns: 20
```

### 3. Track Costs

```typescript
// Log costs for every run
let totalCost = 0;
for await (const chunk of response) {
  if (chunk.type === "cost") {
    totalCost += chunk.cost;
  }
}
// Alert if cost exceeds threshold
if (totalCost > MAX_COST) {
  console.error(`Cost exceeded: $${totalCost}`);
}
```

### 4. Use Sessions for Multi-step Workflows

```typescript
// Step 1: Analyze
const analysis = await query({ prompt: "Analyze...", maxTurns: 5 });

// Step 2: Plan
const plan = await query({ prompt: "Plan fixes...", maxTurns: 3 });

// Step 3: Execute
const execution = await query({ prompt: "Execute the plan...", maxTurns: 15 });
```

## Common Mistakes

1. **No tool restrictions in CI** — agent can run destructive commands
2. **No maxTurns** — agent can loop indefinitely
3. **No cost tracking** — unexpected bills
4. **Not using sessions** — losing context between steps
5. **Ignoring structured output** — hard to parse results
