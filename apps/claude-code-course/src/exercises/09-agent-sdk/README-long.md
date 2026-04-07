# Уровень 9: Claude Agent SDK

## Введение

До этого уровня мы работали с Claude Code как пользователи: открывали терминал, писали промпты, получали результат. Это как водить машину вручную -- вы за рулём, принимаете каждое решение. Agent SDK -- это переход к автопилоту: вы задаёте маршрут из кода, а агент ведёт сам.

Agent SDK предоставляет **программный доступ** ко всем возможностям Claude Code: те же инструменты (Read, Edit, Bash, Grep...), тот же agent loop, тот же контекст проекта. Но теперь вы управляете этим из TypeScript или Python, встраивая агента в свои скрипты, пайплайны и приложения.

🔥 **Ключевая идея:** Agent SDK -- это не «ещё одна обёртка над API». Это полноценный автономный агент, который умеет планировать, использовать инструменты и итеративно решать задачи.

---

## Agent SDK vs Client SDK (Anthropic SDK)

Это **самая частая точка путаницы** у новичков. Давайте разберём на аналогии.

**Client SDK (Anthropic SDK)** -- это телефон. Вы звоните эксперту, задаёте вопрос, получаете ответ. Если нужно что-то сделать с ответом -- делаете сами. Если нужно задать уточняющий вопрос -- звоните снова.

**Agent SDK** -- это наёмный специалист. Вы даёте ему задачу, он сам изучает проект, открывает файлы, пишет код, запускает тесты, исправляет ошибки. Вы получаете готовый результат.

| Аспект | Client SDK | Agent SDK |
|--------|-----------|-----------|
| Импорт | `@anthropic-ai/sdk` | `@anthropic-ai/claude-agent-sdk` |
| Что вы пишете | Промпты + обработку ответов | Задачу + конфигурацию |
| Agent loop | Реализуете сами | Встроенный |
| Инструменты | Определяете и вызываете сами | Встроенные (Read, Edit, Bash...) |
| Контекст проекта | Передаёте вручную | CLAUDE.md, git, структура |
| Типичное применение | Чатботы, генерация текста | Автоматизация разработки |

---

## Установка

```bash
# TypeScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
```

---

## Базовый пример

### TypeScript

```typescript
import { query, ClaudeAgentOptions } from '@anthropic-ai/claude-agent-sdk'

const options: ClaudeAgentOptions = {
  allowedTools: ['Read', 'Edit', 'Bash', 'Glob', 'Grep'],
  maxTurns: 10
}

// Стриминг — получаем результаты по мере генерации
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

## Встроенные инструменты

Agent SDK предоставляет те же инструменты, что и Claude Code в терминале:

| Инструмент | Назначение | Пример |
|-----------|------------|--------|
| `Read` | Чтение файлов | Исходный код, конфиги |
| `Write` | Создание файлов | Новые модули |
| `Edit` | Редактирование файлов | Точечные изменения |
| `Bash` | Выполнение команд | `npm test`, `git status` |
| `Glob` | Поиск файлов по паттерну | `**/*.test.ts` |
| `Grep` | Поиск по содержимому | Поиск функций, паттернов |
| `WebSearch` | Поиск в интернете | Документация, примеры |
| `WebFetch` | Загрузка веб-страниц | API-документация |

---

## Custom Tools

Вы можете расширить возможности агента своими инструментами:

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
      // Ваша логика деплоя
      const result = await deployToStaging(service, version)
      return JSON.stringify({ status: result.status, url: result.url })
    }
  },
]
```

Агент сам решит, когда вызвать custom tool, основываясь на задаче. Вы можете добавить сколько угодно инструментов: деплой, уведомления в Slack, создание тикетов.

---

## Хуки из кода

Хуки позволяют перехватывать действия агента программно:

```typescript
const options: ClaudeAgentOptions = {
  allowedTools: ['Read', 'Edit', 'Bash'],
  hooks: {
    preToolUse: async (tool, input) => {
      // Логирование каждого вызова инструмента
      await auditLog.write({
        tool: tool.name,
        input: JSON.stringify(input),
        timestamp: new Date()
      })
      // Блокировка опасных команд
      if (tool.name === 'Bash' && input.command.includes('rm -rf')) {
        return { decision: 'block', reason: 'Destructive command blocked' }
      }
      return { decision: 'allow' }
    },
    postToolUse: async (tool, input, output) => {
      // Проверка результатов после редактирования
      if (tool.name === 'Edit') {
        await runLinter(input.file_path)
      }
    }
  }
}
```

---

## Сессии (Resume)

Сессии позволяют продолжить работу агента между вызовами:

```typescript
// Первый вызов — начинаем ревью
let sessionId: string

for await (const msg of query({
  prompt: 'Review this codebase for performance issues'
})) {
  if (msg.type === 'session') {
    sessionId = msg.session_id // Сохраняем ID сессии
  }
}

// Второй вызов — продолжаем в том же контексте
for await (const msg of query({
  prompt: 'Now focus on the database queries',
  sessionId // Передаём сохранённый ID
})) {
  console.log(msg)
}
```

Это полезно для:
- Многоэтапных задач (ревью -> исправление -> проверка)
- Long-running процессов с паузами
- Интерактивных сценариев с участием человека

---

## Structured Outputs

Получение результатов в структурированном формате:

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

Мониторинг расходов критичен для production:

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

## Интеграция в CI/CD

Agent SDK идеально подходит для автоматизации в пайплайнах:

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

Agent SDK работает на разных платформах: self-hosted сервер (полный контроль), Amazon Bedrock (интеграция с AWS), Google Vertex AI (интеграция с GCP). Выбор зависит от требований к безопасности и существующей инфраструктуры.

---

## ⚠️ Частые ошибки новичков

### 🐛 1. Использование Client SDK вместо Agent SDK

```typescript
// ❌ Client SDK — вы сами реализуете всю логику
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()
const response = await client.messages.create({
  model: 'claude-opus-4-6',
  messages: [{ role: 'user', content: 'Fix the bug in auth.ts' }]
})
// Claude даст текстовый совет, но не откроет файл и не исправит код
```

> **Почему это ошибка:** Client SDK -- это API для обмена сообщениями. Агент не сможет прочитать ваш файл, отредактировать его или запустить тесты. Вам придётся реализовать всё это самостоятельно.

```typescript
// ✅ Agent SDK — агент сам найдёт файл, прочитает, исправит и проверит
import { query } from '@anthropic-ai/claude-agent-sdk'
for await (const msg of query({
  prompt: 'Fix the bug in auth.ts',
  options: { allowedTools: ['Read', 'Edit', 'Bash'] }
})) {
  console.log(msg)
}
```

### 🐛 2. Слишком широкие разрешения

```typescript
// ❌ Агент может выполнить любую bash-команду
const options = {
  allowedTools: ['Bash']  // rm -rf / ? curl | sh ?
}
```

> **Почему это ошибка:** в CI/CD или production среде агент с неограниченным Bash может нанести серьёзный ущерб. Всегда используйте принцип минимальных привилегий.

```typescript
// ✅ Только необходимые инструменты
const options = {
  allowedTools: ['Read', 'Grep', 'Glob']  // Только чтение
}

// ✅ Или Bash с хуками для фильтрации (см. раздел «Хуки из кода»)
```

### 🐛 3. Игнорирование cost tracking

> **Почему это ошибка:** без мониторинга затрат агент в CI может за ночь израсходовать сотни долларов, особенно если зациклится на неразрешимой задаче. Всегда устанавливайте `maxTurns` и следите за `cost.total_cost_usd`.

---

## 📌 Best Practices

1. **Минимальные разрешения** -- давайте агенту только те инструменты, которые нужны для задачи
2. **maxTurns** -- всегда ограничивайте количество итераций агента
3. **Cost tracking** -- мониторьте расходы, особенно в автоматизированных сценариях
4. **Хуки** -- используйте PreToolUse для аудита и блокировки опасных действий
5. **Structured outputs** -- для CI/CD используйте JSON-формат для парсинга результатов
6. **Сессии** -- для многоэтапных задач сохраняйте session_id
7. **Тестируйте промпты** -- промпт для агента такой же код, как и остальной; держите его в VCS

---

## 📌 Итоги

- 🔥 Agent SDK -- программный доступ к полноценному агенту Claude Code
- 📌 Agent SDK != Client SDK: агент автономен, клиент -- это API для сообщений
- 💡 Встроенные инструменты (Read, Edit, Bash...) + возможность добавить свои
- ✅ Сессии позволяют продолжить работу между вызовами
- ⚠️ Всегда ограничивайте разрешения и мониторьте расходы
- 🔥 Идеально для CI/CD: автоматический code review, тестирование, деплой
