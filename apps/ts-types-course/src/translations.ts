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
    'nav.genericFoundations': 'Generics и ограничения',
    'nav.conditionalTypes': 'Условные типы',
    'nav.mappedTypes': 'Mapped Types',
    'nav.templateLiteralTypes': 'Template Literal Types',
    'nav.inferKeyword': 'Ключевое слово infer',
    'nav.discriminatedUnionsAdvanced': 'Продвинутые unions',
    'nav.typeGuardsAdvanced': 'Продвинутые type guards',
    'nav.variance': 'Вариантность',
    'nav.declarationMerging': 'Declaration Merging',
    'nav.recursiveTypes': 'Рекурсивные типы',
    'nav.typeLevelProgramming': 'Type-level вычисления',
    'nav.utilityTypePatterns': 'Utility-паттерны',
    'nav.advancedGenerics': 'Продвинутые generics',

    // Задания уровня 0 — Generic Foundations
    'task.0.1': 'Generic Constraints',
    'task.0.2': 'Default Type Parameters',
    'task.0.3': 'Inference in Functions',
    'task.0.4': 'Conditional Inference',
    'task.0.5': 'Generic Factories',

    // Задания уровня 1 — Conditional Types
    'task.1.1': 'Basic Conditional Types',
    'task.1.2': 'Distributive Conditionals',
    'task.1.3': 'Nested Conditionals',
    'task.1.4': 'Conditional Types with Generics',

    // Задания уровня 2 — Mapped Types
    'task.2.1': 'Basic Mapped Types',
    'task.2.2': 'Key Remapping',
    'task.2.3': 'Modifier Manipulation',
    'task.2.4': 'Deep Mapped Types',

    // Задания уровня 3 — Template Literal Types
    'task.3.1': 'Template Literal Basics',
    'task.3.2': 'String Manipulation Types',
    'task.3.3': 'Template Literal Parsing',

    // Задания уровня 4 — Infer Keyword
    'task.4.1': 'Infer in Return Types',
    'task.4.2': 'Infer in Parameters',
    'task.4.3': 'Infer in Template Literals',
    'task.4.4': 'Infer in Tuples',

    // Задания уровня 5 — Discriminated Unions Advanced
    'task.5.1': 'Exhaustive Switches',
    'task.5.2': 'Polymorphic Handlers',
    'task.5.3': 'Algebraic Data Types',

    // Задания уровня 6 — Type Guards Advanced
    'task.6.1': 'Custom Type Predicates',
    'task.6.2': 'Assertion Functions',
    'task.6.3': 'Generic Narrowing',

    // Задания уровня 7 — Variance
    'task.7.1': 'Covariance & Contravariance',
    'task.7.2': 'Strict Function Types',

    // Задания уровня 8 — Declaration Merging
    'task.8.1': 'Interface Merging',
    'task.8.2': 'Module Augmentation',
    'task.8.3': 'Ambient Declarations',

    // Задания уровня 9 — Recursive Types
    'task.9.1': 'Recursive Data Structures',
    'task.9.2': 'Recursive Conditional Types',
    'task.9.3': 'Recursive String Types',
    'task.9.4': 'Recursion Limits',

    // Задания уровня 10 — Type-Level Programming
    'task.10.1': 'Type-Level Arithmetic',
    'task.10.2': 'Type-Level Collections',
    'task.10.3': 'Type-Level Strings',
    'task.10.4': 'Type-Level Pattern Matching',
    'task.10.5': 'Type-Level SQL Builder',

    // Задания уровня 11 — Utility Type Patterns
    'task.11.1': 'Exact Types',
    'task.11.2': 'XOR Type',
    'task.11.3': 'DeepPick & DeepOmit',
    'task.11.4': 'Opaque Types',

    // Задания уровня 12 — Advanced Generics
    'task.12.1': 'Higher-Kinded Types',
    'task.12.2': 'Inference Tricks',
    'task.12.3': 'Curried Generics',

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

    // Тест
    'quiz.title': '🧪 Тест по теории',
    'quiz.submit': 'Ответить',
    'quiz.correct': '✅ Правильно!',
    'quiz.wrong': '❌ Неправильно',

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
    'level.0.desc': 'Ограничения, параметры по умолчанию, вывод типов',
    'level.1.desc': 'Условные, дистрибутивные, вложенные типы',
    'level.2.desc': 'Mapped types, remapping, модификаторы',
    'level.3.desc': 'Шаблонные литералы, манипуляции строк',
    'level.4.desc': 'infer в return, параметрах, литералах, кортежах',
    'level.5.desc': 'Exhaustive switch, полиморфные обработчики, ADT',
    'level.6.desc': 'Предикаты типов, assertion functions, сужение',
    'level.7.desc': 'Ковариантность, контравариантность, soundness',
    'level.8.desc': 'Слияние интерфейсов, модулей, ambient-объявления',
    'level.9.desc': 'Рекурсивные структуры, условия, строки, лимиты',
    'level.10.desc': 'Арифметика, коллекции, строки на уровне типов',
    'level.11.desc': 'Exact, XOR, DeepPick, Opaque типы',
    'level.12.desc': 'HKT, трюки вывода, каррированные generics',
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
    'nav.genericFoundations': 'Generics & Constraints',
    'nav.conditionalTypes': 'Conditional Types',
    'nav.mappedTypes': 'Mapped Types',
    'nav.templateLiteralTypes': 'Template Literal Types',
    'nav.inferKeyword': 'The infer Keyword',
    'nav.discriminatedUnionsAdvanced': 'Advanced Unions',
    'nav.typeGuardsAdvanced': 'Advanced Type Guards',
    'nav.variance': 'Variance',
    'nav.declarationMerging': 'Declaration Merging',
    'nav.recursiveTypes': 'Recursive Types',
    'nav.typeLevelProgramming': 'Type-Level Computation',
    'nav.utilityTypePatterns': 'Utility Patterns',
    'nav.advancedGenerics': 'Advanced Generics',

    // Tasks Level 0 — Generic Foundations
    'task.0.1': 'Generic Constraints',
    'task.0.2': 'Default Type Parameters',
    'task.0.3': 'Inference in Functions',
    'task.0.4': 'Conditional Inference',
    'task.0.5': 'Generic Factories',

    // Tasks Level 1 — Conditional Types
    'task.1.1': 'Basic Conditional Types',
    'task.1.2': 'Distributive Conditionals',
    'task.1.3': 'Nested Conditionals',
    'task.1.4': 'Conditional Types with Generics',

    // Tasks Level 2 — Mapped Types
    'task.2.1': 'Basic Mapped Types',
    'task.2.2': 'Key Remapping',
    'task.2.3': 'Modifier Manipulation',
    'task.2.4': 'Deep Mapped Types',

    // Tasks Level 3 — Template Literal Types
    'task.3.1': 'Template Literal Basics',
    'task.3.2': 'String Manipulation Types',
    'task.3.3': 'Template Literal Parsing',

    // Tasks Level 4 — Infer Keyword
    'task.4.1': 'Infer in Return Types',
    'task.4.2': 'Infer in Parameters',
    'task.4.3': 'Infer in Template Literals',
    'task.4.4': 'Infer in Tuples',

    // Tasks Level 5 — Discriminated Unions Advanced
    'task.5.1': 'Exhaustive Switches',
    'task.5.2': 'Polymorphic Handlers',
    'task.5.3': 'Algebraic Data Types',

    // Tasks Level 6 — Type Guards Advanced
    'task.6.1': 'Custom Type Predicates',
    'task.6.2': 'Assertion Functions',
    'task.6.3': 'Generic Narrowing',

    // Tasks Level 7 — Variance
    'task.7.1': 'Covariance & Contravariance',
    'task.7.2': 'Strict Function Types',

    // Tasks Level 8 — Declaration Merging
    'task.8.1': 'Interface Merging',
    'task.8.2': 'Module Augmentation',
    'task.8.3': 'Ambient Declarations',

    // Tasks Level 9 — Recursive Types
    'task.9.1': 'Recursive Data Structures',
    'task.9.2': 'Recursive Conditional Types',
    'task.9.3': 'Recursive String Types',
    'task.9.4': 'Recursion Limits',

    // Tasks Level 10 — Type-Level Programming
    'task.10.1': 'Type-Level Arithmetic',
    'task.10.2': 'Type-Level Collections',
    'task.10.3': 'Type-Level Strings',
    'task.10.4': 'Type-Level Pattern Matching',
    'task.10.5': 'Type-Level SQL Builder',

    // Tasks Level 11 — Utility Type Patterns
    'task.11.1': 'Exact Types',
    'task.11.2': 'XOR Type',
    'task.11.3': 'DeepPick & DeepOmit',
    'task.11.4': 'Opaque Types',

    // Tasks Level 12 — Advanced Generics
    'task.12.1': 'Higher-Kinded Types',
    'task.12.2': 'Inference Tricks',
    'task.12.3': 'Curried Generics',

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

    // Quiz
    'quiz.title': '🧪 Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': '✅ Correct!',
    'quiz.wrong': '❌ Incorrect',

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
    'level.0.desc': 'Constraints, defaults, type inference',
    'level.1.desc': 'Conditional, distributive, nested types',
    'level.2.desc': 'Mapped types, remapping, modifiers',
    'level.3.desc': 'Template literals, string manipulation',
    'level.4.desc': 'infer in return, params, literals, tuples',
    'level.5.desc': 'Exhaustive switch, polymorphic handlers, ADT',
    'level.6.desc': 'Type predicates, assertion functions, narrowing',
    'level.7.desc': 'Covariance, contravariance, soundness',
    'level.8.desc': 'Interface merging, module augmentation, ambient',
    'level.9.desc': 'Recursive structures, conditionals, strings, limits',
    'level.10.desc': 'Arithmetic, collections, strings at type level',
    'level.11.desc': 'Exact, XOR, DeepPick, Opaque types',
    'level.12.desc': 'HKT, inference tricks, curried generics',
  },
}
