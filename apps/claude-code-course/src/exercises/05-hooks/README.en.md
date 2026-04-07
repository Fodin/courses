# Exercise 5. Hooks

## Goal

Learn to use Hooks in Claude Code — the mechanism for intercepting and modifying Claude's actions before and after execution.

## Theory

### What are Hooks

Hooks are event handlers that allow you to intercept Claude's actions and modify them before execution or react to results after execution.

**Analogy:** Hooks in Claude Code are like middleware in Express.js. The request passes through the middleware chain, where each one can modify, block, or log it.

```
User prompt → [PreToolUse hook] → Tool execution → [PostToolUse hook] → Response
```

### Two Types of Hooks

#### PreToolUse

Triggered **before** a tool is used. Can block the action.

```javascript
// claude-code-hooks.js
export async function preToolUse(hookInput) {
  const { tool } = hookInput;

  // Block dangerous commands
  if (tool.name === 'Bash') {
    const dangerousPatterns = ['rm -rf', 'drop database', 'curl | sh'];
    for (const pattern of dangerousPatterns) {
      if (tool.input.includes(pattern)) {
        return {
          decision: 'block',
          errorMessage: `Command blocked for security reasons: ${pattern}`,
        };
      }
    }
  }

  return { decision: 'allow' };
}
```

#### PostToolUse

Triggered **after** a tool is used. Can modify context or add to the result.

```javascript
export async function postToolUse(hookInput) {
  const { tool, result } = hookInput;

  if (tool.name === 'Bash' && result.exitCode !== 0) {
    // Add instructions for debugging failed commands
    return {
      ...result,
      content: result.content + '\nNOTE: Command failed. Check the error above.',
    };
  }

  return result;
}
```

### Hook Configuration

Hooks are specified when launching Claude Code:

```bash
claude --hooks claude-code-hooks.js
```

Or in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": "./claude-code-hooks.js",
    "PostToolUse": "./claude-code-hooks.js"
  }
}
```

### HookInput and HookResult

**PreToolUse:**

```typescript
interface HookInput {
  tool: {
    name: string;
    input: string;
  };
}

interface HookResult {
  decision: 'allow' | 'block';
  errorMessage?: string; // required when blocking
}
```

**PostToolUse:**

```typescript
interface HookInput {
  tool: {
    name: string;
    input: string;
  };
  result: {
    exitCode: number;
    content: string;
  };
}
```

## Task

1. **Create a PreToolUse hook** that blocks dangerous Bash commands:
   - `rm -rf /` or `rm -rf /*`
   - `curl ... | sh` or `wget ... | sh`
   - `DROP DATABASE`, `DROP TABLE`
   - `sudo` commands
   - Commands redirecting to `/dev/sda` or other devices

2. **Create a PostToolUse hook** that adds context to failed test results:
   - If tests fail, add a link to the test documentation
   - If linting fails, add a link to ESLint rules

3. **Test the hooks:**
   - Ask Claude to run a dangerous command — make sure it is blocked
   - Intentionally break a test and run it — check that additional information is added

## Verification Criteria

- [ ] PreToolUse hook blocks dangerous commands
- [ ] PostToolUse hook adds context to errors
- [ ] Hooks do not interfere with normal Claude Code operation
- [ ] Hook code is in a separate file (`claude-code-hooks.js`)
- [ ] Hook tests are documented

## Additional Materials

- [Claude Code Hooks Documentation](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Hooks Examples on GitHub](https://github.com/anthropics/claude-code-hooks)
