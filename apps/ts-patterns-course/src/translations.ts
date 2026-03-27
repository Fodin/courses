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
    'nav.typeContracts': 'Типы как контракты',
    'nav.creational': 'Порождающие',
    'nav.structural': 'Структурные',
    'nav.behavioral': 'Поведенческие',
    'nav.composition': 'Композиция',
    'nav.dataManagement': 'Управление данными',
    'nav.errorResults': 'Обработка результатов',
    'nav.modular': 'Модульная архитектура',
    'nav.advancedTs': 'Продвинутые паттерны',

    // Задания уровня 0
    'task.0.1': 'Branded Types',
    'task.0.2': 'Type Guards',
    'task.0.3': 'Discriminated Unions',

    // Задания уровня 1
    'task.1.1': 'Factory Method',
    'task.1.2': 'Abstract Factory',
    'task.1.3': 'Builder',
    'task.1.4': 'Singleton',

    // Задания уровня 2
    'task.2.1': 'Adapter',
    'task.2.2': 'Decorator',
    'task.2.3': 'Facade',
    'task.2.4': 'Proxy',

    // Задания уровня 3
    'task.3.1': 'Strategy',
    'task.3.2': 'Observer',
    'task.3.3': 'Command',
    'task.3.4': 'Chain of Responsibility',

    // Задания уровня 4
    'task.4.1': 'Pipe и Compose',
    'task.4.2': 'Middleware',
    'task.4.3': 'Plugin System',

    // Задания уровня 5
    'task.5.1': 'Repository',
    'task.5.2': 'Unit of Work',
    'task.5.3': 'CQRS',
    'task.5.4': 'Event Sourcing',

    // Задания уровня 6
    'task.6.1': 'Result / Either',
    'task.6.2': 'Validation',
    'task.6.3': 'Option / Maybe',

    // Задания уровня 7
    'task.7.1': 'Dependency Injection',
    'task.7.2': 'Ports & Adapters',
    'task.7.3': 'Clean Architecture',
    'task.7.4': 'Module Contracts',

    // Задания уровня 8
    'task.8.1': 'Type-safe Builder',
    'task.8.2': 'Phantom Types',
    'task.8.3': 'Type-level State Machine',
    'task.8.4': 'Effect Pattern',

    // Задания
    'task.title': 'Задание',
    'task.description': '📋 Описание задания',
    'task.yourForm': '🎯 Ваш компонент:',
    'task.placeholder': 'Ваш компонент появится здесь',
    'task.openFile': 'Откройте файл',
    'task.andComplete': 'и выполните задание',
    'task.formReady': 'Компонент реализован!',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',
    'task.stats.fields': 'Количество полей',
    'task.stats.field': 'поле',
    'task.stats.buttons': 'кнопок',
    'task.stats.button': 'кнопка',
    'task.stats.submitButton': 'Кнопка отправки',
    'task.stats.validation': 'Валидация',
    'task.stats.hasValidation': 'Форма имеет валидацию',

    // Теория
    'theory.title': '📚 Теория',
    'theory.loading': 'Загрузка теории...',

    // Решение
    'solution.show': '💡 Показать решение',
    'solution.hide': '🙈 Скрыть решение',

    // Тема
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',

    // Язык
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',

    // Прокрутка
    'scroll.top': 'Наверх',

    // Уровни (описания)
    'level.0.desc': 'Branded types, type guards, unions',
    'level.1.desc': 'Factory, Builder, Singleton',
    'level.2.desc': 'Adapter, Decorator, Facade, Proxy',
    'level.3.desc': 'Strategy, Observer, Command',
    'level.4.desc': 'Pipe, Middleware, Plugins',
    'level.5.desc': 'Repository, CQRS, Event Sourcing',
    'level.6.desc': 'Result, Validation, Option',
    'level.7.desc': 'DI, Ports & Adapters, Clean Arch',
    'level.8.desc': 'Phantom types, State Machine, Effects',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': '📚 Levels',
    'nav.level': 'Level',
    'nav.typeContracts': 'Types as Contracts',
    'nav.creational': 'Creational',
    'nav.structural': 'Structural',
    'nav.behavioral': 'Behavioral',
    'nav.composition': 'Composition',
    'nav.dataManagement': 'Data Management',
    'nav.errorResults': 'Error Results',
    'nav.modular': 'Modular Architecture',
    'nav.advancedTs': 'Advanced Patterns',

    // Tasks Level 0
    'task.0.1': 'Branded Types',
    'task.0.2': 'Type Guards',
    'task.0.3': 'Discriminated Unions',

    // Tasks Level 1
    'task.1.1': 'Factory Method',
    'task.1.2': 'Abstract Factory',
    'task.1.3': 'Builder',
    'task.1.4': 'Singleton',

    // Tasks Level 2
    'task.2.1': 'Adapter',
    'task.2.2': 'Decorator',
    'task.2.3': 'Facade',
    'task.2.4': 'Proxy',

    // Tasks Level 3
    'task.3.1': 'Strategy',
    'task.3.2': 'Observer',
    'task.3.3': 'Command',
    'task.3.4': 'Chain of Responsibility',

    // Tasks Level 4
    'task.4.1': 'Pipe & Compose',
    'task.4.2': 'Middleware',
    'task.4.3': 'Plugin System',

    // Tasks Level 5
    'task.5.1': 'Repository',
    'task.5.2': 'Unit of Work',
    'task.5.3': 'CQRS',
    'task.5.4': 'Event Sourcing',

    // Tasks Level 6
    'task.6.1': 'Result / Either',
    'task.6.2': 'Validation',
    'task.6.3': 'Option / Maybe',

    // Tasks Level 7
    'task.7.1': 'Dependency Injection',
    'task.7.2': 'Ports & Adapters',
    'task.7.3': 'Clean Architecture',
    'task.7.4': 'Module Contracts',

    // Tasks Level 8
    'task.8.1': 'Type-safe Builder',
    'task.8.2': 'Phantom Types',
    'task.8.3': 'Type-level State Machine',
    'task.8.4': 'Effect Pattern',

    // Tasks
    'task.title': 'Task',
    'task.description': '📋 Task Description',
    'task.yourForm': '🎯 Your Component:',
    'task.placeholder': 'Your component will appear here',
    'task.openFile': 'Open file',
    'task.andComplete': 'and complete the task',
    'task.formReady': 'Component implemented!',
    'task.markComplete': 'Mark as completed',
    'task.markIncomplete': 'Mark as not completed',
    'task.stats.fields': 'Number of fields',
    'task.stats.field': 'field',
    'task.stats.buttons': 'buttons',
    'task.stats.button': 'button',
    'task.stats.submitButton': 'Submit button',
    'task.stats.validation': 'Validation',
    'task.stats.hasValidation': 'Form has validation',

    // Theory
    'theory.title': '📚 Theory',
    'theory.loading': 'Loading theory...',

    // Solution
    'solution.show': '💡 Show Solution',
    'solution.hide': '🙈 Hide Solution',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',

    // Language
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',

    // Scroll
    'scroll.top': 'To Top',

    // Levels (descriptions)
    'level.0.desc': 'Branded types, type guards, unions',
    'level.1.desc': 'Factory, Builder, Singleton',
    'level.2.desc': 'Adapter, Decorator, Facade, Proxy',
    'level.3.desc': 'Strategy, Observer, Command',
    'level.4.desc': 'Pipe, Middleware, Plugins',
    'level.5.desc': 'Repository, CQRS, Event Sourcing',
    'level.6.desc': 'Result, Validation, Option',
    'level.7.desc': 'DI, Ports & Adapters, Clean Arch',
    'level.8.desc': 'Phantom types, State Machine, Effects',
  },
}
