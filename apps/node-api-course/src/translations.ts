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
    'nav.httpFromScratch': 'HTTP с нуля',
    'nav.expressBasics': 'Express',
    'nav.fastify': 'Fastify',
    'nav.restApiDesign': 'REST API Design',
    'nav.validationAndSerialization': 'Validation & Serialization',
    'nav.middlewarePatterns': 'Middleware Patterns',
    'nav.authentication': 'Authentication',
    'nav.databaseSql': 'SQL Databases',
    'nav.databaseNosql': 'NoSQL Databases',
    'nav.realtime': 'WebSockets & Real-time',
    'nav.fileUploads': 'File Uploads',
    'nav.testingApis': 'Testing APIs',
    'nav.security': 'Security',
    'nav.loggingAndMonitoring': 'Logging & Monitoring',
    'nav.productionPatterns': 'Production Patterns',

    // Уровень 0 — HTTP с нуля
    'task.0.1': 'createServer & req/res',
    'task.0.2': 'Ручной роутинг и query params',
    'task.0.3': 'Раздача статических файлов',
    'task.0.4': 'Парсинг тела POST-запроса',

    // Уровень 1 — Express
    'task.1.1': 'Routes, Router и параметры',
    'task.1.2': 'Цепочка middleware и next()',
    'task.1.3': 'Error-handling middleware',
    'task.1.4': 'Шаблонизаторы (EJS)',

    // Уровень 2 — Fastify
    'task.2.1': 'Роуты и JSON schema validation',
    'task.2.2': 'Плагины и декораторы',
    'task.2.3': 'Hooks lifecycle',

    // Уровень 3 — REST API Design
    'task.3.1': 'CRUD, HTTP-методы и статусы',
    'task.3.2': 'Пагинация (offset/cursor)',
    'task.3.3': 'Сортировка и выбор полей',
    'task.3.4': 'Версионирование API',

    // Уровень 4 — Validation & Serialization
    'task.4.1': 'Zod-схемы',
    'task.4.2': 'Joi validation',
    'task.4.3': 'Response DTO и сериализация',

    // Уровень 5 — Middleware Patterns
    'task.5.1': 'Логирование и замер времени запроса',
    'task.5.2': 'CORS',
    'task.5.3': 'Rate limiting',
    'task.5.4': 'Compression и ETag',

    // Уровень 6 — Authentication
    'task.6.1': 'Cookie sessions',
    'task.6.2': 'JWT',
    'task.6.3': 'Ротация refresh-токенов',
    'task.6.4': 'OAuth 2.0 flow',
    'task.6.5': 'RBAC middleware',

    // Уровень 7 — SQL Databases
    'task.7.1': 'Raw pg и параметризованные запросы',
    'task.7.2': 'Knex query builder и миграции',
    'task.7.3': 'Prisma ORM',
    'task.7.4': 'Транзакции и пулинг',

    // Уровень 8 — NoSQL Databases
    'task.8.1': 'MongoDB native driver',
    'task.8.2': 'Mongoose',
    'task.8.3': 'Redis caching и pub/sub',

    // Уровень 9 — WebSockets & Real-time
    'task.9.1': 'Библиотека ws',
    'task.9.2': 'Socket.io rooms и namespaces',
    'task.9.3': 'SSE (Server-Sent Events)',
    'task.9.4': 'Pub/sub через Redis',

    // Уровень 10 — File Uploads
    'task.10.1': 'Multer (single/multiple/filters)',
    'task.10.2': 'Streaming uploads и обработка',

    // Уровень 11 — Testing APIs
    'task.11.1': 'Unit-тесты и мокирование',
    'task.11.2': 'Интеграционные тесты (supertest)',
    'task.11.3': 'Управление тестовой БД и фикстуры',

    // Уровень 12 — Security
    'task.12.1': 'Helmet и заголовки безопасности',
    'task.12.2': 'Санитизация и защита от инъекций',
    'task.12.3': 'CSRF и parameter pollution',

    // Уровень 13 — Logging & Monitoring
    'task.13.1': 'Pino structured logging',
    'task.13.2': 'Winston и ротация логов',
    'task.13.3': 'Health checks и OpenAPI/Swagger',

    // Уровень 14 — Production Patterns
    'task.14.1': 'BullMQ job queues',
    'task.14.2': 'Cron scheduling',
    'task.14.3': 'Graceful shutdown',
    'task.14.4': 'GraphQL basics (Apollo)',

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
    'level.0.desc': 'http.createServer, роутинг, статика, парсинг тела запроса',
    'level.1.desc': 'Роуты, Router, middleware, обработка ошибок, EJS',
    'level.2.desc': 'JSON schema, плагины, декораторы, hooks',
    'level.3.desc': 'CRUD, HTTP-методы, пагинация, сортировка, версионирование',
    'level.4.desc': 'Zod, Joi, DTO, сериализация ответов',
    'level.5.desc': 'Логирование, CORS, rate limiting, compression',
    'level.6.desc': 'Sessions, JWT, refresh tokens, OAuth 2.0, RBAC',
    'level.7.desc': 'pg, Knex, Prisma, транзакции, пулинг соединений',
    'level.8.desc': 'MongoDB, Mongoose, Redis caching и pub/sub',
    'level.9.desc': 'ws, Socket.io, SSE, pub/sub через Redis',
    'level.10.desc': 'Multer, streaming uploads, обработка файлов',
    'level.11.desc': 'Unit-тесты, supertest, тестовая БД, фикстуры',
    'level.12.desc': 'Helmet, санитизация, CSRF, parameter pollution',
    'level.13.desc': 'Pino, Winston, health checks, OpenAPI/Swagger',
    'level.14.desc': 'BullMQ, cron, graceful shutdown, GraphQL (Apollo)',
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
    'nav.httpFromScratch': 'HTTP from Scratch',
    'nav.expressBasics': 'Express',
    'nav.fastify': 'Fastify',
    'nav.restApiDesign': 'REST API Design',
    'nav.validationAndSerialization': 'Validation & Serialization',
    'nav.middlewarePatterns': 'Middleware Patterns',
    'nav.authentication': 'Authentication',
    'nav.databaseSql': 'SQL Databases',
    'nav.databaseNosql': 'NoSQL Databases',
    'nav.realtime': 'WebSockets & Real-time',
    'nav.fileUploads': 'File Uploads',
    'nav.testingApis': 'Testing APIs',
    'nav.security': 'Security',
    'nav.loggingAndMonitoring': 'Logging & Monitoring',
    'nav.productionPatterns': 'Production Patterns',

    // Level 0 — HTTP from Scratch
    'task.0.1': 'createServer & req/res',
    'task.0.2': 'Manual routing & query params',
    'task.0.3': 'Static file serving',
    'task.0.4': 'POST body parsing',

    // Level 1 — Express
    'task.1.1': 'Routes, Router & params',
    'task.1.2': 'Middleware chain & next()',
    'task.1.3': 'Error-handling middleware',
    'task.1.4': 'Template engines (EJS)',

    // Level 2 — Fastify
    'task.2.1': 'Routes & JSON schema validation',
    'task.2.2': 'Plugins & decorators',
    'task.2.3': 'Hooks lifecycle',

    // Level 3 — REST API Design
    'task.3.1': 'CRUD, HTTP methods & statuses',
    'task.3.2': 'Pagination (offset/cursor)',
    'task.3.3': 'Sorting & field selection',
    'task.3.4': 'API versioning',

    // Level 4 — Validation & Serialization
    'task.4.1': 'Zod schemas',
    'task.4.2': 'Joi validation',
    'task.4.3': 'Response DTOs & serialization',

    // Level 5 — Middleware Patterns
    'task.5.1': 'Logging & request timing',
    'task.5.2': 'CORS',
    'task.5.3': 'Rate limiting',
    'task.5.4': 'Compression & ETag',

    // Level 6 — Authentication
    'task.6.1': 'Cookie sessions',
    'task.6.2': 'JWT',
    'task.6.3': 'Refresh token rotation',
    'task.6.4': 'OAuth 2.0 flow',
    'task.6.5': 'RBAC middleware',

    // Level 7 — SQL Databases
    'task.7.1': 'Raw pg & parameterized queries',
    'task.7.2': 'Knex query builder & migrations',
    'task.7.3': 'Prisma ORM',
    'task.7.4': 'Transactions & pooling',

    // Level 8 — NoSQL Databases
    'task.8.1': 'MongoDB native driver',
    'task.8.2': 'Mongoose',
    'task.8.3': 'Redis caching & pub/sub',

    // Level 9 — WebSockets & Real-time
    'task.9.1': 'ws library',
    'task.9.2': 'Socket.io rooms & namespaces',
    'task.9.3': 'SSE (Server-Sent Events)',
    'task.9.4': 'Pub/sub with Redis',

    // Level 10 — File Uploads
    'task.10.1': 'Multer (single/multiple/filters)',
    'task.10.2': 'Streaming uploads & processing',

    // Level 11 — Testing APIs
    'task.11.1': 'Unit tests & mocking',
    'task.11.2': 'Integration tests (supertest)',
    'task.11.3': 'Test DB management & fixtures',

    // Level 12 — Security
    'task.12.1': 'Helmet & security headers',
    'task.12.2': 'Sanitization & injection prevention',
    'task.12.3': 'CSRF & parameter pollution',

    // Level 13 — Logging & Monitoring
    'task.13.1': 'Pino structured logging',
    'task.13.2': 'Winston & log rotation',
    'task.13.3': 'Health checks & OpenAPI/Swagger',

    // Level 14 — Production Patterns
    'task.14.1': 'BullMQ job queues',
    'task.14.2': 'Cron scheduling',
    'task.14.3': 'Graceful shutdown',
    'task.14.4': 'GraphQL basics (Apollo)',

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
    'level.0.desc': 'http.createServer, routing, static files, body parsing',
    'level.1.desc': 'Routes, Router, middleware, error handling, EJS',
    'level.2.desc': 'JSON schema, plugins, decorators, hooks',
    'level.3.desc': 'CRUD, HTTP methods, pagination, sorting, versioning',
    'level.4.desc': 'Zod, Joi, DTOs, response serialization',
    'level.5.desc': 'Logging, CORS, rate limiting, compression',
    'level.6.desc': 'Sessions, JWT, refresh tokens, OAuth 2.0, RBAC',
    'level.7.desc': 'pg, Knex, Prisma, transactions, connection pooling',
    'level.8.desc': 'MongoDB, Mongoose, Redis caching & pub/sub',
    'level.9.desc': 'ws, Socket.io, SSE, pub/sub with Redis',
    'level.10.desc': 'Multer, streaming uploads, file processing',
    'level.11.desc': 'Unit tests, supertest, test DB, fixtures',
    'level.12.desc': 'Helmet, sanitization, CSRF, parameter pollution',
    'level.13.desc': 'Pino, Winston, health checks, OpenAPI/Swagger',
    'level.14.desc': 'BullMQ, cron, graceful shutdown, GraphQL (Apollo)',
  },
}
