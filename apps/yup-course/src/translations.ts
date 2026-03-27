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
    'nav.intro': 'Введение',
    'nav.primitives': 'Примитивы',
    'nav.strings': 'Строки',
    'nav.numbers': 'Числа и даты',
    'nav.objects': 'Объекты',
    'nav.arrays': 'Массивы и кортежи',
    'nav.conditional': 'Условная валидация',
    'nav.custom': 'Кастомные правила',
    'nav.advanced': 'Продвинутые техники',

    // Уровень 0
    'task.0.1': 'Первая схема',
    'task.0.2': 'Обработка ошибок',

    // Уровень 1
    'task.1.1': 'string и number',
    'task.1.2': 'boolean и date',
    'task.1.3': 'required и nullable',
    'task.1.4': 'default и defined',

    // Уровень 2
    'task.2.1': 'email и url',
    'task.2.2': 'min, max, length',
    'task.2.3': 'matches (regex)',
    'task.2.4': 'trim, lowercase, uppercase',

    // Уровень 3
    'task.3.1': 'min, max, positive, negative',
    'task.3.2': 'integer и truncate',
    'task.3.3': 'Валидация дат',
    'task.3.4': 'Диапазоны дат',

    // Уровень 4
    'task.4.1': 'object и shape',
    'task.4.2': 'Вложенные объекты',
    'task.4.3': 'pick, omit, partial',
    'task.4.4': 'noUnknown и strict',

    // Уровень 5
    'task.5.1': 'array().of()',
    'task.5.2': 'min, max, length для массивов',
    'task.5.3': 'tuple',

    // Уровень 6
    'task.6.1': 'when — базовое',
    'task.6.2': 'when — is/then/otherwise',
    'task.6.3': 'when — несколько полей',
    'task.6.4': 'when — вложенные условия',

    // Уровень 7
    'task.7.1': 'test — кастомная валидация',
    'task.7.2': 'transform',
    'task.7.3': 'addMethod',
    'task.7.4': 'Цепочки трансформаций',

    // Уровень 8
    'task.8.1': 'ref и context',
    'task.8.2': 'lazy — рекурсивные схемы',
    'task.8.3': 'TypeScript и InferType',
    'task.8.4': 'Финальный проект',

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
    'theory.title': '📚 Теория',
    'theory.loading': 'Загрузка теории...',
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
    'level.0.desc': 'Знакомство с Yup: установка, первая схема, валидация данных',
    'level.1.desc': 'Примитивные типы: string, number, boolean, date и модификаторы',
    'level.2.desc': 'Строковая валидация: email, url, regex, трансформации',
    'level.3.desc': 'Числа и даты: диапазоны, ограничения, форматы',
    'level.4.desc': 'Объектные схемы: shape, вложенность, pick/omit',
    'level.5.desc': 'Массивы и кортежи: of(), min/max, tuple',
    'level.6.desc': 'Условная валидация: when, зависимые поля',
    'level.7.desc': 'Кастомные правила: test, transform, addMethod',
    'level.8.desc': 'Продвинутые техники: ref, lazy, TypeScript, финальный проект',
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
    'nav.intro': 'Introduction',
    'nav.primitives': 'Primitives',
    'nav.strings': 'Strings',
    'nav.numbers': 'Numbers & Dates',
    'nav.objects': 'Objects',
    'nav.arrays': 'Arrays & Tuples',
    'nav.conditional': 'Conditional Validation',
    'nav.custom': 'Custom Rules',
    'nav.advanced': 'Advanced Techniques',

    // Level 0
    'task.0.1': 'First Schema',
    'task.0.2': 'Error Handling',

    // Level 1
    'task.1.1': 'string and number',
    'task.1.2': 'boolean and date',
    'task.1.3': 'required and nullable',
    'task.1.4': 'default and defined',

    // Level 2
    'task.2.1': 'email and url',
    'task.2.2': 'min, max, length',
    'task.2.3': 'matches (regex)',
    'task.2.4': 'trim, lowercase, uppercase',

    // Level 3
    'task.3.1': 'min, max, positive, negative',
    'task.3.2': 'integer and truncate',
    'task.3.3': 'Date Validation',
    'task.3.4': 'Date Ranges',

    // Level 4
    'task.4.1': 'object and shape',
    'task.4.2': 'Nested Objects',
    'task.4.3': 'pick, omit, partial',
    'task.4.4': 'noUnknown and strict',

    // Level 5
    'task.5.1': 'array().of()',
    'task.5.2': 'min, max, length for arrays',
    'task.5.3': 'tuple',

    // Level 6
    'task.6.1': 'when — basics',
    'task.6.2': 'when — is/then/otherwise',
    'task.6.3': 'when — multiple fields',
    'task.6.4': 'when — nested conditions',

    // Level 7
    'task.7.1': 'test — custom validation',
    'task.7.2': 'transform',
    'task.7.3': 'addMethod',
    'task.7.4': 'Transform Chains',

    // Level 8
    'task.8.1': 'ref and context',
    'task.8.2': 'lazy — recursive schemas',
    'task.8.3': 'TypeScript and InferType',
    'task.8.4': 'Final Project',

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

    // Theory and solution
    'theory.title': '📚 Theory',
    'theory.loading': 'Loading theory...',
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
    'level.0.desc': 'Getting started with Yup: installation, first schema, data validation',
    'level.1.desc': 'Primitive types: string, number, boolean, date and modifiers',
    'level.2.desc': 'String validation: email, url, regex, transformations',
    'level.3.desc': 'Numbers and dates: ranges, constraints, formats',
    'level.4.desc': 'Object schemas: shape, nesting, pick/omit',
    'level.5.desc': 'Arrays and tuples: of(), min/max, tuple',
    'level.6.desc': 'Conditional validation: when, dependent fields',
    'level.7.desc': 'Custom rules: test, transform, addMethod',
    'level.8.desc': 'Advanced techniques: ref, lazy, TypeScript, final project',
  },
}
