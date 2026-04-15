import type { Translations } from '@courses/platform'

export const translations: Translations = {
  ru: {
    // Общие
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.close': 'Закрыть',

    // Навигация
    'nav.title': 'Уровни',
    'nav.levels': 'Уровни',
    'nav.level': 'Уровень',
    'nav.pureFunctions': 'Чистые функции',
    'nav.immutability': 'Иммутабельность',
    'nav.higherOrder': 'Функции высшего порядка',
    'nav.currying': 'Каррирование',
    'nav.pipeCompose': 'Pipe и Compose',
    'nav.functors': 'Функторы',
    'nav.maybeEither': 'Maybe и Either',
    'nav.monadsAdvanced': 'Монады: продвинуто',
    'nav.dataTransformations': 'Трансформации данных',
    'nav.algebraicPatterns': 'Алгебраические паттерны',
    'nav.fpTs': 'fp-ts',
    'nav.effect': 'Effect',
    'nav.patternsReact': 'FP в React',
    'nav.realWorld': 'Реальные проекты',

    // Уровень 0 — Чистые функции
    'task.0.1': 'Чистая vs нечистая функция',
    'task.0.2': 'Детектор побочных эффектов',
    'task.0.3': 'Рефакторинг к чистоте',

    // Уровень 1 — Иммутабельность
    'task.1.1': 'Ловушки мутаций',
    'task.1.2': 'Глубокое клонирование',
    'task.1.3': 'Immer produce',

    // Уровень 2 — Функции высшего порядка
    'task.2.1': 'map / filter / reduce',
    'task.2.2': 'Создание HOF',
    'task.2.3': 'Замыкания и приватное состояние',

    // Уровень 3 — Каррирование
    'task.3.1': 'Ручное каррирование',
    'task.3.2': 'Частичное применение',
    'task.3.3': 'Point-free конвейер',

    // Уровень 4 — Pipe и Compose
    'task.4.1': 'Реализация pipe и compose',
    'task.4.2': 'Асинхронный pipe',
    'task.4.3': 'Builder через pipe',

    // Уровень 5 — Функторы
    'task.5.1': 'Box: простейший функтор',
    'task.5.2': 'Законы функторов',
    'task.5.3': 'Практические функторы',

    // Уровень 6 — Maybe и Either
    'task.6.1': 'Maybe / Option',
    'task.6.2': 'Either / Result',
    'task.6.3': 'Комбинирование монад',

    // Уровень 7 — Монады продвинуто
    'task.7.1': 'IO-монада',
    'task.7.2': 'Task (async IO)',
    'task.7.3': 'Do-нотация через генераторы',

    // Уровень 8 — Трансформации данных
    'task.8.1': 'Lens: фокус на вложенных данных',
    'task.8.2': 'Transducers',
    'task.8.3': 'FP data pipeline',

    // Уровень 9 — Алгебраические паттерны
    'task.9.1': 'Semigroup и Monoid',
    'task.9.2': 'foldMap для агрегации',
    'task.9.3': 'Паттерн интерпретатора',

    // Уровень 10 — fp-ts
    'task.10.1': 'fp-ts: Option и Either',
    'task.10.2': 'fp-ts: pipe и flow',
    'task.10.3': 'fp-ts: TaskEither',

    // Уровень 11 — Effect
    'task.11.1': 'Effect: основы',
    'task.11.2': 'Effect: типизированные ошибки',
    'task.11.3': 'Effect: Layer и DI',

    // Уровень 12 — FP в React
    'task.12.1': 'Иммутабельный стейт-менеджмент',
    'task.12.2': 'Композиция хуков',
    'task.12.3': 'RemoteData и Match',

    // Уровень 13 — Реальные проекты
    'task.13.1': 'FP-валидация формы',
    'task.13.2': 'FP API-клиент',
    'task.13.3': 'Event processing pipeline',

    // UI платформы
    'task.title': 'Задание',
    'task.description': 'Описание задания',
    'task.placeholder': 'Ваш результат появится здесь',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',
    'theory.title': 'Теория',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Развёрнуто',
    'theory.notFound': 'Теория не найдена',
    'solution.show': 'Показать решение',
    'solution.hide': 'Скрыть решение',
    'quiz.title': 'Тест по теории',
    'quiz.submit': 'Ответить',
    'quiz.correct': 'Правильно!',
    'quiz.wrong': 'Неправильно',
    'theme.light': 'Светлая',
    'theme.dark': 'Тёмная',
    'theme.toggle': 'Переключить тему',
    'language.select': 'Выбрать язык',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Наверх',

    // Описания уровней
    'level.0.desc': 'Чистые функции, побочные эффекты и детерминированность',
    'level.1.desc': 'Неизменяемые данные, spread, structuredClone и Immer',
    'level.2.desc': 'Функции как значения, map/filter/reduce, замыкания',
    'level.3.desc': 'Каррирование, частичное применение и point-free стиль',
    'level.4.desc': 'Композиция функций, pipe, compose и типобезопасные пайплайны',
    'level.5.desc': 'Функторы, контейнеры с map и законы функторов',
    'level.6.desc': 'Монады Maybe и Either для безопасной обработки null и ошибок',
    'level.7.desc': 'IO-монада, Task, Reader и Do-нотация через генераторы',
    'level.8.desc': 'Lens, Transducers и практические паттерны трансформаций',
    'level.9.desc': 'Semigroup, Monoid, foldMap и паттерн интерпретатора',
    'level.10.desc': 'Option, Either, pipe, TaskEither и реальные паттерны из fp-ts',
    'level.11.desc': 'Effect, Layer, управление ошибками и зависимостями',
    'level.12.desc': 'Иммутабельный стейт, композиция хуков, RemoteData в React',
    'level.13.desc': 'Валидация форм, API-клиент и event processing в FP-стиле',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Navigation
    'nav.title': 'Levels',
    'nav.levels': 'Levels',
    'nav.level': 'Level',
    'nav.pureFunctions': 'Pure Functions',
    'nav.immutability': 'Immutability',
    'nav.higherOrder': 'Higher-Order Functions',
    'nav.currying': 'Currying',
    'nav.pipeCompose': 'Pipe & Compose',
    'nav.functors': 'Functors',
    'nav.maybeEither': 'Maybe & Either',
    'nav.monadsAdvanced': 'Monads: Advanced',
    'nav.dataTransformations': 'Data Transformations',
    'nav.algebraicPatterns': 'Algebraic Patterns',
    'nav.fpTs': 'fp-ts',
    'nav.effect': 'Effect',
    'nav.patternsReact': 'FP in React',
    'nav.realWorld': 'Real-World Projects',

    // Level 0
    'task.0.1': 'Pure vs Impure Function',
    'task.0.2': 'Side Effect Detector',
    'task.0.3': 'Refactoring to Purity',

    // Level 1
    'task.1.1': 'Mutation Traps',
    'task.1.2': 'Deep Cloning',
    'task.1.3': 'Immer produce',

    // Level 2
    'task.2.1': 'map / filter / reduce',
    'task.2.2': 'Creating HOFs',
    'task.2.3': 'Closures & Private State',

    // Level 3
    'task.3.1': 'Manual Currying',
    'task.3.2': 'Partial Application',
    'task.3.3': 'Point-free Pipeline',

    // Level 4
    'task.4.1': 'Implementing pipe & compose',
    'task.4.2': 'Async pipe',
    'task.4.3': 'Builder via pipe',

    // Level 5
    'task.5.1': 'Box: Simplest Functor',
    'task.5.2': 'Functor Laws',
    'task.5.3': 'Practical Functors',

    // Level 6
    'task.6.1': 'Maybe / Option',
    'task.6.2': 'Either / Result',
    'task.6.3': 'Combining Monads',

    // Level 7
    'task.7.1': 'IO Monad',
    'task.7.2': 'Task (async IO)',
    'task.7.3': 'Do-notation via Generators',

    // Level 8
    'task.8.1': 'Lens: Focusing on Nested Data',
    'task.8.2': 'Transducers',
    'task.8.3': 'FP Data Pipeline',

    // Level 9
    'task.9.1': 'Semigroup & Monoid',
    'task.9.2': 'foldMap for Aggregation',
    'task.9.3': 'Interpreter Pattern',

    // Level 10
    'task.10.1': 'fp-ts: Option & Either',
    'task.10.2': 'fp-ts: pipe & flow',
    'task.10.3': 'fp-ts: TaskEither',

    // Level 11
    'task.11.1': 'Effect: Basics',
    'task.11.2': 'Effect: Typed Errors',
    'task.11.3': 'Effect: Layer & DI',

    // Level 12
    'task.12.1': 'Immutable State Management',
    'task.12.2': 'Hook Composition',
    'task.12.3': 'RemoteData & Match',

    // Level 13
    'task.13.1': 'FP Form Validation',
    'task.13.2': 'FP API Client',
    'task.13.3': 'Event Processing Pipeline',

    // Platform UI
    'task.title': 'Task',
    'task.description': 'Task Description',
    'task.placeholder': 'Your result will appear here',
    'task.markComplete': 'Mark as complete',
    'task.markIncomplete': 'Mark as incomplete',
    'theory.title': 'Theory',
    'theory.brief': 'Brief',
    'theory.detailed': 'Detailed',
    'theory.notFound': 'Theory not found',
    'solution.show': 'Show solution',
    'solution.hide': 'Hide solution',
    'quiz.title': 'Theory Quiz',
    'quiz.submit': 'Submit',
    'quiz.correct': 'Correct!',
    'quiz.wrong': 'Wrong',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Back to top',

    // Level descriptions
    'level.0.desc': 'Pure functions, side effects, and determinism',
    'level.1.desc': 'Immutable data, spread, structuredClone, and Immer',
    'level.2.desc': 'Functions as values, map/filter/reduce, closures',
    'level.3.desc': 'Currying, partial application, and point-free style',
    'level.4.desc': 'Function composition, pipe, compose, and type-safe pipelines',
    'level.5.desc': 'Functors, containers with map, and functor laws',
    'level.6.desc': 'Maybe and Either monads for safe null and error handling',
    'level.7.desc': 'IO monad, Task, Reader, and Do-notation via generators',
    'level.8.desc': 'Lens, Transducers, and practical transformation patterns',
    'level.9.desc': 'Semigroup, Monoid, foldMap, and the interpreter pattern',
    'level.10.desc': 'Option, Either, pipe, TaskEither from fp-ts',
    'level.11.desc': 'Effect, Layer, error and dependency management',
    'level.12.desc': 'Immutable state, hook composition, RemoteData in React',
    'level.13.desc': 'Form validation, API client, and event processing in FP style',
  },
}
