import type { Translations } from '@courses/platform'

export const translations: Translations = {
  ru: {
    // Общие
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.close': 'Закрыть',

    // Навигация
    'nav.title': '📚 Уровни',
    'nav.levels': 'Уровни',
    'nav.level': 'Уровень',
    'nav.intro': 'Введение в CI/CD',
    'nav.gitlabYmlBasics': 'Первый .gitlab-ci.yml',
    'nav.jobsLifecycle': 'Жизненный цикл джоба',
    'nav.variables': 'Переменные в GitLab CI',
    'nav.rulesConditions': 'Rules и условный запуск',
    'nav.cacheArtifacts': 'Кэширование и артефакты',
    'nav.runners': 'GitLab Runners',
    'nav.testingInCi': 'Тестирование в CI',
    'nav.dockerInCi': 'Docker в CI',
    'nav.environmentsDeploy': 'Окружения и деплой',
    'nav.secretsSecurity': 'Секреты и безопасность',
    'nav.includesTemplates': 'Includes и шаблоны',
    'nav.advancedPipelines': 'Продвинутые пайплайны',
    'nav.monorepo': 'Монорепозитории в CI/CD',
    'nav.securityScanning': 'Сканирование безопасности',
    'nav.releases': 'Релизы и версионирование',
    'nav.githubActions': 'GitHub Actions',
    'nav.bestPractices': 'Best practices и антипаттерны',

    // Уровень 0
    'task.0.1': 'CI vs CD vs CD: разбираемся в терминах',
    'task.0.2': 'Анатомия пайплайна',
    'task.0.3': 'Ландшафт CI/CD инструментов',

    // Уровень 1
    'task.1.1': 'Структура .gitlab-ci.yml',
    'task.1.2': 'Stages и порядок выполнения',
    'task.1.3': 'Ключевое слово script',
    'task.1.4': 'Ключевое слово image',

    // Level 2
    'task.2.1': 'Состояния джоба',
    'task.2.1.title': 'State Machine джоба',
    'task.2.2': 'allow_failure и when',
    'task.2.2.title': 'allow_failure и when',
    'task.2.3': 'retry и timeout',

    // Уровень 3
    'task.3.1': 'Предопределённые переменные',
    'task.3.1.description': 'Каталог переменных, доступных в каждом job\'е без дополнительной настройки.',
    'task.3.2': 'Custom-переменные и приоритеты',
    'task.3.2.description': 'Задай значение APP_ENV на разных уровнях — узнай, какое победит.',
    'task.3.3': 'Использование переменных в скриптах',
    'task.3.3.description': 'Напиши скрипт с переменными, нажми "Resolve" и увидь развёрнутый результат.',

    // Уровень 4
    'task.4.1': 'rules:if — условия по переменным',
    'task.4.2': 'rules:changes — реакция на файлы',
    'task.4.3': 'workflow:rules — управление пайплайном',
    'task.4.4': 'Комбинирование правил',

    // Уровень 5
    'task.5.1': 'Artifacts: передача данных между джобами',
    'task.5.2': 'Cache: ускорение сборки',
    'task.5.3': 'Cache vs Artifacts: выбираем правильно',
    'task.5.4': 'Стратегии cache key',

    // Уровень 6
    'task.6.1': 'Типы раннеров и executors',
    'task.6.2': 'Tags и маршрутизация джобов',
    'task.6.3': 'Настройка self-hosted раннера',

    // Уровень 7
    'task.7.1': 'Пирамида тестов в пайплайне',
    'task.7.2': 'Services: базы данных в CI',
    'task.7.3': 'Coverage и JUnit отчёты',
    'task.7.4': 'Параллельный запуск тестов',

    // Уровень 8
    'task.8.1': 'Docker-in-Docker vs Kaniko',
    'task.8.2': 'Сборка и push образа',
    'task.8.3': 'Стратегии тегирования образов',

    // Уровень 9
    'task.9.1': 'Environments: staging и production',
    'task.9.2': 'Review Apps',
    'task.9.3': 'Ручные gate-ы и approvals',
    'task.9.4': 'Blue-green и canary деплой',

    // Уровень 10
    'task.10.1': 'Protected и masked переменные',
    'task.10.2': 'Vault интеграция',
    'task.10.3': 'OIDC и внешние облака',

    // Уровень 11
    'task.11.1': 'include: подключение внешних конфигов',
    'task.11.2': 'extends и YAML-якоря',
    'task.11.3': 'CI/CD-библиотека шаблонов',

    // Уровень 12
    'task.12.1': 'DAG-пайплайны с needs',
    'task.12.2': 'Матричные сборки с parallel:matrix',
    'task.12.3': 'Child pipelines с trigger:include',
    'task.12.4': 'Multi-project пайплайны',

    // Уровень 13
    'task.13.1': 'rules:changes для монорепо',
    'task.13.2': 'Child pipelines per сервис',
    'task.13.3': 'Граф зависимостей сервисов',

    // Уровень 14
    'task.14.1': 'SAST и dependency scanning',
    'task.14.2': 'Container scanning и secret detection',
    'task.14.3': 'DAST и security pipeline',

    // Уровень 15
    'task.15.1': 'Семантическое версионирование в CI',
    'task.15.2': 'Автоматический changelog',
    'task.15.3': 'Release pipeline',

    // Уровень 16
    'task.16.1': 'Синтаксис GitHub Actions',
    'task.16.2': 'Events, marketplace и actions',
    'task.16.3': 'Matrix strategy и secrets',
    'task.16.4': 'Reusable workflows и composite actions',

    // Уровень 17
    'task.17.1': 'Оптимизация пайплайна',
    'task.17.2': 'Антипаттерны CI/CD',
    'task.17.3': 'Нотификации и мониторинг',

    // Задания
    'task.title': 'Задание',
    'task.description': '📋 Описание задания',
    'task.yourForm': '🎯 Ваш результат:',
    'task.placeholder': 'Ваш результат появится здесь',
    'task.openFile': 'Откройте файл',
    'task.andComplete': 'и выполните задание',
    'task.formReady': 'Задание выполнено!',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',

    // Теория и решение
    'theory.list': '📚 Теория',
    'theory.title': '📚 Теория',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Развёрнуто',
    'theory.loading': 'Загрузка теории...',
    'quiz.title': '🧪 Тест по теории',
    'quiz.submit': 'Ответить',
    'quiz.correct': '✅ Правильно!',
    'quiz.wrong': '❌ Неправильно',
    'solution.show': '💡 Показать решение',
    'solution.hide': '🙈 Скрыть решение',

    // Тема и язык
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Наверх',

    // Level 0 - task UI strings
    'task.0.1.placeholder.phaseCard': 'Карточка фазы — замени на маппинг phases',

    // Level 0.2
    'task.0.2.placeholder.stages': 'Стадии пайплайна — замени на маппинг stages',
    'task.0.2.reset': 'Сбросить',

    // Level 0.3
    'task.0.3.filter.all': 'Все',
    'task.0.3.placeholder.cards': 'Карточки инструментов — замени на маппинг filteredTools',

    // Level 1.1
    'task.1.1.availableBlocks': 'Доступные блоки',
    'task.1.1.yourConfig': 'Твой конфиг',
    'task.1.1.check': 'Проверить',

    // Level 1.2
    'task.1.2.runPipeline': 'Запустить пайплайн',
    'task.1.2.jobName': 'Имя джоба',
    'task.1.2.addJob': 'Добавить джоб',

    // Level 1.3
    'task.1.3.runJob': 'Запустить джоб',
    'task.1.3.scenario.success': 'Успешный сценарий',
    'task.1.3.scenario.scriptFail': 'Ошибка в script',
    'task.1.3.scenario.beforeFail': 'Ошибка в before_script',

    // Level 1.4
    'task.1.4.imageCatalog': 'Каталог образов',
    'task.1.4.matchingTitle': 'Задание: выбери образ для проекта',
    'task.1.4.check': 'Проверить',

    // Level 2.1
    'task.2.1.queue': 'Queue',
    'task.2.1.start': 'Start',
    'task.2.1.success': 'Success',
    'task.2.1.fail': 'Fail',
    'task.2.1.cancel': 'Cancel',
    'task.2.1.timeout': 'Timeout',
    'task.2.1.logEmpty': 'Лог переходов появится здесь',
    'task.2.1.logHint': 'Нажми кнопку события, чтобы начать',

    // Level 2.2
    'task.2.2.jobConfigPlaceholder': 'Конфигуратор джобов появится здесь',

    // Level 2.3
    'task.2.3.configuration': 'Конфигурация',
    'task.2.3.yamlConfig': 'YAML-конфиг',
    'task.2.3.runSimulation': 'Запустить симуляцию',
    'task.2.3.attemptsLogPlaceholder': 'История попыток появится здесь',
    'task.2.3.retryWhenPlaceholder': 'TODO: чекбоксы типов ошибок',
    'task.2.3.successProbability': 'Вероятность успеха: {prob}%',

    // Level 3.1
    'task.3.1.searchPlaceholder': 'Поиск по имени или описанию...',
    'task.3.1.foundCount': 'Найдено: {count} переменных',
    'task.3.1.noResults': 'Переменные не найдены...',

    // Level 3.2
    'task.3.2.resolveWinner': 'Определить победителя',
    'task.3.2.winner': 'ПОБЕДИТЕЛЬ',

    // Level 3.3
    'task.3.3.predefinedVars': 'Предустановленные переменные:',
    'task.3.3.resolve': 'Resolve',
    'task.3.3.varName': 'ИМЯ',
    'task.3.3.varValue': 'значение',
    'task.3.3.addVar': '+ Добавить',

    // Уровень 4 — UI strings
    'task.4.1.subtitle': 'Выбери событие GitLab и посмотри, какие джобы запустятся',
    'task.4.2.subtitle': 'Отметь изменённые файлы и посмотри, какие CI-джобы запустятся',
    'task.4.2.randomChanges': 'Случайные изменения',
    'task.4.2.stats': 'файлов изменено | джобов запустится',
    'task.4.3.subtitle': 'Симулятор проблемы дублирования пайплайнов и его решения',
    'task.4.3.withoutRules': 'Без workflow:rules',
    'task.4.3.withRules': 'С workflow:rules',
    'task.4.3.openMr': 'Открыть MR → main',
    'task.4.3.reset': 'Сбросить',
    'task.4.3.runnerMinutes': 'Минуты раннера: {min}',
    'task.4.3.activePipelines': 'Активных пайплайнов: {count}',
    'task.4.3.duplicationWarn': '⚠️ Обнаружено дублирование — пайплайн запускается дважды!',
    'task.4.3.workflowYamlTitle': 'workflow:rules YAML',
    'task.4.3.pipelineCreated': 'Создан',
    'task.4.3.pipelineBlocked': 'Заблокирован',
    'task.4.4.subtitle': 'Добавляй правила, симулируй события, смотри итоговый YAML',
    'task.4.4.presetsTitle': 'Готовые примеры',
    'task.4.4.addRule': 'Добавить правило',
    'task.4.4.ifPlaceholder': 'IF-условие',
    'task.4.4.changesPlaceholder': 'CHANGES-паттерн',
    'task.4.4.add': 'Добавить',
    'task.4.4.testSimulator': 'Тест-симулятор',
    'task.4.4.check': 'Проверить',
    'task.4.4.yamlPreview': 'YAML-превью',
    'task.4.4.emptyState': 'Добавь правило или загрузи готовый пример',

    // Уровень 5 — UI strings
    'task.5.1.subtitle': 'Настрой артефакты и посмотри, как данные передаются по пайплайну',
    'task.5.1.pipeline': 'Пайплайн',
    'task.5.1.onFailureWarning': '⚠️ При on_failure артефакты сохраняются только при падении джоба',
    'task.5.1.artifactPaths': 'artifact:paths',
    'task.5.1.expireIn': 'artifact:expire_in',
    'task.5.1.when': 'artifact:when',
    'task.5.1.yamlOutput': 'YAML-вывод',
    'task.5.2.subtitle': 'Симуляция пайплайна с кэшем и без. Главная разница — шаг установки зависимостей.',
    'task.5.2.withoutCache': 'Без кэша',
    'task.5.2.withCache': 'С кэшем',
    'task.5.2.runSimulation': 'Запустить симуляцию',
    'task.5.2.simulating': 'Симуляция...',
    'task.5.2.savingsBanner': 'Кэш сэкономил {time}',
    'task.5.2.cacheConfig': 'Конфигурация кэша',
    'task.5.2.cacheKeyStrategy': 'cache:key стратегия',
    'task.5.2.cachePaths': 'cache:paths',
    'task.5.3.subtitle': 'Определи, когда использовать cache, а когда artifacts',
    'task.5.3.question': 'Что использовать?',
    'task.5.3.next': 'Следующий',
    'task.5.3.reset': 'Сначала',
    'task.5.3.results': 'Результаты',
    'task.5.3.score': 'Счёт: {correct} из {total}',
    'task.5.3.correct': 'Правильно!',
    'task.5.3.incorrect': 'Неправильно!',
    'task.5.4.subtitle': 'Выбери стратегию и симулируй события — смотри, где будет cache hit или miss',
    'task.5.4.simulator': 'Симулятор событий',
    'task.5.4.switchBranch': 'Сменить ветку',
    'task.5.4.updateLockfile': 'Обновить lock-файл',
    'task.5.4.noEvents': 'Нажми кнопку для симуляции',
    'task.5.4.eventsCount': '{count} событий',
    'task.5.4.prefix': 'Prefix (опционально)',
    'task.5.4.prefixPlaceholder': 'например: v1 или node18',
    'task.5.4.yamlResult': 'Результирующий YAML',
    'task.5.4.comparisonTable': 'Сравнительная таблица',
    'task.5.4.strategy': 'Стратегия',
    'task.5.4.autoInvalidation': 'Авто-инвалидация',
    'task.5.4.branchIsolation': 'Изоляция веток',
    'task.5.4.complexity': 'Сложность',
    'task.5.4.yes': 'Да',
    'task.5.4.no': 'Нет',

    // Уровень 6 — UI strings
    'task.6.1.title': 'Каталог GitLab Runner Executors',
    'task.6.1.filterAll': 'Все',
    'task.6.1.filterIsolation': 'Изоляция',
    'task.6.1.useCases': 'Сценарии использования',
    'task.6.1.configExample': 'Пример config.toml',
    'task.6.1.comparisonTable': 'Сравнительная таблица',
    'task.6.1.isolation': 'Изоляция',
    'task.6.1.speed': 'Скорость',
    'task.6.1.complexity': 'Сложность',
    'task.6.1.needsDocker': 'Нужен Docker',
    'task.6.2.title': 'Симулятор маршрутизации джобов',
    'task.6.2.runRouting': 'Запустить маршрутизацию',
    'task.6.2.reset': 'Сбросить',
    'task.6.2.runners': 'Раннеры',
    'task.6.2.jobs': 'Джобы',
    'task.6.2.runUntagged': 'run_untagged',
    'task.6.2.addTag': '+ Добавить тег',
    'task.6.2.noRunner': 'Нет подходящего раннера',
    'task.6.2.missingTags': 'Не хватает тегов',
    'task.6.2.routingRule': 'Раннер берёт job если имеет ВСЕ его теги. Джобы без тегов берутся раннерами с run_untagged=true.',
    'task.6.2.tagPlaceholder': 'Новый тег',
    'task.6.3.title': 'Wizard регистрации GitLab Runner',
    'task.6.3.next': 'Далее',
    'task.6.3.back': 'Назад',
    'task.6.3.copy': 'Скопировать',
    'task.6.3.copied': 'Скопировано!',
    'task.6.3.command': 'Команда',
    'task.6.3.config': 'config.toml',
    'task.6.3.urlLabel': 'GitLab URL',
    'task.6.3.urlHint': 'URL твоего GitLab-инстанса',
    'task.6.3.tokenLabel': 'Registration Token',
    'task.6.3.tokenHint': 'Найди токен в Settings → CI/CD → Runners',
    'task.6.3.executorLabel': 'Выбери executor',
    'task.6.3.tagsLabel': 'Теги раннера',
    'task.6.3.tagSuggestions': 'Популярные теги: docker, linux, windows, kubernetes, shell, production, staging',
    'task.6.3.settingsLabel': 'Настройки executor-а',
    'task.6.3.dockerImage': 'Docker Image',
    'task.6.3.dockerPrivileged': 'Privileged mode',
    'task.6.3.k8sNamespace': 'Kubernetes Namespace',
    'task.6.3.k8sImage': 'Kubernetes Helper Image',

    // Уровень 7 — UI strings
    'task.7.1.title': 'Задание 7.1',
    'task.7.1.todo': 'TODO: Выполните задание',
    'task.7.2.title': 'Задание 7.2',
    'task.7.2.todo': 'TODO: Выполните задание',
    'task.7.3.title': 'Задание 7.3',
    'task.7.3.todo': 'TODO: Выполните задание',
    'task.7.4.title': 'Задание 7.4',
    'task.7.4.todo': 'TODO: Выполните задание',

    // Level 14 — UI strings
    'task.14.1.title': 'Задание 14.1',
    'task.14.1.todo': 'TODO: Выполните задание',
    'task.14.2.title': 'Задание 14.2',
    'task.14.2.todo': 'TODO: Выполните задание',
    'task.14.3.title': 'Задание 14.3',
    'task.14.3.todo': 'TODO: Выполните задание',

    // Level 15 — UI strings
    'task.15.1.title': 'Задание 15.1',
    'task.15.1.todo': 'TODO: Выполните задание',
    'task.15.2.title': 'Задание 15.2',
    'task.15.2.todo': 'TODO: Выполните задание',
    'task.15.3.title': 'Задание 15.3',
    'task.15.3.todo': 'TODO: Выполните задание',

    // Level 16 — UI strings
    'task.16.1.title': 'Задание 16.1',
    'task.16.1.todo': 'TODO: Выполните задание',
    'task.16.2.title': 'Задание 16.2',
    'task.16.2.todo': 'TODO: Выполните задание',
    'task.16.3.title': 'Задание 16.3',
    'task.16.3.todo': 'TODO: Выполните задание',
    'task.16.4.title': 'Задание 16.4',
    'task.16.4.todo': 'TODO: Выполните задание',

    // Level 17 — UI strings
    'task.17.1.title': 'Задание 17.1',
    'task.17.1.todo': 'TODO: Выполните задание',
    'task.17.2.title': 'Задание 17.2',
    'task.17.2.todo': 'TODO: Выполните задание',
    'task.17.3.title': 'Задание 17.3',
    'task.17.3.todo': 'TODO: Выполните задание',

    // Описания уровней
    'level.0.desc': 'Что такое CI/CD, зачем нужно, обзор инструментов',
    'level.1.desc': 'Структура .gitlab-ci.yml, stages, jobs, script, image',
    'level.2.desc': 'Состояния, allow_failure, when, timeout, retry',
    'level.3.desc': 'Предопределённые и custom-переменные, приоритеты',
    'level.4.desc': 'rules:if, rules:changes, workflow:rules, условия',
    'level.5.desc': 'artifacts, cache, expire_in, cache:key, стратегии',
    'level.6.desc': 'Shared/group/project runners, executors, tags',
    'level.7.desc': 'Пирамида тестов, services, coverage, JUnit, parallel',
    'level.8.desc': 'DinD, Kaniko, Container Registry, тегирование',
    'level.9.desc': 'Environments, review apps, manual gates, стратегии деплоя',
    'level.10.desc': 'Protected/masked variables, Vault, OIDC',
    'level.11.desc': 'include, extends, YAML-якоря, шаблоны, CI-библиотеки',
    'level.12.desc': 'needs/DAG, parent-child, multi-project, parallel:matrix',
    'level.13.desc': 'rules:changes, child pipelines, граф зависимостей',
    'level.14.desc': 'SAST, DAST, dependency/container scanning, DevSecOps',
    'level.15.desc': 'SemVer, conventional commits, changelog, releases',
    'level.16.desc': 'GitHub Actions vs GitLab CI, workflows, marketplace',
    'level.17.desc': 'Оптимизация, антипаттерны, нотификации, мониторинг',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': '📚 Levels',
    'nav.levels': 'Levels',
    'nav.level': 'Level',
    'nav.intro': 'Intro to CI/CD',
    'nav.gitlabYmlBasics': 'First .gitlab-ci.yml',
    'nav.jobsLifecycle': 'Job Lifecycle',
    'nav.variables': 'Variables in GitLab CI',
    'nav.rulesConditions': 'Rules & Conditional Execution',
    'nav.cacheArtifacts': 'Caching & Artifacts',
    'nav.runners': 'GitLab Runners',
    'nav.testingInCi': 'Testing in CI',
    'nav.dockerInCi': 'Docker in CI',
    'nav.environmentsDeploy': 'Environments & Deploy',
    'nav.secretsSecurity': 'Secrets & Security',
    'nav.includesTemplates': 'Includes & Templates',
    'nav.advancedPipelines': 'Advanced Pipelines',
    'nav.monorepo': 'Monorepos in CI/CD',
    'nav.securityScanning': 'Security Scanning',
    'nav.releases': 'Releases & Versioning',
    'nav.githubActions': 'GitHub Actions',
    'nav.bestPractices': 'Best Practices & Antipatterns',

    // Level 0
    'task.0.1': 'CI vs CD vs CD: Understanding the Terms',
    'task.0.2': 'Pipeline Anatomy',
    'task.0.3': 'CI/CD Tools Landscape',

    // Level 1
    'task.1.1': '.gitlab-ci.yml Structure',
    'task.1.2': 'Stages & Execution Order',
    'task.1.3': 'script Keyword',
    'task.1.4': 'image Keyword',

    // Level 2
    'task.2.1': 'Job States',
    'task.2.1.title': 'Job State Machine',
    'task.2.2': 'allow_failure & when',
    'task.2.2.title': 'allow_failure & when',
    'task.2.3': 'retry & timeout',

    // Level 3
    'task.3.1': 'Predefined Variables',
    'task.3.1.description': 'A catalog of variables available in every job without additional configuration.',
    'task.3.2': 'Custom Variables & Priorities',
    'task.3.2.description': 'Set APP_ENV value at different levels — find out which one wins.',
    'task.3.3': 'Using Variables in Scripts',
    'task.3.3.description': 'Write a script with variables, press "Resolve" and see the expanded result.',

    // Level 4
    'task.4.1': 'rules:if — Variable-based Conditions',
    'task.4.2': 'rules:changes — File Reactions',
    'task.4.3': 'workflow:rules — Pipeline Control',
    'task.4.4': 'Combining Rules',

    // Level 5
    'task.5.1': 'Artifacts: Passing Data Between Jobs',
    'task.5.2': 'Cache: Speeding Up Builds',
    'task.5.3': 'Cache vs Artifacts: Choosing Wisely',
    'task.5.4': 'Cache Key Strategies',

    // Level 6
    'task.6.1': 'Runner Types & Executors',
    'task.6.2': 'Tags & Job Routing',
    'task.6.3': 'Setting Up a Self-hosted Runner',

    // Level 7
    'task.7.1': 'Test Pyramid in Pipeline',
    'task.7.2': 'Services: Databases in CI',
    'task.7.3': 'Coverage & JUnit Reports',
    'task.7.4': 'Parallel Test Execution',

    // Level 8
    'task.8.1': 'Docker-in-Docker vs Kaniko',
    'task.8.2': 'Building & Pushing Images',
    'task.8.3': 'Image Tagging Strategies',

    // Level 9
    'task.9.1': 'Environments: Staging & Production',
    'task.9.2': 'Review Apps',
    'task.9.3': 'Manual Gates & Approvals',
    'task.9.4': 'Blue-green & Canary Deploy',

    // Level 10
    'task.10.1': 'Protected & Masked Variables',
    'task.10.2': 'Vault Integration',
    'task.10.3': 'OIDC & External Clouds',

    // Level 11
    'task.11.1': 'include: External Configs',
    'task.11.2': 'extends & YAML Anchors',
    'task.11.3': 'CI/CD Template Library',

    // Level 12
    'task.12.1': 'DAG Pipelines with needs',
    'task.12.2': 'Matrix Builds with parallel:matrix',
    'task.12.3': 'Child Pipelines with trigger:include',
    'task.12.4': 'Multi-project Pipelines',

    // Level 13
    'task.13.1': 'rules:changes for Monorepos',
    'task.13.2': 'Child Pipelines per Service',
    'task.13.3': 'Service Dependency Graph',

    // Level 14
    'task.14.1': 'SAST & Dependency Scanning',
    'task.14.2': 'Container Scanning & Secret Detection',
    'task.14.3': 'DAST & Security Pipeline',

    // Level 15
    'task.15.1': 'Semantic Versioning in CI',
    'task.15.2': 'Automatic Changelog',
    'task.15.3': 'Release Pipeline',

    // Level 16
    'task.16.1': 'GitHub Actions Syntax',
    'task.16.2': 'Events, Marketplace & Actions',
    'task.16.3': 'Matrix Strategy & Secrets',
    'task.16.4': 'Reusable Workflows & Composite Actions',

    // Level 17
    'task.17.1': 'Pipeline Optimization',
    'task.17.2': 'CI/CD Antipatterns',
    'task.17.3': 'Notifications & Monitoring',

    // Tasks
    'task.title': 'Task',
    'task.description': '📋 Task Description',
    'task.yourForm': '🎯 Your Result:',
    'task.placeholder': 'Your result will appear here',
    'task.openFile': 'Open file',
    'task.andComplete': 'and complete the task',
    'task.formReady': 'Task completed!',
    'task.markComplete': 'Mark as completed',
    'task.markIncomplete': 'Mark as not completed',

    // Theory & Solution
    'theory.list': '📚 Theory',
    'theory.brief': 'Brief',
    'theory.detailed': 'Detailed',
    'theory.loading': 'Loading theory...',
    'quiz.title': '🧪 Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': '✅ Correct!',
    'quiz.wrong': '❌ Incorrect',
    'solution.show': '💡 Show Solution',
    'solution.hide': '🙈 Hide Solution',

    // Theme & Language
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'To Top',

    // Level 0 - task UI strings
    'task.0.1.placeholder.phaseCard': 'Phase card — replace with phases mapping',

    // Level 0.2
    'task.0.2.placeholder.stages': 'Pipeline stages — replace with stages mapping',
    'task.0.2.reset': 'Reset',

    // Level 0.3
    'task.0.3.filter.all': 'All',
    'task.0.3.placeholder.cards': 'Tool cards — replace with filteredTools mapping',

    // Level 1.1
    'task.1.1.availableBlocks': 'Available blocks',
    'task.1.1.yourConfig': 'Your config',
    'task.1.1.check': 'Check',

    // Level 1.2
    'task.1.2.runPipeline': 'Run pipeline',
    'task.1.2.jobName': 'Job name',
    'task.1.2.addJob': 'Add job',

    // Level 1.3
    'task.1.3.runJob': 'Run job',
    'task.1.3.scenario.success': 'Success scenario',
    'task.1.3.scenario.scriptFail': 'Script error',
    'task.1.3.scenario.beforeFail': 'Before_script error',

    // Level 1.4
    'task.1.4.imageCatalog': 'Image catalog',
    'task.1.4.matchingTitle': 'Task: choose image for project',
    'task.1.4.check': 'Check',

    // Level 2.1
    'task.2.1.queue': 'Queue',
    'task.2.1.start': 'Start',
    'task.2.1.success': 'Success',
    'task.2.1.fail': 'Fail',
    'task.2.1.cancel': 'Cancel',
    'task.2.1.timeout': 'Timeout',
    'task.2.1.logEmpty': 'Transition log will appear here',
    'task.2.1.logHint': 'Click an event button to start',

    // Level 2.2
    'task.2.2.jobConfigPlaceholder': 'Job configurator will appear here',

    // Level 2.3
    'task.2.3.configuration': 'Configuration',
    'task.2.3.yamlConfig': 'YAML config',
    'task.2.3.runSimulation': 'Run simulation',
    'task.2.3.attemptsLogPlaceholder': 'Attempts log will appear here',
    'task.2.3.retryWhenPlaceholder': 'TODO: error type checkboxes',
    'task.2.3.successProbability': 'Success probability: {prob}%',

    // Level 3.1
    'task.3.1.searchPlaceholder': 'Search by name or description...',
    'task.3.1.foundCount': 'Found: {count} variables',
    'task.3.1.noResults': 'No variables found...',

    // Level 3.2
    'task.3.2.resolveWinner': 'Determine winner',
    'task.3.2.winner': 'WINNER',

    // Level 3.3
    'task.3.3.predefinedVars': 'Predefined variables:',
    'task.3.3.resolve': 'Resolve',
    'task.3.3.varName': 'NAME',
    'task.3.3.varValue': 'value',
    'task.3.3.addVar': '+ Add',

    // Level 4 — UI strings
    'task.4.1.subtitle': 'Choose a GitLab event and see which jobs will run',
    'task.4.2.subtitle': 'Mark changed files and see which CI jobs will run',
    'task.4.2.randomChanges': 'Random changes',
    'task.4.2.stats': 'Changed: {x} files | Will run: {y} jobs',
    'task.4.3.subtitle': 'Duplicate pipeline problem simulator and its solution',
    'task.4.3.withoutRules': 'Without workflow:rules',
    'task.4.3.withRules': 'With workflow:rules',
    'task.4.3.openMr': 'Open MR → main',
    'task.4.3.reset': 'Reset',
    'task.4.3.runnerMinutes': 'Runner minutes: {min}',
    'task.4.3.activePipelines': 'Active pipelines: {count}',
    'task.4.3.duplicationWarn': '⚠️ Duplication detected — pipeline runs twice!',
    'task.4.3.workflowYamlTitle': 'workflow:rules YAML',
    'task.4.3.pipelineCreated': 'Created',
    'task.4.3.pipelineBlocked': 'Blocked',
    'task.4.4.subtitle': 'Add rules, simulate events, see the resulting YAML',
    'task.4.4.presetsTitle': 'Presets',
    'task.4.4.addRule': 'Add rule',
    'task.4.4.ifPlaceholder': 'IF condition',
    'task.4.4.changesPlaceholder': 'CHANGES pattern',
    'task.4.4.add': 'Add',
    'task.4.4.testSimulator': 'Test simulator',
    'task.4.4.check': 'Check',
    'task.4.4.yamlPreview': 'YAML preview',
    'task.4.4.emptyState': 'Add a rule or load a preset',

    // Level 5 — UI strings
    'task.5.1.subtitle': 'Configure artifacts and see how data flows through the pipeline',
    'task.5.1.pipeline': 'Pipeline',
    'task.5.1.onFailureWarning': '⚠️ With on_failure, artifacts are saved only when the job fails',
    'task.5.1.artifactPaths': 'artifact:paths',
    'task.5.1.expireIn': 'artifact:expire_in',
    'task.5.1.when': 'artifact:when',
    'task.5.1.yamlOutput': 'YAML output',
    'task.5.2.subtitle': 'Pipeline simulation with and without cache. The main difference is the dependency install step.',
    'task.5.2.withoutCache': 'Without cache',
    'task.5.2.withCache': 'With cache',
    'task.5.2.runSimulation': 'Run simulation',
    'task.5.2.simulating': 'Simulating...',
    'task.5.2.savingsBanner': 'Cache saved {time}',
    'task.5.2.cacheConfig': 'Cache configuration',
    'task.5.2.cacheKeyStrategy': 'cache:key strategy',
    'task.5.2.cachePaths': 'cache:paths',
    'task.5.3.subtitle': 'Decide when to use cache vs artifacts',
    'task.5.3.question': 'Which to use?',
    'task.5.3.next': 'Next',
    'task.5.3.reset': 'Reset',
    'task.5.3.results': 'Results',
    'task.5.3.score': 'Score: {correct} of {total}',
    'task.5.3.correct': 'Correct!',
    'task.5.3.incorrect': 'Incorrect!',
    'task.5.4.subtitle': 'Choose a strategy and simulate events — see where you get cache hit or miss',
    'task.5.4.simulator': 'Event simulator',
    'task.5.4.switchBranch': 'Switch branch',
    'task.5.4.updateLockfile': 'Update lockfile',
    'task.5.4.noEvents': 'Click a button to simulate',
    'task.5.4.eventsCount': '{count} events',
    'task.5.4.prefix': 'Prefix (optional)',
    'task.5.4.prefixPlaceholder': 'e.g. v1 or node18',
    'task.5.4.yamlResult': 'Resulting YAML',
    'task.5.4.comparisonTable': 'Comparison table',
    'task.5.4.strategy': 'Strategy',
    'task.5.4.autoInvalidation': 'Auto-invalidation',
    'task.5.4.branchIsolation': 'Branch isolation',
    'task.5.4.complexity': 'Complexity',
    'task.5.4.yes': 'Yes',
    'task.5.4.no': 'No',

    // Level 6 — UI strings
    'task.6.1.title': 'GitLab Runner Executors Catalog',
    'task.6.1.filterAll': 'All',
    'task.6.1.filterIsolation': 'Isolation',
    'task.6.1.useCases': 'Use cases',
    'task.6.1.configExample': 'config.toml example',
    'task.6.1.comparisonTable': 'Comparison table',
    'task.6.1.isolation': 'Isolation',
    'task.6.1.speed': 'Speed',
    'task.6.1.complexity': 'Complexity',
    'task.6.1.needsDocker': 'Needs Docker',
    'task.6.2.title': 'Job Routing Simulator',
    'task.6.2.runRouting': 'Run routing',
    'task.6.2.reset': 'Reset',
    'task.6.2.runners': 'Runners',
    'task.6.2.jobs': 'Jobs',
    'task.6.2.runUntagged': 'run_untagged',
    'task.6.2.addTag': '+ Add tag',
    'task.6.2.noRunner': 'No matching runner',
    'task.6.2.missingTags': 'Missing tags',
    'task.6.2.routingRule': 'A runner takes a job only if it has ALL of its tags. Untagged jobs are taken by runners with run_untagged=true.',
    'task.6.2.tagPlaceholder': 'New tag',
    'task.6.3.title': 'GitLab Runner Registration Wizard',
    'task.6.3.next': 'Next',
    'task.6.3.back': 'Back',
    'task.6.3.copy': 'Copy',
    'task.6.3.copied': 'Copied!',
    'task.6.3.command': 'Command',
    'task.6.3.config': 'config.toml',
    'task.6.3.urlLabel': 'GitLab URL',
    'task.6.3.urlHint': 'Your GitLab instance URL',
    'task.6.3.tokenLabel': 'Registration Token',
    'task.6.3.tokenHint': 'Find the token in Settings → CI/CD → Runners',
    'task.6.3.executorLabel': 'Choose executor',
    'task.6.3.tagsLabel': 'Runner tags',
    'task.6.3.tagSuggestions': 'Popular tags: docker, linux, windows, kubernetes, shell, production, staging',
    'task.6.3.settingsLabel': 'Executor settings',
    'task.6.3.dockerImage': 'Docker Image',
    'task.6.3.dockerPrivileged': 'Privileged mode',
    'task.6.3.k8sNamespace': 'Kubernetes Namespace',
    'task.6.3.k8sImage': 'Kubernetes Helper Image',

    // Level 7 — UI strings
    'task.7.1.title': 'Task 7.1',
    'task.7.1.todo': 'TODO: Complete the task',
    'task.7.2.title': 'Task 7.2',
    'task.7.2.todo': 'TODO: Complete the task',
    'task.7.3.title': 'Task 7.3',
    'task.7.3.todo': 'TODO: Complete the task',
    'task.7.4.title': 'Task 7.4',
    'task.7.4.todo': 'TODO: Complete the task',

    // Level 14 — UI strings
    'task.14.1.title': 'Task 14.1',
    'task.14.1.todo': 'TODO: Complete the task',
    'task.14.2.title': 'Task 14.2',
    'task.14.2.todo': 'TODO: Complete the task',
    'task.14.3.title': 'Task 14.3',
    'task.14.3.todo': 'TODO: Complete the task',

    // Level 15 — UI strings
    'task.15.1.title': 'Task 15.1',
    'task.15.1.todo': 'TODO: Complete the task',
    'task.15.2.title': 'Task 15.2',
    'task.15.2.todo': 'TODO: Complete the task',
    'task.15.3.title': 'Task 15.3',
    'task.15.3.todo': 'TODO: Complete the task',

    // Level 16 — UI strings
    'task.16.1.title': 'Task 16.1',
    'task.16.1.todo': 'TODO: Complete the task',
    'task.16.2.title': 'Task 16.2',
    'task.16.2.todo': 'TODO: Complete the task',
    'task.16.3.title': 'Task 16.3',
    'task.16.3.todo': 'TODO: Complete the task',
    'task.16.4.title': 'Task 16.4',
    'task.16.4.todo': 'TODO: Complete the task',

    // Level 17 — UI strings
    'task.17.1.title': 'Task 17.1',
    'task.17.1.todo': 'TODO: Complete the task',
    'task.17.2.title': 'Task 17.2',
    'task.17.2.todo': 'TODO: Complete the task',
    'task.17.3.title': 'Task 17.3',
    'task.17.3.todo': 'TODO: Complete the task',

    // Level descriptions
    'level.0.desc': 'What is CI/CD, why it matters, tools overview',
    'level.1.desc': '.gitlab-ci.yml structure, stages, jobs, script, image',
    'level.2.desc': 'States, allow_failure, when, timeout, retry',
    'level.3.desc': 'Predefined and custom variables, priorities',
    'level.4.desc': 'rules:if, rules:changes, workflow:rules, conditions',
    'level.5.desc': 'artifacts, cache, expire_in, cache:key, strategies',
    'level.6.desc': 'Shared/group/project runners, executors, tags',
    'level.7.desc': 'Test pyramid, services, coverage, JUnit, parallel',
    'level.8.desc': 'DinD, Kaniko, Container Registry, tagging',
    'level.9.desc': 'Environments, review apps, manual gates, deploy strategies',
    'level.10.desc': 'Protected/masked variables, Vault, OIDC',
    'level.11.desc': 'include, extends, YAML anchors, templates, CI libraries',
    'level.12.desc': 'needs/DAG, parent-child, multi-project, parallel:matrix',
    'level.13.desc': 'rules:changes, child pipelines, dependency graph',
    'level.14.desc': 'SAST, DAST, dependency/container scanning, DevSecOps',
    'level.15.desc': 'SemVer, conventional commits, changelog, releases',
    'level.16.desc': 'GitHub Actions vs GitLab CI, workflows, marketplace',
    'level.17.desc': 'Optimization, antipatterns, notifications, monitoring',
  },
}
