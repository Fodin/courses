# Exercise 9. Agent SDK

## Goal

Learn to use the Anthropic Agent SDK to build custom automation tools and CI/CD integrations.

## Theory

### What is Agent SDK

Agent SDK is a programmatic interface to Claude Code. It allows you to run Claude Code as a library from your own code, enabling custom automation, CI/CD pipelines, and integration with other tools.

```
Your Code ──▶ Agent SDK ──▶ Claude Code Engine ──▶ Results
```

### Client SDK vs Agent SDK

| Feature | Client SDK | Agent SDK |
|---|---|---|
| Purpose | Chatbots, text generation | Code automation, CI/CD |
| Model | Claude API | Claude Code with tools |
| Tools | No built-in tools | Read, Edit, Bash, Grep, etc. |
| Agent loop | No | Yes |
| File access | No | Yes |
| Use case | Conversational AI | Automated development |

**Analogy:**
- **Client SDK** — calling a consultant for advice
- **Agent SDK** — hiring a specialist who studies your project, writes code, and tests it

### Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Basic Usage

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const response = await query({
  prompt: "Fix all TypeScript errors in src/",
  model: "claude-sonnet-4-20250514",
  maxTurns: 10,
});

for await (const chunk of response) {
  console.log(chunk);
}
```

### Parameters

| Parameter | Description |
|---|---|
| `prompt` | Task for the agent |
| `model` | Model to use |
| `maxTurns` | Maximum agent loop iterations |
| `allowedTools` | List of tools the agent can use |
| `disallowedTools` | List of tools the agent cannot use |
| `workspace` | Working directory |
| `sessionKey` | Session ID for resuming |

### Session Management

```typescript
// Start a session
const response = await query({
  prompt: "Analyze the codebase",
  maxTurns: 5,
});

let sessionId: string | undefined;
for await (const chunk of response) {
  if (chunk.type === "session_update") {
    sessionId = chunk.sessionId;
  }
}

// Resume the session
const resumed = await query({
  prompt: "Now fix the issues you found",
  sessionKey: sessionId,
  maxTurns: 10,
});
```

### Tool Control

```typescript
// Allow only specific tools
const response = await query({
  prompt: "Review the code",
  allowedTools: ["Read", "Grep", "Glob"],
  maxTurns: 5,
});

// Block dangerous tools
const response = await query({
  prompt: "Analyze the project",
  disallowedTools: ["Bash"],
  maxTurns: 5,
});
```

### Hooks in Agent SDK

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const response = await query({
  prompt: "Fix all TypeScript errors",
  hooks: {
    PreToolUse: async (hookInput) => {
      // Block dangerous commands
      if (hookInput.tool.input.includes("rm -rf")) {
        return { decision: "block", errorMessage: "Dangerous command" };
      }
      return { decision: "allow" };
    },
    PostToolUse: async (hookInput) => {
      // Log tool results
      console.log(`Tool ${hookInput.tool.name} completed`);
      return hookInput.result;
    },
  },
});
```

### Structured Output

```typescript
const response = await query({
  prompt: "Find all security issues in the codebase. Return as JSON.",
  outputFormat: "json",
  maxTurns: 10,
});
```

### Cost Tracking

```typescript
const response = await query({
  prompt: "Refactor src/utils/",
});

let totalCost = 0;
for await (const chunk of response) {
  if (chunk.type === "cost") {
    totalCost += chunk.cost;
  }
}
console.log(`Total cost: $${totalCost.toFixed(4)}`);
```

### Deployment Options

- **Self-hosted** — run on your own server
- **Amazon Bedrock** — AWS integration
- **Google Vertex AI** — GCP integration
- **Direct** — direct API access

## Task

1. **Create a CI/CD script** using Agent SDK:
   - Run code review on pull requests
   - Check for security issues
   - Generate a report

2. **Implement tool restrictions** for safety:
   - Allow only read-only tools in CI
   - Block dangerous Bash commands

3. **Add cost tracking** to monitor spending

4. **Create a session-based workflow**:
   - First session: analyze the codebase
   - Second session: fix issues found in the first

## Verification Criteria

- [ ] Agent SDK is installed and configured
- [ ] CI/CD script works correctly
- [ ] Tool restrictions are enforced
- [ ] Cost tracking reports accurate numbers
- [ ] Session resumption works

## Additional Materials

- [Agent SDK Documentation](https://docs.anthropic.com/en/docs/claude-code/sdk)
- [Agent SDK Examples](https://github.com/anthropics/claude-code-examples)
