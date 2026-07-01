# Уровень 6: Команды установки и обновления

## npm install

`npm install` (или `npm i`) — универсальная команда. Поведение зависит от контекста:

- **Без аргументов:** устанавливает все зависимости из `package.json`, обновляет `package-lock.json` при необходимости
- **С именем пакета:** `npm install lodash` — устанавливает пакет и добавляет в `dependencies`
- **Обновляет lockfile** при несоответствии

## npm ci

`npm ci` (clean install) — строгая установка строго по `package-lock.json`:

- Удаляет `node_modules` перед установкой
- Не обновляет lockfile никогда
- Завершается ошибкой, если `package-lock.json` отсутствует или не синхронизирован с `package.json`
- Используется в CI/CD для воспроизводимых сборок

## npm update

`npm update [pkg]` — обновляет пакеты в пределах диапазонов semver из `package.json`:

- `npm update` — обновит все пакеты до максимально допустимых версий
- `npm update lodash` — обновит только lodash
- **Не обновляет мажорные версии** (если в `package.json` указан `^1.x`, до `2.x` не перейдёт)
- Обновляет `package-lock.json`

## npm outdated

`npm outdated` — таблица устаревших пакетов:

```
Package    Current   Wanted   Latest   Location
lodash     4.17.20  4.17.21  4.17.21  node_modules/lodash
react      17.0.2   17.0.2   18.2.0   node_modules/react
```

- **Current** — установленная версия
- **Wanted** — максимальная версия в пределах диапазона (то, что даст `npm update`)
- **Latest** — последняя версия в реестре (может выходить за диапазон)

## npm prune

`npm prune` — удаляет **extraneous** пакеты (те, что установлены в `node_modules`, но не упомянуты в `package.json`). Полезно после ручных изменений или при очистке.

```bash
npm prune              # удалить extraneous пакеты
npm prune --omit=dev   # удалить также devDependencies (production режим)
```

## npm dedupe

`npm dedupe` (или `npm ddp`) — пересматривает дерево и устраняет лишние вложенные копии, если возможно поднять их выше без конфликтов. Уменьшает размер `node_modules`.

## Ключевые флаги

| Флаг                  | Описание                                                           |
| --------------------- | ------------------------------------------------------------------ |
| `--save-dev` / `-D`   | Добавить в `devDependencies`                                       |
| `--save-prod` / `-P`  | Добавить в `dependencies` (поведение по умолчанию)                 |
| `--save-exact` / `-E` | Фиксировать точную версию без диапазона (`"1.2.3"`, не `"^1.2.3"`) |
| `--omit=dev`          | Не устанавливать devDependencies                                   |
| `--global` / `-g`     | Глобальная установка                                               |
| `--no-save`           | Не изменять `package.json`                                         |

## ⚠️ Типичные ошибки

❌ Использовать `npm install` в CI/CD вместо `npm ci`  
✅ В CI/CD всегда `npm ci` — гарантирует детерминизм

❌ Думать, что `npm update` обновит мажорные версии  
✅ Для мажорных обновлений — `npm install pkg@latest` или инструмент `npm-check-updates`

❌ Путать `Wanted` и `Latest` в `npm outdated`  
✅ `Wanted` = то, что получит `npm update`; `Latest` = последняя в реестре
