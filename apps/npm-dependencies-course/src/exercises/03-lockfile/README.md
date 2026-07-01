# Уровень 3: package-lock.json и воспроизводимые установки

## Зачем нужен lockfile

`package.json` содержит диапазоны версий (`^1.2.3`). Это удобно для обновлений, но проблематично для воспроизводимости: сегодня `npm install` выберет `1.2.3`, завтра — `1.5.0`.

`package-lock.json` решает эту проблему: он записывает **точные версии** каждого пакета (включая транзитивные зависимости), URL tarball, и SHA-512 хеш для проверки целостности.

```
package.json       →  "axios": "^1.0.0"    (диапазон)
package-lock.json  →  "version": "1.6.8"   (точная версия)
```

## Формат lockfileVersion

| Версия | npm     | Описание                                                    |
| ------ | ------- | ----------------------------------------------------------- |
| 1      | v5, v6  | Только секция `dependencies`                                |
| 2      | v7, v8  | Секции `packages` + `dependencies` (обратная совместимость) |
| 3      | v9, v10 | Только секция `packages`, без legacy `dependencies`         |

Актуальный формат — **lockfileVersion 3** (npm v9+). Если вы видите lockfile без секции `dependencies` — это v3.

## Структура lockfileVersion 3

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "my-project",
      "version": "1.0.0",
      "dependencies": { "axios": "^1.0.0" }
    },
    "node_modules/axios": {
      "version": "1.6.8",
      "resolved": "https://registry.npmjs.org/axios/-/axios-1.6.8.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "follow-redirects": "^1.15.0"
      }
    }
  }
}
```

Ключевые поля:

- **`version`** — точная установленная версия
- **`resolved`** — URL tarball в реестре
- **`integrity`** — SHA-512 хеш для проверки, что скачанный файл не подменён

## npm install vs npm ci

| Поведение                      | `npm install`  | `npm ci`             |
| ------------------------------ | -------------- | -------------------- |
| Требует lockfile               | Нет (создаёт)  | Да (падает без него) |
| Удаляет node_modules           | Нет            | Да, перед установкой |
| Изменяет lockfile              | Да (обновляет) | Нет (только читает)  |
| Рассинхрон lock и package.json | Обновляет lock | Падает с ошибкой     |
| Скорость (с актуальным lock)   | Медленнее      | Быстрее              |
| Предназначен для               | Разработка     | CI/CD, деплой        |

**Главное правило:** в CI всегда используйте `npm ci`. Это гарантирует, что сборка использует именно те версии, что зафиксированы в lockfile.

## Когда коммитить lockfile

**Приложения (apps):** всегда коммитить. Воспроизводимость критична.

**Публикуемые библиотеки (packages):** обычно не коммитить (добавить в `.gitignore`). Пользователь вашей библиотеки должен разрешить зависимости под свой проект. Коммит lockfile библиотеки не влияет на установку у пользователей (npm игнорирует lockfile вложенных пакетов).

## Рассинхрон lock и package.json

Если кто-то вручную изменил `package.json`, но не запустил `npm install`, lockfile окажется «устаревшим». `npm ci` обнаружит это и упадёт:

```
npm error `npm ci` can only install packages when your package.json
and package-lock.json or npm-shrinkwrap.json are in sync.
```

Решение: запустить `npm install` локально и закоммитить обновлённый lockfile.
