# Exercise 6. MCP Servers — Extended Guide

## What is MCP?

MCP (Model Context Protocol) is an open standard for connecting AI applications to external data sources and tools. Created by Anthropic in 2024, it quickly became the de facto standard for AI integrations.

**Analogy:** MCP is like USB-C for AI. Before USB-C, every device had its own connector. Now one cable works for everything.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  AI Model   │────▶│ MCP Client  │────▶│ MCP Server  │
│ (Claude)    │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                         ┌─────┴─────┐
                                         │  External │
                                         │   API/DB  │
                                         └───────────┘
```

### Components

1. **MCP Host** — Claude Code, IDE, or other application
2. **MCP Client** — protocol implementation on the client side
3. **MCP Server** — provides tools and resources
4. **Transport** — communication channel (stdio or HTTP)

## Three MCP Primitives

### 1. Tools

Actions that the model can invoke. Tools accept input and return output.

```typescript
server.tool(
  "search-users",
  { query: z.string().describe("Search query") },
  async ({ query }) => {
    const users = await db.users.findMany({
      where: { name: { contains: query } }
    });
    return {
      content: [{ type: "text", text: JSON.stringify(users, null, 2) }]
    };
  }
);
```

### 2. Resources

Data that the model can read. Resources are passive — the model cannot modify them.

```typescript
server.resource(
  "api-schema",
  "file://schema.json",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(schema),
    }],
  })
);
```

### 3. Prompts

Templates for common scenarios. Prompts help standardize interactions.

```typescript
server.prompt(
  "code-review",
  {
    file: z.string().describe("File path"),
    focus: z.enum(["security", "performance", "quality"]).optional()
  },
  ({ file, focus }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Review ${file}${focus ? ` with focus on ${focus}` : ""}`,
      },
    }],
  })
);
```

## Stdio vs HTTP Transport

### Stdio

- **Simplest** — no server, no ports
- **Local only** — works only on the same machine
- **One client** — one-to-one connection
- **Ideal for** — development, local tools

```json
{
  "mcpServers": {
    "local-tool": {
      "command": "node",
      "args": ["./server.js"]
    }
  }
}
```

### HTTP

- **Remote access** — server can be anywhere
- **Multi-client** — many simultaneous connections
- **Sessions** — stateful connections with session IDs
- **Ideal for** — shared tools, cloud services

```json
{
  "mcpServers": {
    "remote-tool": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

## Error Handling

```typescript
server.tool(
  "fetch-data",
  { url: z.string().url() },
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          content: [{ type: "text", text: `Error: ${response.status}` }],
          isError: true,
        };
      }
      const data = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed: ${error.message}` }],
        isError: true,
      };
    }
  }
);
```

## Security Best Practices

1. **Validate all input** — use Zod schemas for parameters
2. **Limit permissions** — give the server only necessary access
3. **Do not store secrets in code** — use environment variables
4. **Log all actions** — for audit and debugging
5. **Rate limiting** — prevent abuse

## Common Mistakes

1. **Unclear tool descriptions** — the model needs to understand when to use the tool
2. **No error handling** — the model will not know what to do with an error
3. **Too many tools** — each tool adds context, use only what is needed
4. **No parameter validation** — the model may pass invalid data
5. **Large responses** — truncate or paginate large results

## Debugging

```bash
# Test server manually
node server.js < request.json

# Check MCP logs
claude --verbose

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node server.js
```
