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
    'nav.whyMicroFrontends': 'Зачем микрофронтенды',
    'nav.architecturePatterns': 'Паттерны архитектуры',
    'nav.moduleFederationBasics': 'Module Federation: основы',
    'nav.moduleFederationAdvanced': 'Module Federation: продвинутый',
    'nav.singleSpaOrchestration': 'Single-SPA оркестрация',
    'nav.webComponentsContracts': 'Web Components как контракт',
    'nav.sharedDependencies': 'Общие зависимости',
    'nav.routingBetweenApps': 'Роутинг между приложениями',
    'nav.communicationPatterns': 'Коммуникация между MFE',
    'nav.designSystemIntegration': 'Дизайн-система и стили',
    'nav.deployAndVersioning': 'Деплой и версионирование',
    'nav.testingStrategies': 'Тестирование MFE',
    'nav.monitoringObservability': 'Мониторинг и наблюдаемость',
    'nav.migrationFromMonolith': 'Миграция из монолита',
    'nav.dxAndTooling': 'DX и инструментарий',
    'nav.capstoneArchitecture': 'Capstone: проектирование',

    // Уровень 0 — Зачем микрофронтенды
    'task.0.1': 'Визуализатор: монолит vs микрофронтенды',
    'task.0.2': 'Аудит готовности к MFE',

    // Уровень 1 — Паттерны архитектуры
    'task.1.1': 'Визуализатор: топология MFE',
    'task.1.2': 'Конструктор ADR',

    // Уровень 2 — Module Federation: основы
    'task.2.1': 'Визуализатор: lifecycle загрузки remote',
    'task.2.2': 'Конструктор: конфиг host',
    'task.2.3': 'Конструктор: конфиг remote',

    // Уровень 3 — Module Federation: продвинутый
    'task.3.1': 'Симулятор: версионные конфликты',
    'task.3.2': 'Конструктор: реестр remote',

    // Уровень 4 — Single-SPA оркестрация
    'task.4.1': 'Визуализатор: lifecycle Single-SPA',
    'task.4.2': 'Конструктор: root config',
    'task.4.3': 'Decision matrix: MF vs Single-SPA',

    // Уровень 5 — Web Components как контракт
    'task.5.1': 'Визуализатор: Shadow DOM изоляция',
    'task.5.2': 'Конструктор: контракт Web Component',

    // Уровень 6 — Общие зависимости
    'task.6.1': 'Визуализатор: граф зависимостей',
    'task.6.2': 'Конструктор: import map',

    // Уровень 7 — Роутинг между приложениями
    'task.7.1': 'Симулятор: навигация между MFE',
    'task.7.2': 'Конструктор: таблица маршрутов',

    // Уровень 8 — Коммуникация между MFE
    'task.8.1': 'Визуализатор: event bus',
    'task.8.2': 'Конструктор: event contract',
    'task.8.3': 'Выбор паттерна коммуникации',

    // Уровень 9 — Дизайн-система и стили
    'task.9.1': 'Визуализатор: CSS-конфликты',
    'task.9.2': 'Конструктор: design tokens',

    // Уровень 10 — Деплой и версионирование
    'task.10.1': 'Симулятор: deploy pipeline',
    'task.10.2': 'Конструктор: стратегия версионирования',

    // Уровень 11 — Тестирование MFE
    'task.11.1': 'Визуализатор: пирамида тестирования',
    'task.11.2': 'Конструктор: тест-план',

    // Уровень 12 — Мониторинг и наблюдаемость
    'task.12.1': 'Симулятор: error boundary и circuit breaker',
    'task.12.2': 'Конструктор: мониторинг-конфигурация',

    // Уровень 13 — Миграция из монолита
    'task.13.1': 'Визуализатор: Strangler Fig',
    'task.13.2': 'Конструктор: план миграции',

    // Уровень 14 — DX и инструментарий
    'task.14.1': 'Визуализатор: monorepo vs polyrepo',
    'task.14.2': 'Конструктор: workspace конфигурация',

    // Уровень 15 — Capstone
    'task.15.1': 'Визуализатор: архитектура MFE-платформы',
    'task.15.2': 'Мастер-конструктор: архитектурный документ',
    'task.15.3': 'Decision matrix: выбор технологий',

    // UI платформы
    'task.title': 'Задание',
    'task.description': '📋 Описание задания',
    'task.placeholder': 'Ваш результат появится здесь',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',
    'theory.title': '📚 Теория',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Развёрнуто',
    'theory.notFound': 'Теория не найдена',
    'solution.show': '💡 Показать решение',
    'solution.hide': '🙈 Скрыть решение',
    'quiz.title': '🧪 Тест по теории',
    'quiz.submit': 'Ответить',
    'quiz.correct': '✅ Правильно!',
    'quiz.wrong': '❌ Неправильно',
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Наверх',

    // Описания уровней
    'level.0.desc': 'Когда монолит не работает, зачем разделять фронтенд, обзор подходов',
    'level.1.desc': 'Vertical vs horizontal split, shell + remote, композиция на клиенте и сервере',
    'level.2.desc': 'Host, remote, shared, exposes — конфигурация vite-plugin-federation',
    'level.3.desc': 'Dynamic remotes, версионирование shared, fallback, типизация',
    'level.4.desc': 'Root config, lifecycle, activity functions, parcels, single-spa-layout',
    'level.5.desc': 'Custom Elements, Shadow DOM, CSS Custom Properties, CustomEvent',
    'level.6.desc': 'Import maps, singleton, eager, externals, CDN, стратегия шаринга',
    'level.7.desc': 'Shell-router, nested routing, конфликты pushState, deep linking',
    'level.8.desc': 'Custom Events, event bus, shared state, анти-паттерны связности',
    'level.9.desc': 'CSS изоляция, design tokens, версионирование дизайн-системы',
    'level.10.desc': 'Независимый деплой, canary, rollback, CDN и кэширование',
    'level.11.desc': 'Contract testing, mock remote, E2E, visual regression',
    'level.12.desc': 'Error boundaries, Sentry ownership, Web Vitals, circuit breaker',
    'level.13.desc': 'Strangler Fig Pattern, постепенная миграция, shared state переходного периода',
    'level.14.desc': 'Monorepo vs polyrepo, Nx/Turborepo, локальная разработка, scaffolding',
    'level.15.desc': 'Проектирование полной MFE-платформы, checklist архитектора, будущее MFE',
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
    'nav.whyMicroFrontends': 'Why Micro Frontends',
    'nav.architecturePatterns': 'Architecture Patterns',
    'nav.moduleFederationBasics': 'Module Federation: Basics',
    'nav.moduleFederationAdvanced': 'Module Federation: Advanced',
    'nav.singleSpaOrchestration': 'Single-SPA Orchestration',
    'nav.webComponentsContracts': 'Web Components as Contract',
    'nav.sharedDependencies': 'Shared Dependencies',
    'nav.routingBetweenApps': 'Routing Between Apps',
    'nav.communicationPatterns': 'MFE Communication',
    'nav.designSystemIntegration': 'Design System & Styles',
    'nav.deployAndVersioning': 'Deploy & Versioning',
    'nav.testingStrategies': 'Testing MFE',
    'nav.monitoringObservability': 'Monitoring & Observability',
    'nav.migrationFromMonolith': 'Migration from Monolith',
    'nav.dxAndTooling': 'DX & Tooling',
    'nav.capstoneArchitecture': 'Capstone: Architecture',

    // Level 0 — Why Micro Frontends
    'task.0.1': 'Visualizer: monolith vs micro frontends',
    'task.0.2': 'MFE readiness audit',

    // Level 1 — Architecture Patterns
    'task.1.1': 'Visualizer: MFE topology',
    'task.1.2': 'ADR builder',

    // Level 2 — Module Federation: Basics
    'task.2.1': 'Visualizer: remote loading lifecycle',
    'task.2.2': 'Builder: host config',
    'task.2.3': 'Builder: remote config',

    // Level 3 — Module Federation: Advanced
    'task.3.1': 'Simulator: shared version conflicts',
    'task.3.2': 'Builder: remote registry',

    // Level 4 — Single-SPA Orchestration
    'task.4.1': 'Visualizer: Single-SPA lifecycle',
    'task.4.2': 'Builder: root config',
    'task.4.3': 'Decision matrix: MF vs Single-SPA',

    // Level 5 — Web Components as Contract
    'task.5.1': 'Visualizer: Shadow DOM isolation',
    'task.5.2': 'Builder: Web Component contract',

    // Level 6 — Shared Dependencies
    'task.6.1': 'Visualizer: dependency graph',
    'task.6.2': 'Builder: import map',

    // Level 7 — Routing Between Apps
    'task.7.1': 'Simulator: MFE navigation',
    'task.7.2': 'Builder: route table',

    // Level 8 — MFE Communication
    'task.8.1': 'Visualizer: event bus',
    'task.8.2': 'Builder: event contract',
    'task.8.3': 'Communication pattern selection',

    // Level 9 — Design System & Styles
    'task.9.1': 'Visualizer: CSS conflicts',
    'task.9.2': 'Builder: design tokens',

    // Level 10 — Deploy & Versioning
    'task.10.1': 'Simulator: deploy pipeline',
    'task.10.2': 'Builder: versioning strategy',

    // Level 11 — Testing MFE
    'task.11.1': 'Visualizer: testing pyramid',
    'task.11.2': 'Builder: test plan',

    // Level 12 — Monitoring & Observability
    'task.12.1': 'Simulator: error boundary & circuit breaker',
    'task.12.2': 'Builder: monitoring configuration',

    // Level 13 — Migration from Monolith
    'task.13.1': 'Visualizer: Strangler Fig',
    'task.13.2': 'Builder: migration plan',

    // Level 14 — DX & Tooling
    'task.14.1': 'Visualizer: monorepo vs polyrepo',
    'task.14.2': 'Builder: workspace configuration',

    // Level 15 — Capstone
    'task.15.1': 'Visualizer: MFE platform architecture',
    'task.15.2': 'Master builder: architecture document',
    'task.15.3': 'Decision matrix: technology selection',

    // Platform UI
    'task.title': 'Task',
    'task.description': '📋 Task Description',
    'task.placeholder': 'Your result will appear here',
    'task.markComplete': 'Mark as complete',
    'task.markIncomplete': 'Mark as incomplete',
    'theory.title': '📚 Theory',
    'theory.brief': 'Brief',
    'theory.detailed': 'Detailed',
    'theory.notFound': 'Theory not found',
    'solution.show': '💡 Show solution',
    'solution.hide': '🙈 Hide solution',
    'quiz.title': '🧪 Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': '✅ Correct!',
    'quiz.wrong': '❌ Incorrect',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Back to top',

    // Level descriptions
    'level.0.desc': 'When monolith fails, why split the frontend, overview of approaches',
    'level.1.desc': 'Vertical vs horizontal split, shell + remote, client and server composition',
    'level.2.desc': 'Host, remote, shared, exposes — vite-plugin-federation configuration',
    'level.3.desc': 'Dynamic remotes, shared versioning, fallback, typing',
    'level.4.desc': 'Root config, lifecycle, activity functions, parcels, single-spa-layout',
    'level.5.desc': 'Custom Elements, Shadow DOM, CSS Custom Properties, CustomEvent',
    'level.6.desc': 'Import maps, singleton, eager, externals, CDN, sharing strategy',
    'level.7.desc': 'Shell-router, nested routing, pushState conflicts, deep linking',
    'level.8.desc': 'Custom Events, event bus, shared state, coupling anti-patterns',
    'level.9.desc': 'CSS isolation, design tokens, design system versioning',
    'level.10.desc': 'Independent deploy, canary, rollback, CDN and caching',
    'level.11.desc': 'Contract testing, mock remote, E2E, visual regression',
    'level.12.desc': 'Error boundaries, Sentry ownership, Web Vitals, circuit breaker',
    'level.13.desc': 'Strangler Fig Pattern, gradual migration, transitional shared state',
    'level.14.desc': 'Monorepo vs polyrepo, Nx/Turborepo, local development, scaffolding',
    'level.15.desc': 'Designing a full MFE platform, architect checklist, future of MFE',
  },
}
