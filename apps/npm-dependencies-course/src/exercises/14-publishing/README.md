# Уровень 14: Публикация пакетов

## npm publish

Базовая публикация пакета:

```bash
npm publish
```

Публикует содержимое текущей директории в реестр (по умолчанию npmjs.org). Требует аутентификации через `npm login` или `_authToken` в `.npmrc`.

## Бамп версии: `npm version`

```bash
npm version patch   # 1.2.3 → 1.2.4
npm version minor   # 1.2.3 → 1.3.0
npm version major   # 1.2.3 → 2.0.0
npm version 2.1.0   # явная версия
```

`npm version` обновляет `package.json`, коммитит изменения и создаёт git-тег `v1.2.4`. Требует чистого рабочего дерева git.

## Scopes и access

Scoped-пакеты имеют вид `@scope/name`. По умолчанию они публикуются как **restricted** (приватные), даже если у вас бесплатный аккаунт:

```bash
# Для публичного scoped-пакета обязателен флаг
npm publish --access public

# Unscoped-пакеты (my-lib) по умолчанию публичные
npm publish
```

## dist-tags

dist-tags — это именованные ссылки на версии. Тег `latest` используется по умолчанию при `npm install`.

```bash
# Опубликовать как beta, не трогая latest
npm publish --tag beta

# Опубликовать как next
npm publish --tag next

# Управление тегами вручную
npm dist-tag add my-lib@2.0.0-rc.1 next
npm dist-tag rm my-lib next
npm dist-tag ls my-lib
```

Пользователи получают стабильную версию через `npm install my-lib`, а тестировщики — через `npm install my-lib@next`.

## Контроль содержимого пакета

### Поле `files` (whitelist)

```json
{
  "files": ["dist", "README.md", "LICENSE"]
}
```

Только перечисленные файлы и папки попадут в пакет. Всегда включаются: `package.json`, `README*`, `LICENSE*`, `CHANGELOG*`, `main`.

### `.npmignore` (blacklist)

Аналог `.gitignore` — исключает файлы из пакета. Если `.npmignore` есть, `.gitignore` не используется для npm publish.

### Проверка: `npm pack`

```bash
npm pack
# Создаёт my-lib-1.2.3.tgz — можно проверить содержимое
tar -tzf my-lib-1.2.3.tgz
```

Запускайте `npm pack` перед каждой публикацией, чтобы убедиться что в пакет не попали лишние файлы (тесты, исходники, секреты).

## Lifecycle перед публикацией

```json
{
  "scripts": {
    "prepare": "tsc",
    "prepublishOnly": "npm test && npm run lint"
  }
}
```

`prepublishOnly` запускается только перед `npm publish` — идеальное место для финальных проверок.

## Аутентификация

```ini
# ~/.npmrc
//registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxx
```

В CI/CD — через переменную окружения `NPM_TOKEN`:

```ini
# .npmrc проекта (безопасно)
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

## `npm deprecate` и политика unpublish

```bash
# Пометить версию как устаревшую (сохраняется в реестре)
npm deprecate my-lib@"< 2.0.0" "Устарело, используйте v2+"

# Удалить версию (только в течение 72 часов после публикации)
npm unpublish my-lib@1.0.0

# Удалить весь пакет (только в течение 72 часов И только если нет зависимых)
npm unpublish my-lib --force
```

Политика npm: после 72 часов unpublish недоступен, если от пакета зависят другие. Причина: инцидент с `left-pad` (2016), когда удаление популярного пакета сломало тысячи проектов.

## Приватные и корпоративные реестры

```bash
# Verdaccio (self-hosted)
npm publish --registry https://verdaccio.mycompany.com/

# Через .npmrc проекта
registry=https://nexus.mycompany.com/repository/npm/
```
