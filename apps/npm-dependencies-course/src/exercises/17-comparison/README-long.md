# Уровень 17 (подробно): npm vs pnpm vs Yarn — полное сравнение

## Зачем сравнивать?

Выбор пакетного менеджера — архитектурное решение, которое влияет на:

- Воспроизводимость сборок
- Безопасность (phantom deps, audit)
- Производительность CI/CD
- Совместимость с инструментами
- Дисковое пространство на машинах разработчиков

Не существует «лучшего» менеджера — есть наиболее подходящий под сценарий.

---

## Скорость: детальное сравнение

### Фазы установки

У каждого менеджера три фазы: **Resolve → Fetch → Link**. Разница в том, как они выполняются:

```
npm:
  Resolve → Fetch package A → Link A → Fetch package B → Link B ...  (последовательно)

pnpm:
  Resolve ─────────────────────────────────────────────────┐
  Fetch   ──────────────────────────────────────────────┐  │
  Link    (hard links) ──────────────────────────────┐  │  │
                                                      └──┴──┘ (параллельно)

Yarn Classic:
  Resolve → Fetch (параллельно) → Link (плоский hoisting)

Yarn Berry PnP:
  Resolve → Fetch (zip-архивы) → Link (патч .pnp.cjs — быстрее всего)
```

### Бенчмарк (медианные значения, чистая установка без кэша)

| Сценарий             | npm  | pnpm | Yarn Classic | Yarn Berry PnP |
| -------------------- | ---- | ---- | ------------ | -------------- |
| Чистая (no cache)    | 100% | ~70% | ~80%         | ~65%           |
| С кэшем              | ~50% | ~20% | ~35%         | ~15%           |
| CI (frozen lockfile) | 100% | ~60% | ~75%         | ~10%\*         |

\*Yarn Berry PnP с zero-installs: фаза fetch полностью отсутствует.

---

## Использование диска: механизмы

### npm и Yarn Classic — копирование файлов

```
Проект A: node_modules/react@18.2.0/  ← полная копия
Проект B: node_modules/react@18.2.0/  ← полная копия
Проект C: node_modules/react@18.2.0/  ← полная копия
```

10 проектов с React 18 = 10 × 100 KB = 1 MB только React.

### pnpm — hard links

```
~/.pnpm-store/react@18.2.0/  ← один экземпляр (100 KB)
Проект A: node_modules/react/ → hard link → store
Проект B: node_modules/react/ → hard link → store
Проект C: node_modules/react/ → hard link → store
```

10 проектов с React 18 = 100 KB.

### Yarn Berry PnP — zip-архивы

```
~/.yarn/berry/cache/ (глобальный) или .yarn/cache/ (локальный):
  react-npm-18.2.0-abcdef.zip  ← один архив (~40 KB сжатый)
```

Zip обеспечивает дополнительное сжатие по сравнению с распакованными файлами.

---

## Структура node_modules: визуальное сравнение

### npm / Yarn Classic (плоский)

```
node_modules/
  express/          ← прямая зависимость
  debug/            ← транзитивная (поднята hoisting)
  accepts/          ← транзитивная (поднята hoisting)
  mime-types/       ← транзитивная (поднята hoisting)
  body-parser/      ← транзитивная (поднята hoisting)
  ... (сотни пакетов в корне)
```

Проблема: `require('debug')` работает даже без объявления в package.json.

### pnpm (симлинки)

```
node_modules/
  .pnpm/
    express@4.18.2/node_modules/
      express/     ← hard link → store
      debug/       ← hard link → store
  express/         ← симлинк → .pnpm/express@4.18.2/...
```

`require('debug')` из вашего кода → MODULE_NOT_FOUND.

### Yarn Berry PnP

```
(node_modules отсутствует)
.pnp.cjs           ← карта резолюции
.yarn/cache/
  express-npm-4.18.2.zip
  debug-npm-4.3.4.zip
```

`require('debug')` → .pnp.cjs проверяет: debug не в вашем package.json → ошибка.

---

## Phantom dependencies: сравнение поведения

```js
// package.json: { "dependencies": { "express": "^4.18.2" } }
// express зависит от debug

const debug = require('debug') // НЕ задекларировано в нашем package.json

// npm, Yarn Classic: РАБОТАЕТ (debug поднят в корень node_modules)
// pnpm, Yarn Berry PnP: ОШИБКА MODULE_NOT_FOUND
```

Строгость pnpm и Yarn Berry PnP — это особенность, а не баг. Она выявляет скрытые ошибки в коде.

---

## Lockfile: форматы и совместимость

### package-lock.json (npm)

```json
{
  "lockfileVersion": 3,
  "packages": {
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "accepts": "~1.3.8"
      }
    }
  }
}
```

Детальный JSON. Самый подробный из трёх.

### pnpm-lock.yaml (pnpm)

```yaml
lockfileVersion: '6.0'
packages:
  /express@4.18.2:
    resolution:
      integrity: sha512-...
    dependencies:
      accepts: 1.3.8
```

YAML. Читаемый, но менее знаком.

### yarn.lock (Yarn)

```
express@^4.18.2:
  version "4.18.2"
  resolved "https://registry.yarnpkg.com/..."
  integrity sha512-...
  dependencies:
    accepts "~1.3.8"
```

Собственный формат — не JSON, не YAML.

---

## Форсирование версий: синтаксис и возможности

| Менеджер | Поле             | Точечная замена   | Паттерн `**` |
| -------- | ---------------- | ----------------- | ------------ |
| npm      | `overrides`      | `"express>debug"` | Нет          |
| pnpm     | `pnpm.overrides` | `"express>debug"` | Нет          |
| Yarn     | `resolutions`    | `"express/debug"` | `"**/debug"` |

```json
// npm (package.json)
{
  "overrides": {
    "lodash": "4.17.21",
    "express>debug": "4.3.4"
  }
}

// pnpm (package.json)
{
  "pnpm": {
    "overrides": {
      "lodash": "4.17.21",
      "express>debug": "4.3.4"
    }
  }
}

// Yarn (package.json)
{
  "resolutions": {
    "lodash": "4.17.21",
    "**/debug": "4.3.4",
    "react-scripts/**/typescript": "5.0.4"
  }
}
```

---

## Workspaces / монорепо

Все три менеджера поддерживают workspaces, но с разными возможностями:

| Возможность                     | npm        | pnpm                | Yarn               |
| ------------------------------- | ---------- | ------------------- | ------------------ |
| Базовые workspaces              | v7+        | v2+                 | v1+                |
| Экономия диска при shared deps  | Нет        | Да (hard links)     | Yarn Berry: да     |
| Строгая изоляция пакетов        | Нет        | Да                  | Yarn Berry PnP: да |
| Фильтрация команд по пакетам    | Ограничено | `--filter` мощный   | `--filter`         |
| Топологическая сортировка задач | Нет        | Да (pnpm.sequences) | Да (plugins)       |

---

## Безопасность по умолчанию

| Аспект             | npm         | pnpm         | Yarn Berry       |
| ------------------ | ----------- | ------------ | ---------------- |
| Phantom deps       | Допускает   | Блокирует    | PnP: блокирует   |
| Lifecycle scripts  | Выполняются | Выполняются  | Выполняются      |
| `npm audit` аналог | `npm audit` | `pnpm audit` | `yarn npm audit` |
| Проверка integrity | SHA-512     | SHA-512      | SHA-512          |

---

## Рекомендации по выбору сценария

### Легаси-проект / максимальная совместимость

Выбор: **npm**

- Не нужна дополнительная установка (идёт с Node.js)
- Все инструменты протестированы с npm
- package-lock.json — стандарт индустрии

### Монорепо с большим числом пакетов

Выбор: **pnpm**

- Жёсткая экономия диска через hard links
- Строгая изоляция предотвращает скрытые зависимости между пакетами
- Мощный `--filter` для выборочного запуска команд
- Быстрая повторная установка

### Команда с высокими требованиями к CI

Выбор: **Yarn Berry + zero-installs**

- Нет фазы скачивания в CI после настройки
- Полный контроль над деревом зависимостей
- Возможность аудита пакетов прямо в репозитории

### Новый проект без особых требований

Выбор: **pnpm** или **npm**

- pnpm: если хочется строгости и экономии диска
- npm: если важна простота и стандартность

---

## Команды-аналоги

| Действие             | npm                | pnpm                             | Yarn                       |
| -------------------- | ------------------ | -------------------------------- | -------------------------- |
| Установить все       | `npm install`      | `pnpm install`                   | `yarn`                     |
| Добавить пакет       | `npm install X`    | `pnpm add X`                     | `yarn add X`               |
| Добавить dev         | `npm install -D X` | `pnpm add -D X`                  | `yarn add -D X`            |
| Удалить              | `npm uninstall X`  | `pnpm remove X`                  | `yarn remove X`            |
| Запустить скрипт     | `npm run X`        | `pnpm X` или `pnpm run X`        | `yarn X`                   |
| Запуск без установки | `npx X`            | `pnpm dlx X`                     | `yarn dlx X`               |
| CI-установка         | `npm ci`           | `pnpm install --frozen-lockfile` | `yarn install --immutable` |
| Список установленных | `npm ls`           | `pnpm ls`                        | `yarn list`                |
| Почему установлен    | `npm explain X`    | `pnpm why X`                     | `yarn why X`               |

---

## ⚠️ Частые ошибки при сравнении

**❌ Смешивать lockfile в одном репозитории**

Наличие и `package-lock.json`, и `pnpm-lock.yaml` приводит к путанице — непонятно, каким менеджером пользоваться.

✅ Фиксируйте менеджер:

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

**❌ Мигрировать на pnpm без проверки phantom deps**

Код, использующий незадекларированные пакеты, сломается при переходе с npm на pnpm.

✅ Перед миграцией:

```bash
npm ls --depth=0  # проверить явные зависимости
grep -r "require\|import" src/ | # найти все импорты
```

**❌ Считать Yarn Classic и Yarn Berry взаимозаменяемыми**

Разные архитектуры, разные конфиги, разные команды. `yarn global add` есть в Classic, но не в Berry.

✅ Проверяйте `yarn --version` и файл `.yarnrc.yml`.
