# Level 6: MCP Servers -- External Integrations

## Introduction

Imagine you have a universal TV remote. It can turn things on/off and switch channels. But what if you want to control the air conditioner, the speakers, and the blinds from it too? You need a **protocol** that all devices understand. The remote's IR port is the protocol, and each device is a "server" that accepts commands through that protocol.

Model Context Protocol (MCP) is exactly that kind of standard for Claude Code. Out of the box, the agent works with files and the terminal. MCP lets you connect **any external tool** -- GitHub, a database, Jira, Figma -- through a single protocol. Claude Code "presses buttons on the remote," and the MCP server performs the actions in a specific service.

In this level we'll cover:
1. MCP architecture and the four transports
2. Server configuration and scopes
3. Authentication and security
4. Popular MCP servers and their capabilities
5. Managed MCP for organizations
6. The basics of building your own MCP server

---

## 1. MCP Architecture

### How It Works

```mermaid
flowchart LR
    User["User"] --> CC["Claude Code"]
    CC -->|"MCP Protocol"| S1["GitHub Server"]
    CC -->|"MCP Protocol"| S2["DB Server"]
    CC -->|"MCP Protocol"| S3["Slack Server"]
    S1 --> GH["GitHub API"]
    S2 --> PG["PostgreSQL"]
    S3 --> SL["Slack API"]
```

MCP works on a **client-server** model:

- **Client** -- Claude Code. Sends requests to MCP servers.
- **Server** -- a separate process (or a remote service) that provides **tools**. Each tool is a function Claude can call.

When you connect the GitHub MCP server, Claude gets a set of new tools: `create_pull_request`, `list_issues`, `merge_branch`, and so on. Claude itself decides when to call which tool, based on your request.

### What an MCP Server Provides

An MCP server can provide three types of resources:

| Type | Description | Example |
|---|---|---|
| **Tools** | Functions Claude can call | `create_issue`, `run_query` |
| **Resources** | Data Claude can read | DB schema, documentation |
| **Prompts** | Prompt templates | "Generate SQL for..." |

In most cases you work with **Tools** -- that's the main integration point.

---

## 2. Four Transports

### stdio -- a Local Process

Claude Code launches the MCP server as a **child process** and communicates with it via stdin/stdout:

```
Claude Code ← stdin/stdout → node server.js
```

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "$GITHUB_TOKEN" }
    }
  }
}
```

This is the simplest and most common transport. The server runs on your machine, and data doesn't go over the network (except for calls to the target API).

### HTTP -- a Remote Server

Claude Code sends HTTP requests to a remote URL:

```json
{
  "mcpServers": {
    "corporate-tools": {
      "type": "http",
      "url": "https://mcp.company.com/tools"
    }
  }
}
```

Used for corporate installations where the MCP server is deployed centrally. Nothing needs to be installed locally.

### WebSocket -- a Persistent Connection

```json
{
  "mcpServers": {
    "events": {
      "type": "ws",
      "url": "wss://mcp.company.com/socket"
    }
  }
}
```

WebSocket keeps a persistent bidirectional connection. It's needed when the server must **itself** send events without waiting for a request -- notifications, a stream of changes, external triggers.

If the server only responds to requests, use HTTP instead: it supports OAuth and is added with the `claude mcp add --transport` flag, while WebSocket supports neither.

### SSE -- a Deprecated Transport

⚠️ **SSE (Server-Sent Events) is marked as deprecated.** The documentation states directly: use HTTP servers instead of SSE wherever possible.

```json
{
  "mcpServers": {
    "legacy": {
      "type": "sse",
      "url": "https://mcp.company.com/stream"
    }
  }
}
```

The transport still works, and you'll encounter it in configs written earlier -- but you shouldn't choose it for new servers. The "long-running operations" need is covered by HTTP, and "the server pushes events" is covered by WebSocket.

### Comparing the Transports

| Property | stdio | HTTP | WebSocket | SSE |
|---|---|---|---|---|
| **Where it runs** | Locally | Remotely | Remotely | Remotely |
| **Installation** | npm/pip package | None | None | None |
| **Data** | Doesn't leave the network* | Over the internet | Over the internet | Over the internet |
| **OAuth** | -- | Yes | No | Yes |
| **Status** | Primary | Recommended remote | Niche | ⚠️ Deprecated |

*Except for calls to target APIs (GitHub, databases, etc.)

Another detail that trips people up: an entry with `url` but **without** `type` is a configuration error. Claude Code reads an entry without `type` as an stdio server and will report:

```
MCP server "<name>" has a "url" but no "type";
add "type": "http" (or "sse" / "ws") to this entry
```

---

## 3. Configuration

### The .mcp.json File

MCP servers are configured in the `.mcp.json` file:

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN"
      }
    },
    "database": {
      "type": "stdio",
      "command": "python",
      "args": ["-m", "mcp_server_postgres"],
      "env": {
        "DATABASE_URL": "$DATABASE_URL"
      }
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### Configuration Scopes

| Scope | Location | Goes into git? |
|---|---|---|
| **project** | `.mcp.json` in the project root | Yes, that's the point |
| **user** | `~/.claude.json` | No |
| **local** | `~/.claude.json` (project-bound) | No |

**Project scope** (`.mcp.json` in the repository root) -- for servers specific to the project: the project's database, Figma for the design system. The file is committed, and the whole team gets the same set of tools. For security reasons, Claude Code asks for confirmation before spinning up servers from a cloned repository; you can reset these decisions with `claude mcp reset-project-choices`.

**User scope** -- for servers you need everywhere: GitHub, personal tools.

⚠️ It's easy to get the path wrong here. Claude Code **does not read** `~/.claude/.mcp.json`, `~/.claude/mcp.json`, or `~/.claude/config/mcp.json` -- these are nonexistent paths that people often invent by analogy. User-level servers live in **`~/.claude.json`** under the `mcpServers` key. You usually don't need to edit it by hand:

```bash
# add a server to the user scope
claude mcp add --scope user github npx @modelcontextprotocol/server-github

# see what's connected and from where
claude mcp list
```

If a server with the same name is defined at multiple levels, **the project configuration overrides the user configuration**.

### Environment Variables

Values with `$` are substituted from the system environment:

```json
{
  "env": {
    "GITHUB_TOKEN": "$GITHUB_TOKEN",
    "DB_HOST": "$DB_HOST",
    "API_KEY": "$MY_API_KEY"
  }
}
```

This lets you:
1. Avoid hardcoding secrets in the config
2. Let each developer use their own tokens
3. Safely commit `.mcp.json` to the repository

```bash
# Set the variables in .bashrc / .zshrc
export GITHUB_TOKEN="ghp_your_token_here"
export DATABASE_URL="postgres://user:pass@localhost:5432/mydb"
```

---

## 4. Authentication

### Environment Variables (stdio)

The simplest way -- pass the token via env:

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "$GITHUB_TOKEN" }
    }
  }
}
```

Suitable for most local servers. The token is stored in the user's environment variables, not in the config.

### OAuth (Hosted Servers)

For remote MCP servers, Claude Code supports an OAuth flow:

1. Claude Code opens an authorization page in the browser
2. The user grants access
3. Tokens are saved and refreshed automatically

This approach is used for corporate servers and SaaS integrations.

### Fixed Tokens

Passed via headers for HTTP/WebSocket/SSE servers:

```json
{
  "mcpServers": {
    "corporate": {
      "type": "http",
      "url": "https://mcp.company.com",
      "headers": {
        "Authorization": "Bearer $CORP_TOKEN"
      }
    }
  }
}
```

### 📌 Authentication Security

Rules you must not break:

```json
// ❌ A token in the config -- it will leak through git
{ "env": { "GITHUB_TOKEN": "ghp_abc123secret" } }

// ✅ A reference to an environment variable
{ "env": { "GITHUB_TOKEN": "$GITHUB_TOKEN" } }
```

```bash
# ❌ The variable isn't exported -- the MCP server won't see it
GITHUB_TOKEN=ghp_abc123

# ✅ export makes the variable visible to child processes
export GITHUB_TOKEN=ghp_abc123
```

---

## 5. Popular MCP Servers

### GitHub

```json
{
  "github": {
    "type": "stdio",
    "command": "npx",
    "args": ["@modelcontextprotocol/server-github"],
    "env": { "GITHUB_TOKEN": "$GITHUB_TOKEN" }
  }
}
```

Capabilities: creating PRs, reviews, managing issues, searching repositories, working with Actions.

### PostgreSQL / MySQL

```json
{
  "database": {
    "type": "stdio",
    "command": "python",
    "args": ["-m", "mcp_server_postgres"],
    "env": { "DATABASE_URL": "$DATABASE_URL" }
  }
}
```

Capabilities: running SQL queries, exploring the schema, analyzing data.

### Context7 -- Up-to-Date Documentation

```json
{
  "context7": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"]
  }
}
```

Capabilities: searching for up-to-date documentation for any library, getting code examples. Claude Code gains access to fresh documentation instead of relying on its training data.

### Figma

Capabilities: extracting design tokens, getting component properties, exporting assets.

### Slack

Capabilities: sending messages, reading channels, managing threads.

### Grafana

Capabilities: fetching metrics, analyzing dashboards, checking alerts.

---

## 6. Managed MCP for Organizations

In a corporate environment, you can't let every developer connect arbitrary MCP servers. Managed MCP solves this problem.

### Allowlist

Only approved servers can be connected:

```
Allowed: github, database, slack
Everything else: blocked
```

### Denylist

Specific servers are prohibited, everything else is allowed:

```
Prohibited: public-ai-server, untrusted-tool
Everything else: allowed
```

### Centralized Configuration

Administrators manage the lists through the Admin Console. This allows you to:
- Control which external services are available to agents
- Audit MCP server usage
- Quickly disable compromised servers

---

## 7. Building Your Own MCP Server (Overview)

If there's no ready-made MCP server for your service, you can build your own. Here's a minimal example in Node.js:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server({
  name: 'my-custom-server',
  version: '1.0.0'
}, {
  capabilities: { tools: {} }
})

// Define a tool
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'get_user',
    description: 'Get information about a user by ID',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' }
      },
      required: ['userId']
    }
  }]
}))

// Handle the tool call
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get_user') {
    const userId = request.params.arguments.userId
    // Logic for fetching the user
    return {
      content: [{ type: 'text', text: JSON.stringify({ id: userId, name: 'John' }) }]
    }
  }
})

// Run via stdio
const transport = new StdioServerTransport()
await server.connect(transport)
```

### Key Steps to Build One:

1. **Define the tools** -- what operations are needed
2. **Describe the schemas** -- input parameters for each tool
3. **Implement the handlers** -- what to do when each tool is called
4. **Wire up the transport** -- stdio for local, HTTP for remote
5. **Add it to .mcp.json** -- register the server

---

## ⚠️ Common Beginner Mistakes

### 🐛 1. A Token Right in the Config

```json
// ❌ The config gets committed to git -- the token is exposed to everyone
{ "env": { "GITHUB_TOKEN": "ghp_abc123secrettoken" } }

// ✅ Environment variable -- the token is stored locally
{ "env": { "GITHUB_TOKEN": "$GITHUB_TOKEN" } }
```

> **Why this is a problem:** `.mcp.json` is usually committed to the repository so the whole team uses the same configuration. A hardcoded token will leak on the very first push.

### 🐛 2. An Unexported Environment Variable

```bash
# ❌ The variable is only available in the current shell
GITHUB_TOKEN=ghp_abc123

# ✅ export makes it visible to child processes (MCP servers)
export GITHUB_TOKEN=ghp_abc123

# ✅ Or add it to .bashrc/.zshrc for persistence
echo 'export GITHUB_TOKEN=ghp_abc123' >> ~/.zshrc
```

> **Why this is a problem:** the MCP server runs as a child process. Without `export`, it won't see the variable and will get an empty value. The result: authentication errors that are hard to debug.

### 🐛 3. Forgot to Install the MCP Server's Dependencies

```bash
# ❌ The Python server isn't installed
# Error: No module named 'mcp_server_postgres'

# ✅ Install it before use
pip install mcp-server-postgres
```

> **Why this is a problem:** npx servers download their packages automatically, but Python and other servers need to be installed manually. It's easy to miss this mistake -- Claude Code will simply not see the expected tools.

### 🐛 4. Identical Server Names Across Different Scopes

```json
// ~/.claude.json (user scope)
{ "mcpServers": { "db": { "env": { "DATABASE_URL": "$PROD_DB" } } } }

// .mcp.json in the project root (project scope)
{ "mcpServers": { "db": { "env": { "DATABASE_URL": "$DEV_DB" } } } }
```

> **What happens:** the project configuration completely overrides the global one for the `db` server. This may be expected (dev instead of prod) or unexpected. Use different names if you need both: `db-prod`, `db-dev`.

### 🐛 5. Too Many MCP Servers at Once

```json
// ❌ 15 servers -- Claude sees 200+ tools and gets confused
{ "mcpServers": { "github": {}, "slack": {}, "jira": {}, "figma": {}, "notion": {}, ... } }

// ✅ Connect only what's needed for the current project
{ "mcpServers": { "github": {}, "database": {} } }
```

> **Why this is a problem:** every MCP server adds tools to Claude's context. Too many tools -- Claude spends more time choosing, may call the wrong tool, and spends context window space on descriptions.

---

## 📌 Summary

- ✅ MCP is a standard protocol for connecting external tools to an agent
- ✅ Four transports: stdio (local, primary), HTTP (recommended remote), WebSocket (server pushes events), SSE (deprecated)
- ✅ Configuration: `.mcp.json` in the project root (project) and `~/.claude.json` (user/local) -- the path `~/.claude/.mcp.json` does not exist
- ✅ Environment variables via `$VAR` -- never hardcode secrets
- ✅ Authentication: env vars (stdio), OAuth (hosted), fixed tokens (HTTP)
- ✅ Managed MCP for organizations: allowlist/denylist, centralized management
- ✅ You can build your own MCP server in any language
- ✅ Connect only the servers you need -- don't overload the context
