# Задание 4.1: rules:if — условия по переменным

## Цель

Создать интерактивный симулятор `rules:if` — визуальный конструктор условий, показывающий какие джобы GitLab CI запустятся при разных событиях пайплайна.

## Требования

1. Блок выбора события: кнопки для 5 типов событий (push в main, push в feature-ветку, MR, тег, расписание)
2. При выборе события — автоматически устанавливаются значения CI-переменных ($CI_COMMIT_BRANCH, $CI_PIPELINE_SOURCE, $CI_COMMIT_TAG, $CI_MERGE_REQUEST_IID)
3. Панель "текущие переменные" — показывает заданные значения в виде code-блоков
4. Список из 5 джобов с rules:if конфигурацией (каждый с разными условиями)
5. Для каждого джоба — индикатор "запустится / не запустится" с объяснением почему
6. Визуальная decision tree: дерево проверки правил для активного джоба при выборе события

## Структура данных

```ts
interface CIEvent {
  id: string
  label: string        // "Push в main"
  variables: {
    CI_COMMIT_BRANCH: string
    CI_PIPELINE_SOURCE: string
    CI_COMMIT_TAG: string
    CI_MERGE_REQUEST_IID: string
  }
}

interface CIJob {
  name: string
  rules: Array<{
    condition: string   // текстовое описание условия
    when: string        // on_success | never | manual
    evaluate: (vars: Record<string, string>) => boolean
  }>
}
```

## События для симуляции

| ID | Название | branch | source | tag | MR IID |
|---|---|---|---|---|---|
| push-main | Push в main | main | push | "" | "" |
| push-feature | Push в feature | feature/auth | push | "" | "" |
| merge-request | Merge Request | "" | merge_request_event | "" | "42" |
| tag-release | Тег v1.2.3 | "" | push | v1.2.3 | "" |
| schedule | Расписание | main | schedule | "" | "" |

## Чеклист

- [ ] 5 кнопок выбора события, активная кнопка подсвечена
- [ ] Блок "Текущие переменные CI" с 4 переменными в code-тегах
- [ ] 5 джобов с разными rules:if (deploy-prod, test, mr-lint, release-publish, nightly-backup)
- [ ] Каждый джоб показывает: будет запущен (зелёный) или нет (серый) с объяснением
- [ ] Decision tree для выбранного события показывает порядок проверки правил
- [ ] Используется useState для активного события

## Как проверить себя

- Выбери "Push в main" — должны запуститься deploy-prod и test, не должны mr-lint и release-publish
- Выбери "Merge Request" — должен запуститься mr-lint, не deploy-prod
- Выбери "Тег v1.2.3" — должен запуститься release-publish
- Выбери "Расписание" — должен запуститься nightly-backup
- Переменные в блоке должны меняться при переключении события
