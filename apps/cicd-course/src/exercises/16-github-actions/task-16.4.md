# Задание 16.4: Reusable Workflows и Composite Actions

## Цель

Создать интерактивный конструктор переиспользуемых компонентов GitHub Actions. Студент строит либо Reusable Workflow (для переиспользования нескольких джобов), либо Composite Action (для переиспользования шагов), и видит оба файла: определение и вызов.

## Требования

1. Отобразить **переключатель типа**: `Reusable Workflow` / `Composite Action`
2. Для **Reusable Workflow**:
   - Поле `workflow name` — имя файла workflow
   - Добавление **inputs**: имя input, тип (string/boolean/number), required (toggle), default value
   - Добавление **secrets**: имя секрета, required (toggle)
   - Показывать **два YAML-блока**: файл определения (`workflow_call` trigger) и файл вызова (`uses:` + `with:` + `secrets:`)
3. Для **Composite Action**:
   - Поле `action name` и `description`
   - Добавление **inputs**: имя, description, required, default
   - Список предустановленных шагов (чекбоксы): checkout, setup-node, npm-ci
   - Показывать **два YAML-блока**: `action.yml` (с `runs.using: composite`) и вызов через `uses: ./.github/actions/`
4. Добавить **панель сравнения** с GitLab CI аналогами:
   - Reusable Workflow ↔ `include: project:`
   - Composite Action ↔ `extends:` / скрипты в `.gitlab/scripts/`

## Чеклист

- [ ] Переключатель Reusable Workflow / Composite Action
- [ ] Для Workflow: добавление/удаление inputs с параметрами
- [ ] Для Workflow: добавление/удаление secrets
- [ ] Два YAML-блока: definition и caller
- [ ] Для Composite Action: поле name + description
- [ ] Чекбоксы стандартных шагов для Composite Action
- [ ] В caller YAML корректно передаются inputs и secrets
- [ ] Панель сравнения с GitLab CI аналогами

## Как проверить себя

1. Выбери Reusable Workflow → добавь input `environment` (string, required) → в YAML: `inputs: environment: type: string required: true`
2. Добавь секрет `DEPLOY_KEY` (required) → в определении: `secrets: DEPLOY_KEY: required: true`, в вызове: `secrets: DEPLOY_KEY: ${{ secrets.PROD_KEY }}`
3. Переключись на Composite Action → задай имя `setup-project` → включи шаги checkout + setup-node + npm-ci
4. Проверь `action.yml`: должен быть `runs: using: composite` и все выбранные шаги
5. Проверь caller: `uses: ./.github/actions/setup-project`

## Подсказки

- Состояние: `type` ('workflow' | 'action'), `inputs` (массив объектов), `secrets` (массив объектов), `selectedSteps` (string[])
- Для Reusable Workflow вызов: `uses: ./.github/workflows/${workflowName}.yml`
- В `with:` блоке caller: `${input.name}: $\{{ inputs.${input.name} \}}` (пример-заполнитель)
- `runs.using: composite` обязателен для каждого шага в Composite Action: добавляй `shell: bash`
- Каждый шаг Composite Action должен иметь `shell:` — это обязательное требование GitHub Actions
