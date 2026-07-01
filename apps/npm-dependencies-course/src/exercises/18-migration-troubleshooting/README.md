# Уровень 18: Миграция и устранение неполадок

## Миграция между менеджерами

Общий алгоритм смены пакетного менеджера:

```bash
# 1. Удалить существующие node_modules и lockfile старого менеджера
rm -rf node_modules
rm package-lock.json   # если мигрируем с npm
rm yarn.lock           # если мигрируем с Yarn

# 2. Установить новым менеджером
pnpm install           # или yarn install

# 3. Запустить тесты и приложение
```

При миграции с npm на pnpm возможен импорт lockfile:

```bash
pnpm import  # создаёт pnpm-lock.yaml из package-lock.json или yarn.lock
```

## Частые ошибки установки

### ERESOLVE — конфликт peer-зависимостей

Возникает в npm v7+ при несовместимых peer-зависимостях. Читать сообщение сверху вниз:

- «While resolving» — что устанавливается
- «Found» — что уже установлено
- «Could not resolve» — что конфликтует

```bash
npm install --legacy-peer-deps  # обойти как npm v6
```

### EINTEGRITY — битый кэш

SHA-512 скачанного архива не совпадает с lockfile. Решение:

```bash
npm cache clean --force
npm install
```

### EBADENGINE — несоответствие версии Node.js

Пакет требует другую версию Node.js через поле `engines`.

```bash
node --version         # текущая версия
cat .nvmrc             # требуемая версия
nvm use                # переключить версию
```

## Фантомные зависимости при переходе на pnpm

Код, опиравшийся на поднятые зависимости, сломается:

```js
// Работало с npm, падает с pnpm
import { merge } from 'lodash' // lodash не в package.json
```

Решение: явно добавить все фактически используемые зависимости:

```bash
pnpm add lodash
```

## Дрейф версий между машинами

Симптом: у разработчиков разные версии пакетов, несмотря на lockfile.

Причины:

- Разработчики запускают `npm install` вместо `npm ci`
- lockfile не закоммичен
- Разные версии Node.js (влияет на разрешение native addons)

Решение: зафиксировать Node.js через `.nvmrc` + поле `engines` + использовать `npm ci` в CI.

## Диагностический чек-лист

1. Удалить `node_modules` и lockfile, переустановить
2. Запустить `npm cache verify` или `npm cache clean --force`
3. Использовать `npm ls <package>` для поиска источника зависимости
4. Использовать `npm explain <package>` для подробного объяснения
5. Проверить, что lockfile закоммичен и не игнорируется в `.gitignore`
6. Проверить версию Node.js (`.nvmrc`, `engines` в `package.json`)

## ⚠️ Частые ошибки

❌ Использовать `npm install --force` для решения ERESOLVE — это создаёт несовместимое дерево.

✅ Сначала понять причину конфликта, затем использовать `--legacy-peer-deps` или `overrides`.

❌ Игнорировать предупреждения о peer-зависимостях при установке.

✅ Разобраться с каждым предупреждением — они указывают на потенциальные runtime-проблемы.
