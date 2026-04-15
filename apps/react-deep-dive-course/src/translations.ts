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
    'nav.setup': 'Введение и ментальная модель',
    'nav.fiberTree': 'Fiber-архитектура: дерево',
    'nav.workLoop': 'Work Loop и приоритеты',
    'nav.reconciliation': 'Reconciliation и diffing',
    'nav.hooksInternals': 'Хуки: как они работают в памяти',
    'nav.useeffectLifecycle': 'useEffect: жизненный цикл',
    'nav.usememoUsecallback': 'useMemo и useCallback',
    'nav.externalStores': 'Подписки и внешние хранилища',
    'nav.customHooks': 'Кастомные хуки',
    'nav.batching': 'Batching и оптимизации',
    'nav.concurrent': 'Concurrent React',
    'nav.serverComponents': 'Server Components internals',
    'nav.reactCompiler': 'React Compiler',
    'nav.patternsPerformance': 'Паттерны производительности',
    'nav.recap': 'Итоги и архитектурная карта',

    // Уровень 0 — Введение
    'task.0.1': 'Диаграмма Trigger / Render / Commit',
    'task.0.2': 'Render ≠ DOM update',
    'task.0.3': 'Profiler API: замеряем рендеры',

    // Уровень 1 — Fiber-дерево
    'task.1.1': 'Fiber Node Explorer',
    'task.1.2': 'createElement → Fiber',
    'task.1.3': 'Fiber vs DOM',
    'task.1.4': 'Fiber Detective',

    // Уровень 2 — Work Loop
    'task.2.1': 'Упрощённый Work Loop',
    'task.2.2': 'Priority Queue',
    'task.2.3': 'Time Slicing Demo',

    // Уровень 3 — Reconciliation
    'task.3.1': 'Diff Visualizer',
    'task.3.2': 'Key Chaos',
    'task.3.3': 'Key Reset vs useEffect',
    'task.3.4': 'Reconciliation Step-by-Step',

    // Уровень 4 — Хуки в памяти
    'task.4.1': 'Hooks Linked List',
    'task.4.2': 'useState Under the Hood',
    'task.4.3': 'The Closure Trap',
    'task.4.4': 'Computed During Render',

    // Уровень 5 — useEffect lifecycle
    'task.5.1': 'Effect Timeline',
    'task.5.2': 'Event Handler vs Effect',
    'task.5.3': 'Effect Chains Refactor',
    'task.5.4': 'Race Condition Fix',

    // Уровень 6 — useMemo / useCallback
    'task.6.1': 'useMemo vs useEffect',
    'task.6.2': 'Referential Equality Trap',
    'task.6.3': 'Memoization Cost-Benefit',

    // Уровень 7 — Внешние хранилища
    'task.7.1': 'Manual Subscription → useSyncExternalStore',
    'task.7.2': 'Build a Mini Store',
    'task.7.3': 'Browser API Store',

    // Уровень 8 — Custom hooks
    'task.8.1': 'useDebounce',
    'task.8.2': 'usePrevious и latest callback',
    'task.8.3': 'Hook Composition: useDataTable',
    'task.8.4': 'Anti-pattern Gallery',

    // Уровень 9 — Batching
    'task.9.1': 'Batching Explorer',
    'task.9.2': 'flushSync Demo',
    'task.9.3': 'Batching vs Cascade',

    // Уровень 10 — Concurrent
    'task.10.1': 'Suspense Mechanics',
    'task.10.2': 'Transition vs Sync Update',
    'task.10.3': 'Suspense Waterfall',
    'task.10.4': 'Concurrent Tree Walk',

    // Уровень 11 — Server Components
    'task.11.1': 'RSC Payload Parser',
    'task.11.2': 'Streaming Simulator',
    'task.11.3': 'Selective Hydration',

    // Уровень 12 — React Compiler
    'task.12.1': 'Manual vs Compiler',
    'task.12.2': 'Rules of React',
    'task.12.3': 'Compiler Output Analysis',

    // Уровень 13 — Performance patterns
    'task.13.1': 'Context Splitting',
    'task.13.2': 'State Colocation',
    'task.13.3': 'Performance Audit',

    // Уровень 14 — Итоги
    'task.14.1': 'Full Lifecycle Diagram',
    'task.14.2': 'Architecture Decision Tree',
    'task.14.3': 'React Source Code Navigator',

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
    'level.0.desc': 'Trigger → Render → Commit: что на самом деле делает React при обновлении',
    'level.1.desc': 'Fiber node, child/sibling/return, linked list вместо рекурсивного дерева',
    'level.2.desc': 'performUnitOfWork, beginWork/completeWork, scheduler и lane-приоритеты',
    'level.3.desc': 'O(n) diffing, два допущения, keys, reconcileChildFibers',
    'level.4.desc': 'Linked list хуков на fiber, dispatcher, closure trap, вычисления при рендере',
    'level.5.desc': 'Effect timeline, cleanup, golden rule «Effect vs Handler», chains, race conditions',
    'level.6.desc': 'useMemo/useCallback internals, referential equality, когда мемоизация вредит',
    'level.7.desc': 'useSyncExternalStore, tearing, построение mini store',
    'level.8.desc': 'useDebounce, usePrevious, композиция хуков, антипаттерны',
    'level.9.desc': 'Автоматический batching в React 18+, flushSync, сравнение с cascading',
    'level.10.desc': 'Interruptible rendering, transition lanes, Suspense internals, thrown promise',
    'level.11.desc': 'RSC wire format, chunked streaming, selective hydration',
    'level.12.desc': 'Автоматическая мемоизация, rules of React, анализ compiler output',
    'level.13.desc': 'Context splitting, state colocation, children-as-props, capstone audit',
    'level.14.desc': 'Полная карта lifecycle, decision tree, маппинг на исходники React',
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
    'nav.setup': 'Introduction & Mental Model',
    'nav.fiberTree': 'Fiber Architecture: Tree',
    'nav.workLoop': 'Work Loop & Priorities',
    'nav.reconciliation': 'Reconciliation & Diffing',
    'nav.hooksInternals': 'Hooks: Memory Internals',
    'nav.useeffectLifecycle': 'useEffect Lifecycle',
    'nav.usememoUsecallback': 'useMemo & useCallback',
    'nav.externalStores': 'Subscriptions & External Stores',
    'nav.customHooks': 'Custom Hooks',
    'nav.batching': 'Batching & Optimizations',
    'nav.concurrent': 'Concurrent React',
    'nav.serverComponents': 'Server Components Internals',
    'nav.reactCompiler': 'React Compiler',
    'nav.patternsPerformance': 'Performance Patterns',
    'nav.recap': 'Recap & Architecture Map',

    // Level 0
    'task.0.1': 'Trigger / Render / Commit Diagram',
    'task.0.2': 'Render ≠ DOM Update',
    'task.0.3': 'Profiler API: Measuring Renders',

    // Level 1
    'task.1.1': 'Fiber Node Explorer',
    'task.1.2': 'createElement → Fiber',
    'task.1.3': 'Fiber vs DOM',
    'task.1.4': 'Fiber Detective',

    // Level 2
    'task.2.1': 'Simplified Work Loop',
    'task.2.2': 'Priority Queue',
    'task.2.3': 'Time Slicing Demo',

    // Level 3
    'task.3.1': 'Diff Visualizer',
    'task.3.2': 'Key Chaos',
    'task.3.3': 'Key Reset vs useEffect',
    'task.3.4': 'Reconciliation Step-by-Step',

    // Level 4
    'task.4.1': 'Hooks Linked List',
    'task.4.2': 'useState Under the Hood',
    'task.4.3': 'The Closure Trap',
    'task.4.4': 'Computed During Render',

    // Level 5
    'task.5.1': 'Effect Timeline',
    'task.5.2': 'Event Handler vs Effect',
    'task.5.3': 'Effect Chains Refactor',
    'task.5.4': 'Race Condition Fix',

    // Level 6
    'task.6.1': 'useMemo vs useEffect',
    'task.6.2': 'Referential Equality Trap',
    'task.6.3': 'Memoization Cost-Benefit',

    // Level 7
    'task.7.1': 'Manual Subscription → useSyncExternalStore',
    'task.7.2': 'Build a Mini Store',
    'task.7.3': 'Browser API Store',

    // Level 8
    'task.8.1': 'useDebounce',
    'task.8.2': 'usePrevious & Latest Callback',
    'task.8.3': 'Hook Composition: useDataTable',
    'task.8.4': 'Anti-pattern Gallery',

    // Level 9
    'task.9.1': 'Batching Explorer',
    'task.9.2': 'flushSync Demo',
    'task.9.3': 'Batching vs Cascade',

    // Level 10
    'task.10.1': 'Suspense Mechanics',
    'task.10.2': 'Transition vs Sync Update',
    'task.10.3': 'Suspense Waterfall',
    'task.10.4': 'Concurrent Tree Walk',

    // Level 11
    'task.11.1': 'RSC Payload Parser',
    'task.11.2': 'Streaming Simulator',
    'task.11.3': 'Selective Hydration',

    // Level 12
    'task.12.1': 'Manual vs Compiler',
    'task.12.2': 'Rules of React',
    'task.12.3': 'Compiler Output Analysis',

    // Level 13
    'task.13.1': 'Context Splitting',
    'task.13.2': 'State Colocation',
    'task.13.3': 'Performance Audit',

    // Level 14
    'task.14.1': 'Full Lifecycle Diagram',
    'task.14.2': 'Architecture Decision Tree',
    'task.14.3': 'React Source Code Navigator',

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
    'quiz.wrong': '❌ Wrong',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Back to top',

    // Level descriptions
    'level.0.desc': 'Trigger → Render → Commit: what React actually does on update',
    'level.1.desc': 'Fiber node, child/sibling/return, linked list instead of recursive tree',
    'level.2.desc': 'performUnitOfWork, beginWork/completeWork, scheduler and lane priorities',
    'level.3.desc': 'O(n) diffing, two assumptions, keys, reconcileChildFibers',
    'level.4.desc': 'Hooks linked list on fiber, dispatcher, closure trap, computed during render',
    'level.5.desc': 'Effect timeline, cleanup, golden rule "Effect vs Handler", chains, race conditions',
    'level.6.desc': 'useMemo/useCallback internals, referential equality, when memoization hurts',
    'level.7.desc': 'useSyncExternalStore, tearing, building a mini store',
    'level.8.desc': 'useDebounce, usePrevious, hook composition, anti-patterns',
    'level.9.desc': 'Automatic batching in React 18+, flushSync, comparison with cascading',
    'level.10.desc': 'Interruptible rendering, transition lanes, Suspense internals, thrown promise',
    'level.11.desc': 'RSC wire format, chunked streaming, selective hydration',
    'level.12.desc': 'Automatic memoization, rules of React, compiler output analysis',
    'level.13.desc': 'Context splitting, state colocation, children-as-props, capstone audit',
    'level.14.desc': 'Full lifecycle map, decision tree, mapping to React source code',
  },
}
