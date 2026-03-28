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
    'nav.setup': 'Setup',
    'nav.basics': 'Основы',
    'nav.validation': 'Валидация',
    'nav.zodBasics': 'Zod: Основы',
    'nav.zodAdvanced': 'Zod: Продвинутое',
    'nav.yupComparison': 'Yup и сравнение',
    'nav.complex': 'Сложные поля',
    'nav.filesDates': 'Файлы и даты',
    'nav.dynamic': 'Динамические формы',
    'nav.formState': 'Состояние формы',
    'nav.focusA11y': 'Фокус и A11y',
    'nav.performance': 'Производительность',
    'nav.asyncValidation': 'Async валидация',
    'nav.submissionAutosave': 'Отправка и автосохранение',
    'nav.advanced': 'Продвинутые техники',

    // Задания уровня 0
    'task.0.1': 'Первая форма',
    'task.0.2': 'Вывод данных',

    // Задания уровня 1
    'task.1.1': 'Форма регистрации',
    'task.1.2': 'Watch в реальном времени',
    'task.1.3': 'setValue и getValues',
    'task.1.4': 'formState',

    // Задания уровня 2
    'task.2.1': 'Built-in валидация',
    'task.2.2': 'Pattern валидация',
    'task.2.3': 'Custom валидация',
    'task.2.4': 'Cross-field валидация',

    // Задания уровня 3
    'task.3.1': 'Валидация с Zod',
    'task.3.2': 'Сложные схемы',

    // Задания уровня 4
    'task.4.1': 'refine и сообщения',
    'task.4.2': 'superRefine и discriminatedUnion',

    // Задания уровня 5
    'task.5.1': 'Валидация с Yup',
    'task.5.2': 'Zod vs Yup',

    // Задания уровня 6
    'task.6.1': 'Controller',
    'task.6.2': 'Radio и Select',
    'task.6.3': 'Checkbox',

    // Задания уровня 7
    'task.7.1': 'Загрузка файлов',
    'task.7.2': 'Дата и время',

    // Задания уровня 8
    'task.8.1': 'useFieldArray',
    'task.8.2': 'Условные поля',
    'task.8.3': 'Зависимые поля',
    'task.8.4': 'Wizard',

    // Задания уровня 9
    'task.9.1': 'Dirty / Touched',
    'task.9.2': 'Reset',

    // Задания уровня 10
    'task.10.1': 'Focus management',
    'task.10.2': 'Accessibility',

    // Задания уровня 11
    'task.11.1': 'Performance',
    'task.11.2': 'setFocus и resetField',

    // Задания уровня 12
    'task.12.1': 'Async валидация',
    'task.12.2': 'Загрузка данных',
    'task.12.3': 'Async defaultValues',

    // Задания уровня 13
    'task.13.1': 'Submit loading',
    'task.13.2': 'Debounce',

    // Задания уровня 14
    'task.14.1': 'UI библиотека',
    'task.14.2': 'Кастомные хуки',
    'task.14.3': 'FormContext',
    'task.14.4': 'localStorage',
    'task.14.5': 'Финальный проект',
    'task.14.6': 'useFormState и тесты',

    // Задания
    'task.title': 'Задание',
    'task.description': '📋 Описание задания',
    'task.yourForm': '🎯 Ваша форма:',
    'task.placeholder': 'Ваша форма появится здесь',
    'task.openFile': 'Откройте файл',
    'task.andComplete': 'и выполните задание',
    'task.formReady': 'Форма реализована!',
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
    'level.0.desc': 'Настройка и первая форма',
    'level.1.desc': 'useForm, register, handleSubmit',
    'level.2.desc': 'Built-in и custom валидация',
    'level.3.desc': 'Базовые и сложные схемы Zod',
    'level.4.desc': 'refine, superRefine, discriminatedUnion',
    'level.5.desc': 'Yup валидация и сравнение с Zod',
    'level.6.desc': 'Controller, radio, select, checkbox',
    'level.7.desc': 'File upload, date, datetime',
    'level.8.desc': 'useFieldArray, условные поля, wizard',
    'level.9.desc': 'Dirty, touched, reset',
    'level.10.desc': 'Focus management, ARIA',
    'level.11.desc': 'Performance, setFocus, resetField',
    'level.12.desc': 'Async validation, data loading',
    'level.13.desc': 'Submit loading, debounce autosave',
    'level.14.desc': 'Интеграции и финальный проект',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': '📚 Levels',
    'nav.level': 'Level',
    'nav.setup': 'Setup',
    'nav.basics': 'Basics',
    'nav.validation': 'Validation',
    'nav.zodBasics': 'Zod: Basics',
    'nav.zodAdvanced': 'Zod: Advanced',
    'nav.yupComparison': 'Yup & Comparison',
    'nav.complex': 'Complex Fields',
    'nav.filesDates': 'Files & Dates',
    'nav.dynamic': 'Dynamic Forms',
    'nav.formState': 'Form State',
    'nav.focusA11y': 'Focus & A11y',
    'nav.performance': 'Performance',
    'nav.asyncValidation': 'Async Validation',
    'nav.submissionAutosave': 'Submission & Autosave',
    'nav.advanced': 'Advanced',

    // Tasks Level 0
    'task.0.1': 'First Form',
    'task.0.2': 'Display Data',

    // Tasks Level 1
    'task.1.1': 'Registration Form',
    'task.1.2': 'Real-time Watch',
    'task.1.3': 'setValue and getValues',
    'task.1.4': 'formState',

    // Tasks Level 2
    'task.2.1': 'Built-in Validation',
    'task.2.2': 'Pattern Validation',
    'task.2.3': 'Custom Validation',
    'task.2.4': 'Cross-field Validation',

    // Tasks Level 3
    'task.3.1': 'Zod Validation',
    'task.3.2': 'Complex Schemas',

    // Tasks Level 4
    'task.4.1': 'refine and Messages',
    'task.4.2': 'superRefine and discriminatedUnion',

    // Tasks Level 5
    'task.5.1': 'Yup Validation',
    'task.5.2': 'Zod vs Yup',

    // Tasks Level 6
    'task.6.1': 'Controller',
    'task.6.2': 'Radio and Select',
    'task.6.3': 'Checkbox',

    // Tasks Level 7
    'task.7.1': 'File Upload',
    'task.7.2': 'Date and Time',

    // Tasks Level 8
    'task.8.1': 'useFieldArray',
    'task.8.2': 'Conditional Fields',
    'task.8.3': 'Dependent Fields',
    'task.8.4': 'Wizard',

    // Tasks Level 9
    'task.9.1': 'Dirty / Touched',
    'task.9.2': 'Reset',

    // Tasks Level 10
    'task.10.1': 'Focus Management',
    'task.10.2': 'Accessibility',

    // Tasks Level 11
    'task.11.1': 'Performance',
    'task.11.2': 'setFocus & resetField',

    // Tasks Level 12
    'task.12.1': 'Async Validation',
    'task.12.2': 'Data Loading',
    'task.12.3': 'Async defaultValues',

    // Tasks Level 13
    'task.13.1': 'Submit Loading',
    'task.13.2': 'Debounce',

    // Tasks Level 14
    'task.14.1': 'UI Library',
    'task.14.2': 'Custom Hooks',
    'task.14.3': 'FormContext',
    'task.14.4': 'localStorage',
    'task.14.5': 'Final Project',
    'task.14.6': 'useFormState & Tests',

    // Tasks
    'task.title': 'Task',
    'task.description': '📋 Task Description',
    'task.yourForm': '🎯 Your Form:',
    'task.placeholder': 'Your form will appear here',
    'task.openFile': 'Open file',
    'task.andComplete': 'and complete the task',
    'task.formReady': 'Form implemented!',
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
    'level.0.desc': 'Setup and first form',
    'level.1.desc': 'useForm, register, handleSubmit',
    'level.2.desc': 'Built-in and custom validation',
    'level.3.desc': 'Basic and complex Zod schemas',
    'level.4.desc': 'refine, superRefine, discriminatedUnion',
    'level.5.desc': 'Yup validation and comparison with Zod',
    'level.6.desc': 'Controller, radio, select, checkbox',
    'level.7.desc': 'File upload, date, datetime',
    'level.8.desc': 'useFieldArray, conditional fields, wizard',
    'level.9.desc': 'Dirty, touched, reset',
    'level.10.desc': 'Focus management, ARIA',
    'level.11.desc': 'Performance, setFocus, resetField',
    'level.12.desc': 'Async validation, data loading',
    'level.13.desc': 'Submit loading, debounce autosave',
    'level.14.desc': 'Integrations and final project',
  },
}
