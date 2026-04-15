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
    'nav.callStack': 'Call Stack и однопоточность',
    'nav.eventLoop': 'Event Loop',
    'nav.callbacks': 'Callbacks',
    'nav.promiseBasics': 'Promise: основы',
    'nav.promiseChains': 'Promise: цепочки и ошибки',
    'nav.promiseCombinators': 'Promise: комбинаторы',
    'nav.asyncAwait': 'async/await',
    'nav.asyncPatterns': 'Паттерны async/await',
    'nav.generators': 'Генераторы',
    'nav.asyncGenerators': 'Async-генераторы',
    'nav.abortController': 'AbortController',
    'nav.rafRic': 'rAF и rIC',
    'nav.webWorkers': 'Web Workers',
    'nav.sharedMemory': 'SharedArrayBuffer и Atomics',
    'nav.realWorld': 'Реальные паттерны',

    // Уровень 0 — Call Stack и однопоточность
    'task.0.1': 'Визуализатор Call Stack',
    'task.0.2': 'Блокировка главного потока',

    // Уровень 1 — Event Loop
    'task.1.1': 'Event Loop симулятор',
    'task.1.2': 'Микротаски vs макротаски',
    'task.1.3': 'Предскажи порядок выполнения',
    'task.1.4': 'Браузер vs Node.js Event Loop',

    // Уровень 2 — Callbacks
    'task.2.1': 'Callback Hell визуализатор',
    'task.2.2': 'Из колбэков в промисы',

    // Уровень 3 — Promise: основы
    'task.3.1': 'Конструктор Promise',
    'task.3.2': 'then/catch/finally цепочка',
    'task.3.3': 'Промисификация',

    // Уровень 4 — Promise: цепочки и ошибки
    'task.4.1': 'Promise pipeline',
    'task.4.2': 'Error propagation и recovery',
    'task.4.3': 'Микротаски промисов',

    // Уровень 5 — Promise: комбинаторы
    'task.5.1': 'Promise.all',
    'task.5.2': 'Promise.allSettled',
    'task.5.3': 'Promise.race',
    'task.5.4': 'Promise.any',

    // Уровень 6 — async/await
    'task.6.1': 'async/await vs Promise',
    'task.6.2': 'Обработка ошибок',
    'task.6.3': 'Sequential vs Parallel',
    'task.6.4': 'Антипаттерны async/await',

    // Уровень 7 — Паттерны async/await
    'task.7.1': 'Retry с exponential backoff',
    'task.7.2': 'Async Pool',
    'task.7.3': 'Debounce и Throttle async',
    'task.7.4': 'Async Mutex',
    'task.7.5': 'Circuit Breaker',

    // Уровень 8 — Генераторы
    'task.8.1': 'Генератор пошагово',
    'task.8.2': 'Ленивые последовательности',
    'task.8.3': 'Генератор как state machine',

    // Уровень 9 — Async-генераторы
    'task.9.1': 'Async пагинация',
    'task.9.2': 'Pipeline из async-генераторов',
    'task.9.3': 'Real-time event stream',

    // Уровень 10 — AbortController
    'task.10.1': 'Отмена fetch',
    'task.10.2': 'Timeout и составные сигналы',
    'task.10.3': 'Отмена в React useEffect',

    // Уровень 11 — rAF и rIC
    'task.11.1': 'rAF vs setTimeout',
    'task.11.2': 'rAF и Event Loop',
    'task.11.3': 'requestIdleCallback',
    'task.11.4': 'Планировщик задач',

    // Уровень 12 — Web Workers
    'task.12.1': 'Web Worker: тяжёлое вычисление',
    'task.12.2': 'postMessage и Structured Clone',
    'task.12.3': 'Transferable objects',
    'task.12.4': 'Worker Pool',

    // Уровень 13 — SharedArrayBuffer и Atomics
    'task.13.1': 'Race Condition визуализатор',
    'task.13.2': 'Atomics API',
    'task.13.3': 'Atomics.wait / notify',
    'task.13.4': 'Mutex на Atomics',

    // Уровень 14 — Реальные паттерны
    'task.14.1': 'Загрузчик файлов',
    'task.14.2': 'Async State Machine',
    'task.14.3': 'Real-time Dashboard',

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
    'level.0.desc': 'Call Stack, Execution Context и почему JavaScript однопоточный',
    'level.1.desc': 'Цикл событий: очереди задач, микротаски, макротаски и фазы Node.js',
    'level.2.desc': 'Callback-функции, error-first pattern и Callback Hell',
    'level.3.desc': 'Создание промисов, состояния pending/fulfilled/rejected, then/catch/finally',
    'level.4.desc': 'Цепочки промисов, распространение ошибок и микротаски',
    'level.5.desc': 'Promise.all, allSettled, race, any — параллельное выполнение',
    'level.6.desc': 'Синтаксический сахар над промисами, обработка ошибок, паттерны',
    'level.7.desc': 'Retry, async pool, debounce, mutex и продвинутые async-паттерны',
    'level.8.desc': 'Функции-генераторы, yield, двусторонняя коммуникация и ленивые вычисления',
    'level.9.desc': 'async function*, for-await-of и потоковая обработка данных',
    'level.10.desc': 'Отмена асинхронных операций, AbortSignal, таймауты и составные сигналы',
    'level.11.desc': 'requestAnimationFrame, requestIdleCallback и планирование работы',
    'level.12.desc': 'Многопоточность в JS: Web Workers, postMessage, Transferable',
    'level.13.desc': 'Разделяемая память между потоками, атомарные операции и синхронизация',
    'level.14.desc': 'Capstone: реальные async-паттерны из продакшн-приложений',
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
    'nav.callStack': 'Call Stack & Single Threading',
    'nav.eventLoop': 'Event Loop',
    'nav.callbacks': 'Callbacks',
    'nav.promiseBasics': 'Promise: Basics',
    'nav.promiseChains': 'Promise: Chains & Errors',
    'nav.promiseCombinators': 'Promise: Combinators',
    'nav.asyncAwait': 'async/await',
    'nav.asyncPatterns': 'async/await Patterns',
    'nav.generators': 'Generators',
    'nav.asyncGenerators': 'Async Generators',
    'nav.abortController': 'AbortController',
    'nav.rafRic': 'rAF & rIC',
    'nav.webWorkers': 'Web Workers',
    'nav.sharedMemory': 'SharedArrayBuffer & Atomics',
    'nav.realWorld': 'Real-World Patterns',

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
  },
}
