# Уровень 7 (подробно): Диагностика дерева зависимостей

## Аналогия: доктор для проекта

Когда проект «заболевает» — падают тесты, не собирается сборка, возникают странные ошибки с модулями — нужна диагностика. npm предоставляет набор команд-инструментов, каждая из которых отвечает на конкретный вопрос:

- `npm ls` — «покажи мне структуру»
- `npm explain` — «почему ЭТОТ пакет здесь?»
- `npm doctor` — «всё ли в порядке с окружением?»
- `npm outdated` — «насколько мы устарели?»

## npm ls: анатомия вывода

### Базовый вывод

```bash
$ npm ls

my-project@1.0.0 /path/to/project
├── express@4.18.2
├── lodash@4.17.21
└── typescript@5.3.3
```

Только прямые зависимости. Транзитивные скрыты.

### Полное дерево

```bash
$ npm ls --all

my-project@1.0.0
├── express@4.18.2
│   ├── accepts@1.3.8
│   │   ├── mime-types@2.1.35
│   │   │   └── mime-db@1.52.0
│   │   └── negotiator@0.6.3
│   ├── body-parser@1.20.2
│   │   ├── bytes@3.1.2
│   │   ├── content-type@1.0.5
│   │   ├── debug@2.6.9
│   │   │   └── ms@2.0.0
│   │   └── ...
│   └── ...
├── lodash@4.17.21
└── typescript@5.3.3
```

### Поиск конкретного пакета

```bash
$ npm ls debug

my-project@1.0.0
└── express@4.18.2
    └── body-parser@1.20.2
        └── debug@2.6.9
```

Видно: debug нужен express через body-parser. Если debug встречается несколько раз на разных уровнях:

```bash
$ npm ls debug --all

my-project@1.0.0
├── express@4.18.2
│   └── debug@2.6.9     ← версия для express (вложенная)
└── mocha@10.2.0
    └── debug@4.3.4     ← версия для mocha (в корне)
```

### Ограничение глубины

```bash
$ npm ls --depth=1

my-project@1.0.0
├── express@4.18.2
│   ├── accepts@1.3.8
│   ├── body-parser@1.20.2
│   └── ...
└── lodash@4.17.21
```

### Маркеры проблем в реальном выводе

```bash
$ npm ls

my-project@1.0.0
├── broken-package@1.0.0 INVALID: "some-dep@^2.0.0" from broken-package
│   └── some-dep@1.9.0 invalid
├── orphan-tool@3.1.0 extraneous
└── react@18.2.0
    └── react-dom@18.2.0 missing
```

Что здесь происходит:

- `broken-package` требует `some-dep@^2.0.0`, но установлена `1.9.0` — **INVALID**
- `orphan-tool` не упомянут в `package.json` — **extraneous**
- `react-dom` требуется как peer dependency, но не установлен — **missing**

Действия:

```bash
npm install          # починит INVALID и missing
npm prune            # уберёт extraneous
```

### Вывод в JSON для обработки скриптами

```bash
$ npm ls --json | jq '.dependencies | keys'
[
  "express",
  "lodash",
  "typescript"
]

# Найти все пакеты с INVALID:
$ npm ls --json --all | jq '.. | objects | select(.invalid == true) | .version'
```

## npm explain: «почему этот пакет?»

### Базовое использование

```bash
$ npm explain mime-db

mime-db@1.52.0
node_modules/mime-db
  mime-db@">=1.0.0 <2" from mime-types@2.1.35
  node_modules/mime-types
    mime-types@"~2.1.24" from accepts@1.3.8
    node_modules/accepts
      accepts@"~1.3.8" from express@4.18.2
      node_modules/express
        express@"^4.18.0" from the root project
```

Читается снизу вверх: ваш проект требует express → express требует accepts → accepts требует mime-types → mime-types требует mime-db.

### Когда это нужно

Типичная ситуация:

```bash
# npm audit сообщает об уязвимости в lodash@3.x
# Но у вас lodash@4. Кто тянет lodash@3?
$ npm explain lodash

lodash@3.10.1
node_modules/some-old-lib/node_modules/lodash
  lodash@"^3.0.0" from some-old-lib@1.5.0
  node_modules/some-old-lib
    some-old-lib@"^1.0.0" from the root project
```

Теперь понятно: `some-old-lib` тянет устаревший lodash. Варианты решения: обновить `some-old-lib`, использовать `overrides` (уровень 9), или заменить на альтернативу.

### npm why — алиас npm explain

```bash
npm why lodash        # эквивалент npm explain lodash
npm explain lodash    # официальное название
```

Оба работают одинаково. `npm why` появился как сокращение по аналогии с yarn why.

## npm doctor: проверка окружения

```bash
$ npm doctor

Check                               Value                        Recommendation
npm ping                            OK
npm -v                              10.2.4                       Use npm v10.4.0
node -v                             v20.11.0                     Use node v20.11.1 (or higher)
npm config get registry             https://registry.npmjs.org/  OK
git executable in PATH              /usr/bin/git                 OK
global bin folder in PATH           /usr/local/bin               OK
Perms check on cached files         ok
Perms check on local node_modules   ok
Perms check on global node_modules  ok
Perms check on local prefix         ok
Perms check on global prefix        ok
```

### Что проверяет npm doctor:

1. **npm ping** — доступность реестра
2. **npm -v** — актуальность версии npm (сравнивает с последней)
3. **node -v** — актуальность Node.js
4. **registry** — правильность адреса реестра
5. **git в PATH** — нужен для некоторых пакетов с git-зависимостями
6. **Права доступа** — к кешу, node_modules, глобальным папкам

### Типичные проблемы, которые находит npm doctor

```bash
# Проблема с правами:
Perms check on cached files  WARN  /Users/user/.npm is not owned by user

# Решение:
sudo chown -R $(whoami) ~/.npm

# Устаревший npm:
npm -v  WARN  Use npm v10.4.0

# Решение:
npm install -g npm@latest
```

Важно: `npm doctor` только **сообщает** о проблемах, не исправляет их автоматически. Действия нужно выполнять вручную.

## npm fund: финансирование

```bash
$ npm fund

my-project@1.0.0
├── https://github.com/sponsors/nicolo-ribaudo
│   └── @babel/core@7.23.7
├── https://opencollective.com/eslint
│   └── eslint@8.57.0
└── https://github.com/sponsors/sindresorhus
    └── chalk@5.3.0
```

Это информационная команда — показывает пакеты, у которых авторы указали источники финансирования. Никак не влияет на установку или работу зависимостей. Можно игнорировать без последствий.

Чтобы убрать упоминание в выводе `npm install`:

```bash
npm install --no-fund
# или в .npmrc:
fund=false
```

## Комплексная диагностика: чеклист при проблемах

### Шаг 1: Проверить состояние дерева

```bash
npm ls 2>&1 | grep -E "INVALID|missing|extraneous"
```

Если есть INVALID или missing — запустить `npm install`.
Если есть extraneous — `npm prune`.

### Шаг 2: Найти виновника (при ошибке конкретного пакета)

```bash
# Ошибка: Cannot find module 'some-package'
npm explain some-package
# Если пусто — пакет не в дереве вовсе
npm install some-package
```

### Шаг 3: Проверить окружение (при нестандартных ошибках)

```bash
npm doctor
# Изучить все WARNING строки и устранить
```

### Шаг 4: Посмотреть на устаревшие пакеты

```bash
npm outdated
# Решить: что обновлять, что оставить
```

## Практические примеры: реальные сценарии

### Сценарий 1: «Почему node_modules такой большой?»

```bash
# Найти самые тяжёлые пакеты:
du -sh node_modules/* | sort -rh | head -20

# Посмотреть на дерево с дубликатами:
npm ls --all 2>/dev/null | grep "deduped" | wc -l

# Запустить дедупликацию:
npm dedupe
```

### Сценарий 2: «Тест падает после npm install»

```bash
# Что изменилось в дереве?
git diff package-lock.json | grep '"version"' | head -20

# Проверить конкретный пакет:
npm ls jest --all
npm explain jest

# Вернуться к предыдущему состоянию:
git checkout package-lock.json
npm ci
```

### Сценарий 3: «Конфликт peer dependencies при установке»

```bash
$ npm install some-package
npm WARN Could not resolve dependency:
npm WARN   peer react@"^16.8.0" from some-package@2.1.0
npm WARN   node_modules/some-package
npm WARN     some-package@"^2.0.0" from the root project

# Диагностика: какой react установлен?
npm ls react
npm explain react

# Решение: обновить some-package или использовать --legacy-peer-deps
```

## ⚠️ Распространённые ошибки начинающих

❌ **Запускать npm ls без флагов и не видеть транзитивных зависимостей**

```bash
npm ls
# Видите только прямые зависимости — создаётся ложное впечатление
```

✅ Правильно: `npm ls --all` для полного дерева, `npm ls pkg-name` для конкретного пакета.

---

❌ **Игнорировать вывод npm ls с маркерами**

```bash
$ npm ls
# INVALID: ...
# extraneous: ...
# — «всё равно работает, игнорирую»
```

Почему проблема: INVALID означает несоответствие версий — поведение пакета непредсказуемо. Extraneous захламляет node_modules.

✅ Правильно: при INVALID — `npm install`; при extraneous — `npm prune`.

---

❌ **Удалять пакеты, не понимая зачем они**

```bash
# «Зачем мне ms@2.0.0? Удалю.»
rm -rf node_modules/ms
```

✅ Правильно: сначала `npm explain ms` — убедиться, что пакет нужен другому пакету. Вручную удалять пакеты из node_modules — антипаттерн.

---

❌ **Ожидать, что npm doctor исправит проблемы**

```bash
npm doctor
# «Хорошо, теперь всё в порядке»
```

✅ npm doctor только диагностирует. Каждую строку с WARN нужно исправлять вручную согласно рекомендациям.
