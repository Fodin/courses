# Уровень 13: Workspaces и монорепо

## Что такое workspaces

Workspaces (рабочие пространства) позволяют управлять несколькими пакетами в одном репозитории (монорепо). Объявляются в `package.json` корневого проекта:

```json
{
  "name": "my-monorepo",
  "workspaces": ["packages/*", "apps/web", "apps/api"]
}
```

npm поддерживает workspaces с версии 7.

## Структура монорепо

```
my-monorepo/
├── package.json          ← корневой, объявляет workspaces
├── package-lock.json     ← единый для всего монорепо
├── node_modules/         ← единый, hoisted-зависимости
│   ├── react/
│   ├── lodash/
│   └── .bin/
├── packages/
│   ├── ui/
│   │   ├── package.json  ← name: "@acme/ui"
│   │   └── src/
│   └── utils/
│       ├── package.json  ← name: "@acme/utils"
│       └── src/
└── apps/
    └── web/
        ├── package.json  ← name: "@acme/web"
        └── src/
```

## Как npm симлинкует локальные пакеты

При `npm install` из корня npm:

1. Устанавливает все зависимости в корневой `node_modules`
2. Создаёт символические ссылки для воркспейсов:

```
node_modules/@acme/ui → ../../packages/ui
node_modules/@acme/utils → ../../packages/utils
```

Если `@acme/web` зависит от `@acme/ui` — оно найдёт его через симлинк.

## Hoisting общих зависимостей

Если несколько воркспейсов зависят от одной версии `react`, она устанавливается один раз в корневой `node_modules`. Это экономит место и ускоряет установку.

Если версии конфликтуют — каждый воркспейс получает свою копию в своём `node_modules`.

## Флаги для работы с воркспейсами

```bash
# Установить зависимость в конкретный воркспейс
npm install lodash -w packages/ui
npm install lodash --workspace=packages/ui

# Запустить скрипт во всех воркспейсах
npm run test --workspaces

# Запустить скрипт в конкретном воркспейсе
npm run build -w @acme/ui

# Установить из корня (все воркспейсы)
npm install
```

## Единый lockfile

Всё монорепо использует один `package-lock.json` в корне. Это обеспечивает детерминированную установку и упрощает аудит безопасности всего монорепо одной командой.

## Межпакетные зависимости

Чтобы `@acme/web` зависел от `@acme/ui`:

```json
{
  "name": "@acme/web",
  "dependencies": {
    "@acme/ui": "*"
  }
}
```

`"*"` означает «любая версия» — npm найдёт локальный воркспейс и создаст симлинк вместо загрузки из реестра.

## Фантомные зависимости — главная ловушка

Из-за hoisting пакет из `node_modules` корня доступен любому воркспейсу — даже если он не указан в его `dependencies`. Это "фантомная зависимость":

```json
// packages/ui/package.json — НЕТ lodash в dependencies
{
  "name": "@acme/ui"
}
```

Но `require('lodash')` внутри `@acme/ui` сработает, если lodash — зависимость другого воркспейса. При удалении lodash из того воркспейса `@acme/ui` сломается.
