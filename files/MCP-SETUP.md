# MCP Server Configuration for EduManage

Place this in: `~/.gemini/antigravity/mcp_config.json`

```json
{
  "mcpServers": {
    "prisma": {
      "command": "npx",
      "args": ["prisma-mcp"],
      "cwd": "/path/to/your/edumanage-project"
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "github": {
      "serverUrl": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

## Why Each Server

| Server | Purpose |
|---|---|
| **Prisma** | Agent reads your live schema — never guesses column names, types, or relations |
| **Sequential Thinking** | For complex multi-step tasks: designing new modules, debugging cross-layer bugs, financial feature planning |
| **GitHub** | Read existing issues, create PRs, reference commit history when debugging regressions |

## Optional (install from MCP Store)

| Server | When to add |
|---|---|
| **Supabase** | When you migrate from SQLite to Supabase PostgreSQL for production |
| **Resend** | When completing the email/communication module |
| **Notion** | If you keep product specs or roadmap in Notion |

## Agent Permissions (add to Agent Settings)

### Allow (no prompt)
```
command(npx prisma)
command(npm run)
command(npm run dev)
command(git status)
command(git diff)
read_file(/path/to/your/project)
write_file(/path/to/your/project/src)
write_file(/path/to/your/project/prisma)
mcp(prisma/*)
mcp(sequential-thinking/*)
```

### Ask (confirm before running)
```
command(git push)
command(git commit)
command(npx prisma migrate)
command(npm install)
mcp(github/*)
```

### Deny (always blocked)
```
command(rm -rf)
command(npx prisma migrate reset)
write_file(/path/to/your/project/.env)
```
