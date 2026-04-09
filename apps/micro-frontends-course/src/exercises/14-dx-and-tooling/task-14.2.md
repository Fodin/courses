# Задание 14.2: Конструктор workspace конфигурации

## Цель

Построить интерактивный конструктор, который позволяет выбрать инструмент (Nx, Turborepo, PNPM), сформировать список MFE с зависимостями и получить готовый конфигурационный файл с валидацией циклических зависимостей.

## Требования

1. Реализовать выбор инструмента из трёх вариантов: Nx / Turborepo / PNPM workspaces — каждый с кратким описанием (radio-стиль), выбор влияет на генерируемый конфиг
2. Отобразить преднастроенные shared-пакеты: ui-kit, utils, types, config — они всегда присутствуют в конфиге
3. Форма добавления MFE: поля name (текст), type (select: app/library/shared), dependencies (checkboxes из существующих пакетов)
4. Список добавленных MFE с кнопкой удаления для каждого
5. Live-preview генерируемого конфига в виде code-блока, который обновляется при любом изменении — формат зависит от выбранного инструмента: Nx (nx.json), Turborepo (turbo.json), PNPM (pnpm-workspace.yaml)
6. Валидация циклических зависимостей: при обнаружении цикла показать предупреждение с именами пакетов, образующих цикл
7. Кнопка «Скопировать» для копирования конфига в буфер обмена

## Формат генерируемых конфигов

**Nx (nx.json):**
```json
{
  "affected": { "defaultBase": "main" },
  "tasksRunnerOptions": { "default": { "runner": "nx/tasks-runners/default", "options": { "cacheableOperations": ["build", "test", "lint"] } } },
  "projects": { "<name>": "apps/<name>", ... }
}
```

**Turborepo (turbo.json):**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "outputs": [] }
  }
}
```

**PNPM (pnpm-workspace.yaml):**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Чеклист

- [ ] Выбор инструмента меняет генерируемый конфиг
- [ ] Shared-пакеты (ui-kit, utils, types, config) присутствуют в списке зависимостей
- [ ] Форма добавления MFE работает: name, type, dependencies
- [ ] Добавленные MFE отображаются в списке с кнопкой удаления
- [ ] Live-preview обновляется при каждом изменении (выбор инструмента, добавление/удаление MFE)
- [ ] При добавлении MFE с зависимостью, образующей цикл, появляется предупреждение с именами пакетов цикла
- [ ] Корректный Nx конфиг с projects
- [ ] Корректный Turborepo конфиг с pipeline
- [ ] Корректный PNPM конфиг с packages
- [ ] Кнопка «Скопировать» копирует конфиг в буфер обмена

## Как проверить себя

1. Откройте задание, выберите «Nx» — в preview должен появиться nx.json с базовой структурой
2. Добавьте MFE «catalog» с type «app» и dependency «ui-kit» — он должен появиться в списке и в конфиге
3. Переключитесь на «Turborepo» — конфиг должен смениться на turbo.json
4. Добавьте MFE «payments» с dependency «checkout», затем «checkout» с dependency «payments» — должно появиться предупреждение о цикле: payments → checkout → payments
5. Нажмите «Скопировать» — конфиг должен скопироваться (или появиться уведомление об успехе)
