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
    'nav.eventLoop': 'Event Loop',
    'nav.modules': 'Модули',
    'nav.eventEmitter': 'EventEmitter',
    'nav.buffersAndEncoding': 'Буферы и бинарные данные',
    'nav.fileSystem': 'Файловая система',
    'nav.streams': 'Потоки (Streams)',
    'nav.networking': 'Сеть и HTTP',
    'nav.childProcesses': 'Дочерние процессы',
    'nav.workerThreads': 'Worker Threads',
    'nav.clusterAndProcess': 'Cluster, Process & OS',
    'nav.crypto': 'Криптография',
    'nav.timersAndAsync': 'Таймеры и async',
    'nav.errorHandling': 'Обработка ошибок',
    'nav.diagnosticsAndPerf': 'Диагностика и производительность',

    // Уровень 0 — Event Loop
    'task.0.1': 'Порядок фаз Event Loop',
    'task.0.2': 'Микрозадачи vs макрозадачи',
    'task.0.3': 'Голодание nextTick',
    'task.0.4': 'Реальный порядок выполнения',

    // Уровень 1 — Modules
    'task.1.1': 'CJS require/exports',
    'task.1.2': 'ESM import/export и top-level await',
    'task.1.3': 'Циклические зависимости',
    'task.1.4': 'package.json exports/imports',

    // Уровень 2 — EventEmitter
    'task.2.1': 'Базовый on/emit/off',
    'task.2.2': 'Error-события и maxListeners',
    'task.2.3': 'once() и async-итератор',

    // Уровень 3 — Buffers
    'task.3.1': 'Buffer.from/alloc и кодировки',
    'task.3.2': 'TypedArray и ArrayBuffer interop',
    'task.3.3': 'Парсинг бинарного протокола',

    // Уровень 4 — File System
    'task.4.1': 'Синхронное/асинхронное чтение и запись',
    'task.4.2': 'Модуль path',
    'task.4.3': 'Обход директорий и glob',
    'task.4.4': 'fs.watch',

    // Уровень 5 — Streams
    'task.5.1': 'Readable (flowing/paused)',
    'task.5.2': 'Writable и drain',
    'task.5.3': 'Transform',
    'task.5.4': 'pipeline() и ошибки',
    'task.5.5': 'Backpressure и highWaterMark',

    // Уровень 6 — Networking
    'task.6.1': 'TCP сервер/клиент (net)',
    'task.6.2': 'HTTP с нуля',
    'task.6.3': 'URL/URLSearchParams/dns',
    'task.6.4': 'HTTPS/TLS',

    // Уровень 7 — Child Processes
    'task.7.1': 'exec/execFile',
    'task.7.2': 'spawn и потоковый stdio',
    'task.7.3': 'fork и IPC',

    // Уровень 8 — Worker Threads
    'task.8.1': 'Базовый Worker и parentPort',
    'task.8.2': 'SharedArrayBuffer и Atomics',
    'task.8.3': 'Пул воркеров',

    // Уровень 9 — Cluster, Process & OS
    'task.9.1': 'Process (env, argv, memory)',
    'task.9.2': 'Сигналы и graceful shutdown',
    'task.9.3': 'Модуль OS',
    'task.9.4': 'Cluster и zero-downtime restart',

    // Уровень 10 — Crypto
    'task.10.1': 'Хеширование, HMAC и randomBytes',
    'task.10.2': 'Симметричное шифрование (AES-GCM)',
    'task.10.3': 'Асимметричная криптография (sign/verify)',

    // Уровень 11 — Timers & Async
    'task.11.1': 'Внутренности таймеров (ref/unref)',
    'task.11.2': 'AbortController/AbortSignal',
    'task.11.3': 'Async-итераторы и генераторы',

    // Уровень 12 — Error Handling
    'task.12.1': 'Классы ошибок: operational vs programmer',
    'task.12.2': 'uncaughtException/unhandledRejection',
    'task.12.3': 'Ошибки в потоках/событиях/async',

    // Уровень 13 — Diagnostics & Perf
    'task.13.1': 'perf_hooks (measure, timerify)',
    'task.13.2': 'Профилирование памяти и утечки',
    'task.13.3': 'Zlib-сжатие и pipeline',
    'task.13.4': 'Util/Console/Readline',

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
    'level.0.desc': 'Фазы Event Loop, микро/макрозадачи, nextTick, порядок выполнения',
    'level.1.desc': 'CJS, ESM, циклические зависимости, package.json exports',
    'level.2.desc': 'on/emit/off, error-события, once(), async-итератор',
    'level.3.desc': 'Buffer, TypedArray, ArrayBuffer, парсинг бинарных протоколов',
    'level.4.desc': 'Чтение/запись файлов, path, обход директорий, fs.watch',
    'level.5.desc': 'Readable, Writable, Transform, pipeline, backpressure',
    'level.6.desc': 'TCP, HTTP, URL, URLSearchParams, HTTPS/TLS',
    'level.7.desc': 'exec, spawn, fork, IPC, потоковый ввод/вывод',
    'level.8.desc': 'Worker, parentPort, SharedArrayBuffer, Atomics, пул воркеров',
    'level.9.desc': 'process, сигналы, graceful shutdown, OS, Cluster',
    'level.10.desc': 'Хеширование, HMAC, AES-GCM, RSA sign/verify',
    'level.11.desc': 'ref/unref, AbortController, async-итераторы и генераторы',
    'level.12.desc': 'Классы ошибок, uncaughtException, ошибки в потоках и событиях',
    'level.13.desc': 'perf_hooks, профилирование памяти, Zlib, Util/Console/Readline',
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
    'nav.eventLoop': 'Event Loop',
    'nav.modules': 'Modules',
    'nav.eventEmitter': 'EventEmitter',
    'nav.buffersAndEncoding': 'Buffers & Binary Data',
    'nav.fileSystem': 'File System',
    'nav.streams': 'Streams',
    'nav.networking': 'Networking & HTTP',
    'nav.childProcesses': 'Child Processes',
    'nav.workerThreads': 'Worker Threads',
    'nav.clusterAndProcess': 'Cluster, Process & OS',
    'nav.crypto': 'Crypto',
    'nav.timersAndAsync': 'Timers & Async',
    'nav.errorHandling': 'Error Handling',
    'nav.diagnosticsAndPerf': 'Diagnostics & Performance',

    // Level 0 — Event Loop
    'task.0.1': 'Event Loop phases order',
    'task.0.2': 'Microtasks vs macrotasks',
    'task.0.3': 'nextTick starvation',
    'task.0.4': 'Real-world ordering puzzle',

    // Level 1 — Modules
    'task.1.1': 'CJS require/exports',
    'task.1.2': 'ESM import/export & top-level await',
    'task.1.3': 'Circular dependencies',
    'task.1.4': 'package.json exports/imports',

    // Level 2 — EventEmitter
    'task.2.1': 'Basic on/emit/off',
    'task.2.2': 'Error events & maxListeners',
    'task.2.3': 'once() & async iterator',

    // Level 3 — Buffers
    'task.3.1': 'Buffer.from/alloc & encoding',
    'task.3.2': 'TypedArray & ArrayBuffer interop',
    'task.3.3': 'Binary protocol parsing',

    // Level 4 — File System
    'task.4.1': 'Sync/async read & write',
    'task.4.2': 'Path module',
    'task.4.3': 'Directory traversal & glob',
    'task.4.4': 'fs.watch',

    // Level 5 — Streams
    'task.5.1': 'Readable (flowing/paused)',
    'task.5.2': 'Writable & drain',
    'task.5.3': 'Transform',
    'task.5.4': 'pipeline() & errors',
    'task.5.5': 'Backpressure & highWaterMark',

    // Level 6 — Networking
    'task.6.1': 'TCP server/client (net)',
    'task.6.2': 'HTTP from scratch',
    'task.6.3': 'URL/URLSearchParams/dns',
    'task.6.4': 'HTTPS/TLS',

    // Level 7 — Child Processes
    'task.7.1': 'exec/execFile',
    'task.7.2': 'spawn & streaming stdio',
    'task.7.3': 'fork & IPC',

    // Level 8 — Worker Threads
    'task.8.1': 'Basic Worker & parentPort',
    'task.8.2': 'SharedArrayBuffer & Atomics',
    'task.8.3': 'Worker pool',

    // Level 9 — Cluster, Process & OS
    'task.9.1': 'Process (env, argv, memory)',
    'task.9.2': 'Signals & graceful shutdown',
    'task.9.3': 'OS module',
    'task.9.4': 'Cluster & zero-downtime restart',

    // Level 10 — Crypto
    'task.10.1': 'Hashing, HMAC & randomBytes',
    'task.10.2': 'Symmetric encryption (AES-GCM)',
    'task.10.3': 'Asymmetric crypto (sign/verify)',

    // Level 11 — Timers & Async
    'task.11.1': 'Timer internals (ref/unref)',
    'task.11.2': 'AbortController/AbortSignal',
    'task.11.3': 'Async iterators & generators',

    // Level 12 — Error Handling
    'task.12.1': 'Error classes: operational vs programmer',
    'task.12.2': 'uncaughtException/unhandledRejection',
    'task.12.3': 'Errors in streams/events/async',

    // Level 13 — Diagnostics & Perf
    'task.13.1': 'perf_hooks (measure, timerify)',
    'task.13.2': 'Memory profiling & leak detection',
    'task.13.3': 'Zlib compression & pipeline',
    'task.13.4': 'Util/Console/Readline',

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
    'level.0.desc': 'Event Loop phases, micro/macrotasks, nextTick, execution order',
    'level.1.desc': 'CJS, ESM, circular deps, package.json exports',
    'level.2.desc': 'on/emit/off, error events, once(), async iterator',
    'level.3.desc': 'Buffer, TypedArray, ArrayBuffer, binary protocol parsing',
    'level.4.desc': 'File read/write, path, directory traversal, fs.watch',
    'level.5.desc': 'Readable, Writable, Transform, pipeline, backpressure',
    'level.6.desc': 'TCP, HTTP, URL, URLSearchParams, HTTPS/TLS',
    'level.7.desc': 'exec, spawn, fork, IPC, streaming I/O',
    'level.8.desc': 'Worker, parentPort, SharedArrayBuffer, Atomics, worker pool',
    'level.9.desc': 'process, signals, graceful shutdown, OS, Cluster',
    'level.10.desc': 'Hashing, HMAC, AES-GCM, RSA sign/verify',
    'level.11.desc': 'ref/unref, AbortController, async iterators & generators',
    'level.12.desc': 'Error classes, uncaughtException, errors in streams & events',
    'level.13.desc': 'perf_hooks, memory profiling, Zlib, Util/Console/Readline',
  },
}
