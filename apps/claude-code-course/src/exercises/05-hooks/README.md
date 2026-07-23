# Уровень 5: Хуки -- детерминированная автоматизация

## 🎯 Проблема: рекомендация vs гарантия

CLAUDE.md -- это инструкция для агента. Но агент может забыть, неправильно интерпретировать или проигнорировать её в сложном контексте. Хук -- это **код, который выполняется автоматически** при определённых событиях. Разница как между табличкой "Мойте руки" и автоматическим дозатором мыла при входе в операционную.

```
CLAUDE.md: "Пожалуйста, форматируй код после редактирования"  -- рекомендация
Хук PostToolUse(Edit): prettier --write $file               -- гарантия
```

---

## 🔥 Конфигурация хуков

Хуки настраиваются в `settings.json` (`.claude/settings.json` для проекта или `~/.claude/settings.json` глобально):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/validate.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

---

## 🔥 Пять типов хуков

| Тип | Что делает | Когда использовать |
|---|---|---|
| **command** | Запускает shell-команду | Форматирование, валидация, нотификации |
| **http** | Отправляет HTTP-запрос | Внешние вебхуки, аудит |
| **mcp_tool** | Вызывает инструмент на подключённом MCP-сервере | Интеграция с внешней системой без обёртки-скрипта |
| **prompt** | Отправляет промпт LLM для анализа | Глубокий анализ безопасности |
| **agent** | Запускает субагента | Сложная многошаговая проверка |

`command` покрывает подавляющее большинство задач. `mcp_tool` полезен, когда нужное действие уже есть как инструмент MCP-сервера -- писать shell-обёртку не нужно. `agent` помечен как экспериментальный и может измениться.

---

## 🔥 События жизненного цикла

```mermaid
flowchart LR
    A["SessionStart"] --> B["UserPromptSubmit"]
    B --> C["PreToolUse"]
    C --> D["Инструмент"]
    D --> E["PostToolUse"]
    E --> F["Stop"]
    F --> G["SessionEnd"]
```

**Основные события:**

| Событие | Когда срабатывает |
|---|---|
| `PreToolUse` | Перед вызовом инструмента (Edit, Bash, Write...) |
| `PostToolUse` | После **успешного** выполнения инструмента |
| `PostToolUseFailure` | После **неудачного** вызова инструмента |
| `UserPromptSubmit` | Пользователь отправил сообщение |
| `Stop` | Claude закончил ответ |
| `SubagentStart` / `SubagentStop` | Жизненный цикл субагента |
| `SessionStart` / `SessionEnd` | Начало и конец сессии |

Это те события, с которых начинают, но всего их больше тридцати. Полезно знать, что существуют ещё как минимум:

| Событие | Когда срабатывает |
|---|---|
| `PermissionRequest` / `PermissionDenied` | Появился запрос разрешения / вызов отклонён |
| `PreCompact` / `PostCompact` | До и после сжатия контекста |
| `InstructionsLoaded` | Загружен CLAUDE.md или файл `.claude/rules/` |
| `FileChanged` | Отслеживаемый файл изменился на диске |
| `CwdChanged` | Сменилась рабочая директория (например, агент сделал `cd`) |
| `TaskCreated` / `TaskCompleted` | Задача создана / помечена выполненной |
| `WorktreeCreate` / `WorktreeRemove` | Создание и удаление worktree |

Смысл в том, что хуками покрывается почти весь жизненный цикл, а не только вызовы инструментов. Полный список смотрите в документации -- он пополняется.

---

## 🔥 Matchers и фильтрация

Matcher -- это regex, который определяет, **для какого инструмента** срабатывает хук:

```json
{
  "matcher": "Edit|Write",
  "hooks": [{ "type": "command", "command": "prettier --write $FILE" }]
}
```

```json
{
  "matcher": "Bash",
  "hooks": [{ "type": "command", "command": "bash .claude/hooks/audit-bash.sh" }]
}
```

### Поле `if` -- фильтр до запуска процесса

`matcher` отбирает по имени инструмента, но часто нужно точнее: не «любой Bash», а «только `git push`». Для этого есть поле `if` с синтаксисом правил разрешений:

```json
{
  "matcher": "Bash",
  "if": "Bash(git push*)",
  "hooks": [{ "type": "command", "command": "bash .claude/hooks/guard-push.sh" }]
}
```

Разница с фильтрацией внутри скрипта принципиальная: если `if` не совпал, процесс **вообще не запускается**. При хуке на каждый Bash-вызов это заметная экономия.

⚠️ `if` вычисляется только на событиях, связанных с инструментами (`PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`). На остальных событиях хук с заданным `if` не сработает никогда.

Когда фильтра `if` не хватает, разбирайте входные данные внутри скрипта -- они приходят как JSON на stdin:

```bash
#!/bin/bash
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command')

# Блокируем опасные git-команды
if [[ "$command" =~ git\ (push|reset|rebase) ]]; then
  echo '{"hookSpecificOutput":{"permissionDecision":"deny"}}'
  exit 0
fi
exit 0  # Разрешаем остальное
```

---

## 🔥 Exit codes и управление потоком

| Exit code | Значение |
|---|---|
| `0` | Разрешить (allow) -- инструмент выполняется |
| `2` | Заблокировать (deny) -- инструмент НЕ выполняется |

Хук может также вернуть JSON с `additionalContext` -- это инъекция контекста прямо в Claude:

```bash
echo '{"additionalContext": "Внимание: этот файл содержит конфиденциальные данные. Не логируй содержимое."}'
exit 0
```

---

## 📌 Практические паттерны

**Автоформатирование после редактирования:**
```json
{ "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "prettier --write $FILE" }] }
```

**Защита критических файлов:**
```json
{ "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "bash .claude/hooks/protect-files.sh" }] }
```

**Перезагрузка окружения при смене директории:**
```json
{ "matcher": "CwdChanged", "hooks": [{ "type": "command", "command": "bash .claude/hooks/reload-env.sh" }] }
```

---

## ⚠️ Частые ошибки новичков

### 🐛 Хук без timeout

```json
❌  { "type": "command", "command": "npm test" }
✅  { "type": "command", "command": "npm test", "timeout": 60 }
```

Без timeout зависший процесс заблокирует всю сессию.

### 🐛 Забыли exit code

```bash
# ❌ Скрипт не возвращает код -- поведение непредсказуемо
echo "checked"

# ✅ Явный exit code
echo "checked"
exit 0
```

### 🐛 Хук на всё подряд

```json
❌  { "matcher": ".*", "hooks": [{ "type": "command", "command": "heavy-check.sh" }] }
```

Хук на каждый инструмент замедлит работу. Используйте точные matchers.
