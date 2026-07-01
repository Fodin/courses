# Уровень 12: Кэш, integrity и .npmrc

## Кэш npm

npm хранит скачанные пакеты в content-addressable хранилище `~/.npm/_cacache` (cacache). При повторной установке пакет берётся из кэша, а не скачивается заново.

Содержимое кэша:

- `content-v2/` — тела пакетов (tarball), адресованные по хэшу
- `index-v5/` — индекс: маппинг имя@версия → хэш
- `tmp/` — временные файлы в процессе загрузки

## Поле `integrity` — Subresource Integrity

В `package-lock.json` каждый пакет имеет поле `integrity`:

```json
{
  "node_modules/lodash": {
    "version": "4.17.21",
    "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
    "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZkFezoU741Wd3R6WRsA=="
  }
}
```

Формат: `sha512-<base64>` (SRI — Subresource Integrity). При установке npm вычисляет хэш скачанного tarball и сравнивает с `integrity`. Несовпадение → ошибка `EINTEGRITY`.

## Ошибка EINTEGRITY

```
npm ERR! code EINTEGRITY
npm ERR! sha512-... integrity checksum failed
```

Причины:

- Пакет подменён в реестре (supply chain атака)
- Повреждён локальный кэш
- Повреждён `package-lock.json` (ручное редактирование)

Решение: `npm cache clean --force`, затем повторная установка.

## Команды управления кэшем

```bash
npm cache verify    # Проверяет целостность кэша, удаляет повреждённое
npm cache clean --force  # Полная очистка кэша
npm config get cache     # Путь к кэш-директории
```

## Офлайн-режимы

```bash
npm install --offline          # Только из кэша, не обращаться к реестру
npm install --prefer-offline   # Кэш в приоритете, при промахе — реестр
npm install --prefer-online    # Реестр в приоритете (по умолчанию)
```

## Конфигурация через `.npmrc`

Файл `.npmrc` содержит настройки npm. Уровни конфигурации (от высшего к низшему приоритету):

1. Флаги командной строки (`--registry=...`)
2. Переменные окружения (`npm_config_registry`)
3. `.npmrc` проекта (рядом с `package.json`)
4. `~/.npmrc` пользователя
5. Глобальный (`npm config get globalconfig`)
6. Встроенный (умолчания npm)

## Ключи `.npmrc`

```ini
# Реестр по умолчанию
registry=https://registry.npmjs.org/

# Фиксировать точную версию при установке (без ^)
save-exact=true

# Завершать с ошибкой при несоответствии engines
engine-strict=true

# Реестр для конкретного scope
@mycompany:registry=https://npm.mycompany.com/

# Токен аутентификации
//registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxx

# Разрешить установку пакетов с конфликтными peerDependencies
legacy-peer-deps=true
```

## Переменные окружения `npm_config_*`

Любой ключ `.npmrc` можно передать через переменную окружения:

```bash
npm_config_registry=https://my-registry.com npm install
npm_config_save_exact=true npm install lodash
```

Переменные окружения переопределяют `.npmrc` проекта, но не флаги командной строки.
