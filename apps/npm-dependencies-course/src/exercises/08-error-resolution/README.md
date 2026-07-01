# Уровень 8: Разрешение ошибок установки

## Коды ошибок npm — что значит каждый

npm сообщает об ошибках через коды в формате `npm ERR! code <КОД>`. Знание кодов экономит время диагностики.

### ERESOLVE — неразрешимый конфликт зависимостей

Самая частая ошибка в npm v7+. Возникает, когда алгоритм разрешения зависимостей не может построить дерево, удовлетворяющее всем peer-требованиям.

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR!
npm ERR! While resolving: my-project@1.0.0
npm ERR! Found: react@17.0.2
npm ERR! node_modules/react
npm ERR!   react@"^17.0.2" from the root project
npm ERR!
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^18.0.0" from some-lib@3.0.0
npm ERR! node_modules/some-lib
npm ERR!   some-lib@"^3.0.0" from the root project
```

Читать блок надо снизу вверх: `some-lib@3.0.0` требует `react@^18`, но в проекте уже стоит `react@17`. Конфликт.

### ETARGET — версия не существует

```
npm ERR! code ETARGET
npm ERR! notarget No matching version found for lodash@5.0.0.
```

Запрошенная версия отсутствует в реестре. Проверьте `npm view lodash versions`.

### E404 — пакет не найден

```
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@my-scope%2fprivate-pkg
```

Пакет не существует в реестре, либо это приватный scoped-пакет без доступа.

### EACCES / EPERM — ошибка прав доступа

```
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules
```

npm пытается записать файлы в каталог, на который нет прав. Чаще всего — при глобальной установке (`npm install -g`). Решение: сменить глобальный каталог npm или использовать nvm.

### ENOENT — файл или каталог не найден

```
npm ERR! code ENOENT
npm ERR! enoent ENOENT: no such file or directory, open '/path/package.json'
```

npm не нашёл `package.json`. Обычно запускаете команду не в той директории.

### ELIFECYCLE — ошибка скрипта

```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! my-project@1.0.0 build: `webpack --config webpack.config.js`
npm ERR! Exit status 1
```

Один из скриптов (`preinstall`, `install`, `postinstall`) завершился с ненулевым кодом. Проблема в самом скрипте или его зависимостях.

### EINTEGRITY — нарушена целостность

```
npm ERR! code EINTEGRITY
npm ERR! sha512-xxxx integrity checksum failed
```

SHA-512 скачанного архива не совпадает с записанным в lockfile. Возможная причина: повреждённый кеш или изменённый пакет в реестре. Решение: `npm cache clean --force` и повтор установки.

## Флаги для обхода конфликтов

### --legacy-peer-deps

Возвращает поведение npm v6: peer-зависимости не валидируются строго, конфликты игнорируются.

```bash
npm install --legacy-peer-deps
```

Применять когда: инструмент или библиотека ещё не обновила `peerDependencies` под вашу версию React/другого фреймворка, но фактически совместима.

### --force

Обходит любые конфликты, устанавливает пакеты невзирая на несовместимость.

```bash
npm install --force
```

⚠️ Опасно: может создать дерево зависимостей, в котором разные части приложения получат несовместимые версии одного пакета. Используйте только как крайнюю меру.

### Разница между флагами

| Флаг                 | Что делает                                | Риск                                            |
| -------------------- | ----------------------------------------- | ----------------------------------------------- |
| `--legacy-peer-deps` | Игнорирует peer-конфликты (как npm v6)    | Низкий: peer-зависимости опциональны по природе |
| `--force`            | Ставит несмотря ни на что, перезаписывает | Высокий: может сломать runtime                  |

## Чтение лог-файла npm

При ошибке npm советует открыть лог:

```
npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2024-01-15T10_00_00_000Z-debug-0.log
```

Лог содержит полный стек вызовов и HTTP-запросы. Самое важное — искать первую строку с `ERR` или последнюю группу ошибок.

## ⚠️ Типичные ошибки

❌ Сразу бежать к `--force` при ERESOLVE  
✅ Сначала прочитать блок ошибки: понять, кто с кем конфликтует, обновить зависимость или использовать `--legacy-peer-deps`

❌ Игнорировать EINTEGRITY и просто запускать повторно  
✅ Очистить кеш: `npm cache clean --force`, затем повторить установку

❌ Решать EACCES через `sudo npm install -g`  
✅ Настроить правильный глобальный каталог npm без sudo
