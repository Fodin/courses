# Exercise 6. MCP Servers

## Goal

Learn to create and use MCP (Model Context Protocol) servers to extend Claude Code capabilities with custom tools.

## Theory

### What is MCP

MCP (Model Context Protocol) is an open standard for connecting AI applications to external data sources and tools. Think of it as **USB-C for AI** — a universal connector that allows any model to work with any data source.

```
Claude Code ←→ MCP Client ←→ MCP Server ←→ External API/Tool
```

### Why MCP?

Without MCP, each integration requires custom code:

```
Claude → Custom integration → Service A
Claude → Custom integration → Service B
Claude → Custom integration → Service C
```

With MCP, one universal protocol:

```
Claude ←→ MCP Client ←→ MCP Server A (Service A)
                       ←→ MCP Server B (Service B)
                       ←→ MCP Server C (Service C)
```

### MCP Server Types

#### Stdio Server

Communication via standard input/output. Simplest option for local development.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0"
});

server.tool(
  "search-db",
  { query: z.string().describe("Search query") },
  async ({ query }) => {
    const results = await searchDatabase(query);
    return {
      content: [{ type: "text", text: JSON.stringify(results) }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

#### HTTP Server

Communication via HTTP. Suitable for remote servers and multi-user access.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = new McpServer({
  name: "my-remote-server",
  version: "1.0.0"
});

// ... register tools and resources ...

const app = express();
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});
```

### MCP in Claude Code

MCP servers are configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "API_KEY": "your-key"
      }
    }
  }
}
```

### Tool Registration

```typescript
server.tool(
  "tool-name",
  "Tool description for the model",
  {
    param1: z.string().describe("Parameter description"),
    param2: z.number().optional().describe("Optional parameter"),
  },
  async ({ param1, param2 }) => {
    // Tool logic
    return {
      content: [
        { type: "text", text: "Result text" },
        { type: "image", data: base64Image, mimeType: "image/png" },
      ],
    };
  }
);
```

### Resource Registration

```typescript
server.resource(
  "config",
  "file://config.json",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(config),
    }],
  })
);
```

### Prompt Registration

```typescript
server.prompt(
  "review",
  { code: z.string().describe("Code to review") },
  ({ code }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Review this code:\n\n${code}`,
      },
    }],
  })
);
```

## Task

1. **Create an MCP server** with at least 2 tools:
   - A tool that fetches data from an API (e.g., weather, currency rates)
   - A tool that works with files (e.g., search, analyze)

2. **Configure the server** in `.mcp.json` and connect to Claude Code

3. **Test the tools** through Claude Code — make sure the agent can use them

4. **Add a resource** that provides static context (e.g., documentation, configuration)

## Verification Criteria

- [ ] MCP server starts without errors
- [ ] Tools are visible in Claude Code
- [ ] Tools return correct results
- [ ] Tool parameters are properly validated
- [ ] Tool descriptions are clear and informative
- [ ] `.mcp.json` is correctly configured
- [ ] Error handling is implemented

## Additional Materials

- [MCP Specification](https://modelcontextprotocol.io/specification)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)
