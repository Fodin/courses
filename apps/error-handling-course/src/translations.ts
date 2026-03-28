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
    'nav.basics': 'Основы',
    'nav.errorTypes': 'Типы ошибок',
    'nav.promises': 'Promise ошибки',
    'nav.asyncAwait': 'async/await',
    'nav.tsPatterns': 'TS паттерны',
    'nav.boundaries': 'Error Boundaries',
    'nav.dataFetching': 'Загрузка данных',
    'nav.forms': 'Формы и ввод',
    'nav.global': 'Глобальная обработка',
    'nav.advanced': 'Продвинутые техники',

    // Задания уровня 0
    'task.0.1': 'Первый try/catch',
    'task.0.2': 'Объект Error',

    // Задания уровня 1
    'task.1.1': 'Встроенные типы ошибок',
    'task.1.2': 'Custom Error классы',
    'task.1.3': 'Иерархия ошибок',
    'task.1.4': 'Type guards для ошибок',

    // Задания уровня 2
    'task.2.1': 'Promise rejection',
    'task.2.2': 'Promise.allSettled',

    // Задания уровня 3
    'task.3.1': 'async/await обработка',
    'task.3.2': 'Retry паттерн',

    // Задания уровня 4
    'task.4.1': 'Result тип',
    'task.4.2': 'Discriminated unions',
    'task.4.3': 'Type-safe ошибки',
    'task.4.4': 'Exhaustive handling',

    // Задания уровня 5
    'task.5.1': 'Базовый Error Boundary',
    'task.5.2': 'Fallback UI',
    'task.5.3': 'Восстановление после ошибки',
    'task.5.4': 'Вложенные Boundaries',

    // Задания уровня 6
    'task.6.1': 'Ошибки fetch',
    'task.6.2': 'API ошибки',
    'task.6.3': 'Loading/Error/Success',
    'task.6.4': 'Восстановление загрузки',

    // Задания уровня 7
    'task.7.1': 'Ошибки валидации',
    'task.7.2': 'Серверные ошибки',
    'task.7.3': 'Отображение ошибок',
    'task.7.4': 'Доступность ошибок',

    // Задания уровня 8
    'task.8.1': 'window.onerror',
    'task.8.2': 'Сервис логирования',
    'task.8.3': 'React Error Context',
    'task.8.4': 'Мониторинг ошибок',

    // Задания уровня 9
    'task.9.1': 'Функциональная обработка',
    'task.9.2': 'Тестирование ошибок',
    'task.9.3': 'Финальный проект',

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
    'level.0.desc': 'try/catch и объект Error',
    'level.1.desc': 'TypeError, RangeError, custom errors',
    'level.2.desc': 'Promise rejection, комбинаторы',
    'level.3.desc': 'try/catch + await, retry паттерн',
    'level.4.desc': 'Result, discriminated unions, never',
    'level.5.desc': 'Error Boundary, fallback, recovery',
    'level.6.desc': 'fetch, API, loading states',
    'level.7.desc': 'Валидация, серверные ошибки, a11y',
    'level.8.desc': 'window.onerror, логирование, мониторинг',
    'level.9.desc': 'Функциональный подход и тесты',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': '📚 Levels',
    'nav.level': 'Level',
    'nav.basics': 'Basics',
    'nav.errorTypes': 'Error Types',
    'nav.promises': 'Promise Errors',
    'nav.asyncAwait': 'async/await',
    'nav.tsPatterns': 'TS Patterns',
    'nav.boundaries': 'Error Boundaries',
    'nav.dataFetching': 'Data Fetching',
    'nav.forms': 'Forms & Input',
    'nav.global': 'Global Handling',
    'nav.advanced': 'Advanced',

    // Tasks Level 0
    'task.0.1': 'First try/catch',
    'task.0.2': 'Error Object',

    // Tasks Level 1
    'task.1.1': 'Built-in Error Types',
    'task.1.2': 'Custom Error Classes',
    'task.1.3': 'Error Hierarchy',
    'task.1.4': 'Type Guards for Errors',

    // Tasks Level 2
    'task.2.1': 'Promise Rejection',
    'task.2.2': 'Promise.allSettled',

    // Tasks Level 3
    'task.3.1': 'async/await Handling',
    'task.3.2': 'Retry Pattern',

    // Tasks Level 4
    'task.4.1': 'Result Type',
    'task.4.2': 'Discriminated Unions',
    'task.4.3': 'Type-safe Errors',
    'task.4.4': 'Exhaustive Handling',

    // Tasks Level 5
    'task.5.1': 'Basic Error Boundary',
    'task.5.2': 'Fallback UI',
    'task.5.3': 'Error Recovery',
    'task.5.4': 'Nested Boundaries',

    // Tasks Level 6
    'task.6.1': 'Fetch Errors',
    'task.6.2': 'API Errors',
    'task.6.3': 'Loading/Error/Success',
    'task.6.4': 'Fetch Recovery',

    // Tasks Level 7
    'task.7.1': 'Validation Errors',
    'task.7.2': 'Server Errors',
    'task.7.3': 'Error Display',
    'task.7.4': 'Error Accessibility',

    // Tasks Level 8
    'task.8.1': 'window.onerror',
    'task.8.2': 'Logging Service',
    'task.8.3': 'React Error Context',
    'task.8.4': 'Error Monitoring',

    // Tasks Level 9
    'task.9.1': 'Functional Error Handling',
    'task.9.2': 'Testing Errors',
    'task.9.3': 'Final Project',

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
    'level.0.desc': 'try/catch and the Error object',
    'level.1.desc': 'TypeError, RangeError, custom errors',
    'level.2.desc': 'Promise rejection, combinators',
    'level.3.desc': 'try/catch + await, retry pattern',
    'level.4.desc': 'Result, discriminated unions, never',
    'level.5.desc': 'Error Boundary, fallback, recovery',
    'level.6.desc': 'fetch, API, loading states',
    'level.7.desc': 'Validation, server errors, a11y',
    'level.8.desc': 'window.onerror, logging, monitoring',
    'level.9.desc': 'Functional approach and testing',
  },
}
