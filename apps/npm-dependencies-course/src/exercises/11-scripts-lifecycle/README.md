# Уровень 11: npm scripts и lifecycle

## Поле `scripts` в package.json

`scripts` — это словарь именованных команд, которые запускаются через `npm run <name>`.

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "jest",
    "start": "node dist/index.js"
  }
}
```

`npm test` и `npm start` — сокращения, не требующие слова `run`.

## Pre/post-хуки

npm автоматически запускает скрипты с префиксом `pre` и `post` вокруг любого скрипта:

```json
{
  "scripts": {
    "prebuild": "rm -rf dist",
    "build": "tsc",
    "postbuild": "cp -r assets dist/"
  }
}
```

При `npm run build` порядок: `prebuild` → `build` → `postbuild`. Если `prebuild` завершается с ошибкой, `build` не запускается.

## Lifecycle-скрипты установки

Эти скрипты запускаются автоматически при `npm install`:

| Скрипт           | Когда                                         |
| ---------------- | --------------------------------------------- |
| `preinstall`     | До начала установки                           |
| `install`        | После распаковки пакета                       |
| `postinstall`    | После успешной установки                      |
| `prepare`        | После `install`, перед `publish` — для сборки |
| `prepublishOnly` | Только перед `npm publish`                    |

## `prepare` vs `prepublishOnly`

`prepare` запускается при `npm install` (если есть `devDependencies`) и перед `npm publish`. Идеален для сборки TypeScript-пакетов перед публикацией.

`prepublishOnly` запускается ТОЛЬКО перед публикацией — для тестов и проверок, которые не нужны при install.

## Риск безопасности: `postinstall` зависимостей

⚠️ `postinstall` запускается для КАЖДОГО устанавливаемого пакета. Злоумышленник может встроить произвольный код в `postinstall` своего пакета. Это вектор supply chain атак.

Флаг `--ignore-scripts` отключает выполнение lifecycle-скриптов всех пакетов:

```bash
npm install --ignore-scripts
```

Это безопаснее, но может сломать пакеты, которым нужна компиляция нативных модулей.

## Переменные окружения в скриптах

npm передаёт в скрипты переменные из package.json:

- `npm_package_name` — имя пакета
- `npm_package_version` — версия
- `npm_package_scripts_build` — содержимое scripts.build
- `npm_config_loglevel` — текущий уровень логов

## `npx` vs `npm run`

`npm run` запускает скрипт из поля `scripts`. `npx` запускает бинарник:

1. Ищет в `node_modules/.bin/`
2. Если не найден — скачивает из реестра во временную папку и запускает

```bash
npx create-react-app my-app   # скачает и запустит
npx tsc --version              # запустит из node_modules/.bin
```

`npm exec` — официальная альтернатива `npx` (npm v7+), более явная семантика.

## Переменные пути в скриптах

В `scripts` PATH автоматически включает `node_modules/.bin`, поэтому можно писать:

```json
{
  "scripts": {
    "lint": "eslint src/"
  }
}
```

Без полного пути `./node_modules/.bin/eslint`.
