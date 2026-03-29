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
    'nav.strictApiContracts': 'Строгие API-контракты',
    'nav.typeSafeEvents': 'Типобезопасные события',
    'nav.builderPatterns': 'Типобезопасные билдеры',
    'nav.dependencyInjection': 'Продвинутый DI',
    'nav.exhaustiveMatching': 'Исчерпывающий pattern matching',
    'nav.domainModeling': 'Доменное моделирование',
    'nav.stateMachines': 'Типобезопасные автоматы',
    'nav.middlewarePipelines': 'Middleware и пайплайны',
    'nav.serialization': 'Типобезопасная сериализация',
    'nav.errorArchitecture': 'Архитектура ошибок',
    'nav.moduleBoundaries': 'Границы модулей',
    'nav.configurationAndEnv': 'Типобезопасная конфигурация',
    'nav.testingTypes': 'Утилиты для тестирования',
    'nav.capstoneIntegration': 'Capstone: полная архитектура',

    // Уровень 0 — Strict API Contracts
    'task.0.1': 'Типобезопасный HTTP-клиент',
    'task.0.2': 'Маппинг ответов',
    'task.0.3': 'Версионирование API',
    'task.0.4': 'Query-параметры',
    'task.0.5': 'Контрактное тестирование',

    // Уровень 1 — Type-Safe Event Systems
    'task.1.1': 'Типизированный Event Emitter',
    'task.1.2': 'Event Bus',
    'task.1.3': 'Типизация DOM-событий',
    'task.1.4': 'Основы Event Sourcing',

    // Уровень 2 — Type-Safe Builders
    'task.2.1': 'Step Builder',
    'task.2.2': 'Accumulating Builder',
    'task.2.3': 'Условные методы билдера',

    // Уровень 3 — Advanced DI with Types
    'task.3.1': 'DI-контейнер',
    'task.3.2': 'Injection Tokens',
    'task.3.3': 'Scoped-зависимости',
    'task.3.4': 'Auto-Wiring',

    // Уровень 4 — Exhaustive Pattern Matching
    'task.4.1': 'Match-выражение',
    'task.4.2': 'Variant Types',
    'task.4.3': 'Извлечение паттернов',

    // Уровень 5 — Domain Modeling with Types
    'task.5.1': 'Value Objects',
    'task.5.2': 'Entities и Aggregates',
    'task.5.3': 'Доменные события',
    'task.5.4': 'Спецификации',
    'task.5.5': 'Invariant Types',

    // Уровень 6 — Type-Safe State Machines
    'task.6.1': 'Переходы состояний',
    'task.6.2': 'Ассоциация данных с состояниями',
    'task.6.3': 'Иерархические состояния',
    'task.6.4': 'Сужение состояний',

    // Уровень 7 — Middleware and Pipelines
    'task.7.1': 'Цепочка middleware',
    'task.7.2': 'Накопление контекста',
    'task.7.3': 'Интерцепторы',
    'task.7.4': 'Архитектура плагинов',

    // Уровень 8 — Type-Safe Serialization
    'task.8.1': 'Вывод типов из схемы',
    'task.8.2': 'Паттерн Codec',
    'task.8.3': 'Миграции данных',

    // Уровень 9 — Error Architecture
    'task.9.1': 'Иерархия ошибок',
    'task.9.2': 'Error Boundaries',
    'task.9.3': 'Проброс ошибок',
    'task.9.4': 'Стратегии восстановления',

    // Уровень 10 — Module Boundaries
    'task.10.1': 'Публичная API-поверхность',
    'task.10.2': 'Межмодульные контракты',
    'task.10.3': 'Инверсия зависимостей',

    // Уровень 11 — Type-Safe Configuration
    'task.11.1': 'Загрузчик конфигурации',
    'task.11.2': 'Feature Flags',
    'task.11.3': 'Типы окружений',

    // Уровень 12 — Testing Utilities
    'task.12.1': 'Типизированные моки',
    'task.12.2': 'Type-Safe Fixtures',
    'task.12.3': 'Контрактные тесты',

    // Уровень 13 — Capstone: Full Architecture
    'task.13.1': 'Domain Layer',
    'task.13.2': 'Application Layer',
    'task.13.3': 'Infrastructure Layer',
    'task.13.4': 'API Layer',
    'task.13.5': 'Полная интеграция',

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

    // Статистика
    'task.stats.fields': 'Количество полей',
    'task.stats.field': 'поле',
    'task.stats.buttons': 'кнопок',
    'task.stats.button': 'кнопка',
    'task.stats.submitButton': 'Кнопка отправки',
    'task.stats.validation': 'Валидация',
    'task.stats.hasValidation': 'Форма имеет валидацию',

    // Теория и решение
    'theory.title': '📚 Теория',
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

    // Описания уровней
    'level.0.desc': 'HTTP-клиент, маппинг, версионирование, query-параметры, контракты',
    'level.1.desc': 'Event Emitter, Event Bus, DOM-события, Event Sourcing',
    'level.2.desc': 'Step Builder, Accumulating Builder, условные методы',
    'level.3.desc': 'DI-контейнер, токены, scoped-зависимости, auto-wiring',
    'level.4.desc': 'Match-выражения, variant types, извлечение паттернов',
    'level.5.desc': 'Value Objects, Entities, Aggregates, спецификации, инварианты',
    'level.6.desc': 'Переходы, данные состояний, иерархия, сужение типов',
    'level.7.desc': 'Middleware-цепочки, контекст, интерцепторы, плагины',
    'level.8.desc': 'Вывод типов из схемы, Codec, миграции данных',
    'level.9.desc': 'Иерархия ошибок, boundaries, проброс, восстановление',
    'level.10.desc': 'Публичный API, межмодульные контракты, инверсия зависимостей',
    'level.11.desc': 'Загрузчик конфигурации, feature flags, типы окружений',
    'level.12.desc': 'Типизированные моки, fixtures, контрактные тесты',
    'level.13.desc': 'Domain, Application, Infrastructure, API — полная интеграция',
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
    'nav.strictApiContracts': 'Strict API Contracts',
    'nav.typeSafeEvents': 'Type-Safe Event Systems',
    'nav.builderPatterns': 'Type-Safe Builders',
    'nav.dependencyInjection': 'Advanced DI with Types',
    'nav.exhaustiveMatching': 'Exhaustive Pattern Matching',
    'nav.domainModeling': 'Domain Modeling with Types',
    'nav.stateMachines': 'Type-Safe State Machines',
    'nav.middlewarePipelines': 'Middleware & Pipelines',
    'nav.serialization': 'Type-Safe Serialization',
    'nav.errorArchitecture': 'Error Architecture',
    'nav.moduleBoundaries': 'Module Boundaries',
    'nav.configurationAndEnv': 'Type-Safe Configuration',
    'nav.testingTypes': 'Testing Utilities',
    'nav.capstoneIntegration': 'Capstone: Full Architecture',

    // Level 0 — Strict API Contracts
    'task.0.1': 'Type-Safe HTTP Client',
    'task.0.2': 'Response Mapping',
    'task.0.3': 'API Versioning',
    'task.0.4': 'Query Parameters',
    'task.0.5': 'Contract Testing',

    // Level 1 — Type-Safe Event Systems
    'task.1.1': 'Typed Event Emitter',
    'task.1.2': 'Event Bus',
    'task.1.3': 'DOM Events Typing',
    'task.1.4': 'Event Sourcing Basics',

    // Level 2 — Type-Safe Builders
    'task.2.1': 'Step Builder',
    'task.2.2': 'Accumulating Builder',
    'task.2.3': 'Conditional Builder Methods',

    // Level 3 — Advanced DI with Types
    'task.3.1': 'DI Container',
    'task.3.2': 'Injection Tokens',
    'task.3.3': 'Scoped Dependencies',
    'task.3.4': 'Auto-Wiring',

    // Level 4 — Exhaustive Pattern Matching
    'task.4.1': 'Match Expression',
    'task.4.2': 'Variant Types',
    'task.4.3': 'Pattern Extraction',

    // Level 5 — Domain Modeling with Types
    'task.5.1': 'Value Objects',
    'task.5.2': 'Entities & Aggregates',
    'task.5.3': 'Domain Events',
    'task.5.4': 'Specifications',
    'task.5.5': 'Invariant Types',

    // Level 6 — Type-Safe State Machines
    'task.6.1': 'State Transitions',
    'task.6.2': 'State Data Association',
    'task.6.3': 'Hierarchical States',
    'task.6.4': 'State Narrowing',

    // Level 7 — Middleware and Pipelines
    'task.7.1': 'Middleware Chain',
    'task.7.2': 'Context Accumulation',
    'task.7.3': 'Interceptors',
    'task.7.4': 'Plugin Architecture',

    // Level 8 — Type-Safe Serialization
    'task.8.1': 'Schema Inference',
    'task.8.2': 'Codec Pattern',
    'task.8.3': 'Data Migrations',

    // Level 9 — Error Architecture
    'task.9.1': 'Error Hierarchy',
    'task.9.2': 'Error Boundaries',
    'task.9.3': 'Error Propagation',
    'task.9.4': 'Recovery Strategies',

    // Level 10 — Module Boundaries
    'task.10.1': 'Public API Surface',
    'task.10.2': 'Cross-Module Contracts',
    'task.10.3': 'Dependency Inversion',

    // Level 11 — Type-Safe Configuration
    'task.11.1': 'Config Loader',
    'task.11.2': 'Feature Flags',
    'task.11.3': 'Environment Types',

    // Level 12 — Testing Utilities
    'task.12.1': 'Typed Mocks',
    'task.12.2': 'Type-Safe Fixtures',
    'task.12.3': 'Contract Tests',

    // Level 13 — Capstone: Full Architecture
    'task.13.1': 'Domain Layer',
    'task.13.2': 'Application Layer',
    'task.13.3': 'Infrastructure Layer',
    'task.13.4': 'API Layer',
    'task.13.5': 'Full Wiring',

    // Tasks
    'task.title': 'Task',
    'task.description': '📋 Task Description',
    'task.yourForm': '🎯 Your Result:',
    'task.placeholder': 'Your result will appear here',
    'task.openFile': 'Open file',
    'task.andComplete': 'and complete the task',
    'task.formReady': 'Task completed!',
    'task.markComplete': 'Mark as completed',
    'task.markIncomplete': 'Mark as incomplete',

    // Stats
    'task.stats.fields': 'Number of fields',
    'task.stats.field': 'field',
    'task.stats.buttons': 'buttons',
    'task.stats.button': 'button',
    'task.stats.submitButton': 'Submit button',
    'task.stats.validation': 'Validation',
    'task.stats.hasValidation': 'Form has validation',

    // Theory and solution
    'theory.title': '📚 Theory',
    'theory.loading': 'Loading theory...',
    'quiz.title': '🧪 Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': '✅ Correct!',
    'quiz.wrong': '❌ Incorrect',
    'solution.show': '💡 Show Solution',
    'solution.hide': '🙈 Hide Solution',

    // Theme and language
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'To Top',

    // Level descriptions
    'level.0.desc': 'HTTP client, response mapping, versioning, query params, contracts',
    'level.1.desc': 'Event Emitter, Event Bus, DOM events, Event Sourcing',
    'level.2.desc': 'Step Builder, Accumulating Builder, conditional methods',
    'level.3.desc': 'DI container, tokens, scoped dependencies, auto-wiring',
    'level.4.desc': 'Match expressions, variant types, pattern extraction',
    'level.5.desc': 'Value Objects, Entities, Aggregates, specifications, invariants',
    'level.6.desc': 'Transitions, state data, hierarchy, type narrowing',
    'level.7.desc': 'Middleware chains, context, interceptors, plugins',
    'level.8.desc': 'Schema type inference, Codec pattern, data migrations',
    'level.9.desc': 'Error hierarchy, boundaries, propagation, recovery',
    'level.10.desc': 'Public API, cross-module contracts, dependency inversion',
    'level.11.desc': 'Config loader, feature flags, environment types',
    'level.12.desc': 'Typed mocks, fixtures, contract tests',
    'level.13.desc': 'Domain, Application, Infrastructure, API — full integration',
  },
}
