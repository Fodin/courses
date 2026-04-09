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
    'nav.networkingBasics': 'Сеть и протоколы',
    'nav.scalingFundamentals': 'Масштабирование',
    'nav.loadBalancing': 'Балансировка нагрузки',
    'nav.caching': 'Кэширование',
    'nav.databasesAndStorage': 'Базы данных и хранение',
    'nav.messageQueues': 'Очереди сообщений',
    'nav.apiDesign': 'Проектирование API',
    'nav.reliabilityPatterns': 'Паттерны надёжности',
    'nav.designUrlShortener': 'Проектируем: URL Shortener',
    'nav.designPasteService': 'Проектируем: Paste Service',
    'nav.designRateLimiter': 'Проектируем: Rate Limiter',
    'nav.designNotificationSystem': 'Проектируем: Уведомления',
    'nav.designChatSystem': 'Проектируем: Мессенджер',
    'nav.designNewsfeed': 'Проектируем: Лента новостей',
    'nav.designSearchSystem': 'Проектируем: Поиск',
    'nav.designDistributedCache': 'Проектируем: Распределённый кэш',
    'nav.designVideoStreaming': 'Проектируем: Видеостриминг',

    // Уровень 0 — Сеть и протоколы
    'task.0.1': 'Квиз: протоколы и сеть',
    'task.0.2': 'Калькулятор латентности',
    'task.0.3': 'Выбор протокола',

    // Уровень 1 — Масштабирование
    'task.1.1': 'Квиз: масштабирование',
    'task.1.2': 'Планировщик масштабирования',
    'task.1.3': 'Стратегия масштабирования',

    // Уровень 2 — Балансировка нагрузки
    'task.2.1': 'Квиз: балансировка',
    'task.2.2': 'Симулятор балансировки',
    'task.2.3': 'Визуализатор consistent hashing',
    'task.2.4': 'Проектирование балансировки',

    // Уровень 3 — Кэширование
    'task.3.1': 'Квиз: кэширование',
    'task.3.2': 'Симулятор кэша (LRU/LFU)',
    'task.3.3': 'Калькулятор кэш-стратегии',
    'task.3.4': 'Многоуровневый кэш',

    // Уровень 4 — Базы данных и хранение
    'task.4.1': 'Квиз: базы данных и CAP',
    'task.4.2': 'Визуализатор шардирования',
    'task.4.3': 'Выбор базы данных',
    'task.4.4': 'Схема репликации и шардирования',

    // Уровень 5 — Очереди сообщений
    'task.5.1': 'Квиз: очереди и асинхронность',
    'task.5.2': 'Визуализатор очереди сообщений',
    'task.5.3': 'Проектирование event pipeline',

    // Уровень 6 — Проектирование API
    'task.6.1': 'Квиз: API design',
    'task.6.2': 'Rate limiter симулятор',
    'task.6.3': 'Проектирование REST API',
    'task.6.4': 'API Gateway и BFF',

    // Уровень 7 — Паттерны надёжности
    'task.7.1': 'Квиз: надёжность',
    'task.7.2': 'Circuit breaker симулятор',
    'task.7.3': 'Калькулятор SLO/Error budget',
    'task.7.4': 'Стратегия надёжности',

    // Уровень 8 — URL Shortener
    'task.8.1': 'Квиз: URL shortener',
    'task.8.2': 'Архитектурный конструктор: URL Shortener',
    'task.8.3': 'Полный дизайн URL Shortener',

    // Уровень 9 — Paste Service
    'task.9.1': 'Квиз: хранение контента',
    'task.9.2': 'Capacity калькулятор',
    'task.9.3': 'Полный дизайн Paste Service',

    // Уровень 10 — Rate Limiter
    'task.10.1': 'Квиз: распределённый rate limiting',
    'task.10.2': 'Сравнение алгоритмов rate limiting',
    'task.10.3': 'Полный дизайн Rate Limiter',

    // Уровень 11 — Система уведомлений
    'task.11.1': 'Квиз: notification system',
    'task.11.2': 'Конструктор notification pipeline',
    'task.11.3': 'Полный дизайн Notification System',

    // Уровень 12 — Мессенджер
    'task.12.1': 'Квиз: real-time messaging',
    'task.12.2': 'Симулятор доставки сообщений',
    'task.12.3': 'Проектирование хранения сообщений',
    'task.12.4': 'Полный дизайн мессенджера',

    // Уровень 13 — Лента новостей
    'task.13.1': 'Квиз: feed generation',
    'task.13.2': 'Fan-out калькулятор',
    'task.13.3': 'Проектирование социального графа',
    'task.13.4': 'Полный дизайн News Feed',

    // Уровень 14 — Поисковая система
    'task.14.1': 'Квиз: поисковые системы',
    'task.14.2': 'Визуализатор inverted index',
    'task.14.3': 'Полный дизайн поисковой системы',

    // Уровень 15 — Распределённый кэш
    'task.15.1': 'Квиз: distributed cache',
    'task.15.2': 'Симулятор кластера',
    'task.15.3': 'Полный дизайн Distributed Cache',

    // Уровень 16 — Видеостриминг
    'task.16.1': 'Квиз: video streaming',
    'task.16.2': 'Калькулятор видеоинфраструктуры',
    'task.16.3': 'Проектирование transcoding pipeline',
    'task.16.4': 'Полный дизайн видеоплатформы',

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
    'level.0.desc': 'TCP/IP, HTTP/2, WebSocket, gRPC, DNS — как данные путешествуют по сети',
    'level.1.desc': 'Вертикальное и горизонтальное масштабирование, stateless/stateful, scaling cube',
    'level.2.desc': 'L4/L7 балансировка, алгоритмы, consistent hashing, health checks',
    'level.3.desc': 'Cache-aside, write-through, LRU/LFU, CDN, многоуровневое кэширование',
    'level.4.desc': 'SQL vs NoSQL, CAP-теорема, репликация, шардирование, индексы',
    'level.5.desc': 'RabbitMQ, Kafka, pub/sub, гарантии доставки, backpressure, CQRS',
    'level.6.desc': 'REST, GraphQL, gRPC, пагинация, rate limiting, API Gateway, BFF',
    'level.7.desc': 'Circuit breaker, retry, bulkhead, SLA/SLO, graceful degradation',
    'level.8.desc': 'Проектируем URL Shortener: хэширование, base62, кэширование, масштабирование',
    'level.9.desc': 'Проектируем Paste Service: object storage, CDN, metadata separation',
    'level.10.desc': 'Проектируем Rate Limiter: распределённое состояние, Redis, атомарность',
    'level.11.desc': 'Проектируем систему уведомлений: push/email/SMS, очереди приоритетов',
    'level.12.desc': 'Проектируем мессенджер: WebSocket, presence, доставка, группы',
    'level.13.desc': 'Проектируем ленту новостей: fan-out, социальный граф, ранжирование',
    'level.14.desc': 'Проектируем поиск: inverted index, TF-IDF, Elasticsearch, typeahead',
    'level.15.desc': 'Проектируем распределённый кэш: consistent hashing, gossip, репликация',
    'level.16.desc': 'Проектируем видеоплатформу: транскодирование, CDN, adaptive bitrate',
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
    'nav.networkingBasics': 'Networking Basics',
    'nav.scalingFundamentals': 'Scaling',
    'nav.loadBalancing': 'Load Balancing',
    'nav.caching': 'Caching',
    'nav.databasesAndStorage': 'Databases & Storage',
    'nav.messageQueues': 'Message Queues',
    'nav.apiDesign': 'API Design',
    'nav.reliabilityPatterns': 'Reliability Patterns',
    'nav.designUrlShortener': 'Design: URL Shortener',
    'nav.designPasteService': 'Design: Paste Service',
    'nav.designRateLimiter': 'Design: Rate Limiter',
    'nav.designNotificationSystem': 'Design: Notifications',
    'nav.designChatSystem': 'Design: Messenger',
    'nav.designNewsfeed': 'Design: News Feed',
    'nav.designSearchSystem': 'Design: Search',
    'nav.designDistributedCache': 'Design: Distributed Cache',
    'nav.designVideoStreaming': 'Design: Video Streaming',

    // Level 0 — Networking Basics
    'task.0.1': 'Quiz: protocols and networking',
    'task.0.2': 'Latency calculator',
    'task.0.3': 'Protocol selection',

    // Level 1 — Scaling
    'task.1.1': 'Quiz: scaling',
    'task.1.2': 'Scaling planner',
    'task.1.3': 'Scaling strategy',

    // Level 2 — Load Balancing
    'task.2.1': 'Quiz: load balancing',
    'task.2.2': 'Load balancing simulator',
    'task.2.3': 'Consistent hashing visualizer',
    'task.2.4': 'Load balancing design',

    // Level 3 — Caching
    'task.3.1': 'Quiz: caching',
    'task.3.2': 'Cache simulator (LRU/LFU)',
    'task.3.3': 'Cache strategy calculator',
    'task.3.4': 'Multi-level cache',

    // Level 4 — Databases & Storage
    'task.4.1': 'Quiz: databases and CAP',
    'task.4.2': 'Sharding visualizer',
    'task.4.3': 'Database selection',
    'task.4.4': 'Replication and sharding schema',

    // Level 5 — Message Queues
    'task.5.1': 'Quiz: queues and async',
    'task.5.2': 'Message queue visualizer',
    'task.5.3': 'Event pipeline design',

    // Level 6 — API Design
    'task.6.1': 'Quiz: API design',
    'task.6.2': 'Rate limiter simulator',
    'task.6.3': 'REST API design',
    'task.6.4': 'API Gateway and BFF',

    // Level 7 — Reliability Patterns
    'task.7.1': 'Quiz: reliability',
    'task.7.2': 'Circuit breaker simulator',
    'task.7.3': 'SLO/Error budget calculator',
    'task.7.4': 'Reliability strategy',

    // Level 8 — URL Shortener
    'task.8.1': 'Quiz: URL shortener',
    'task.8.2': 'Architecture builder: URL Shortener',
    'task.8.3': 'Full design: URL Shortener',

    // Level 9 — Paste Service
    'task.9.1': 'Quiz: content storage',
    'task.9.2': 'Capacity calculator',
    'task.9.3': 'Full design: Paste Service',

    // Level 10 — Rate Limiter
    'task.10.1': 'Quiz: distributed rate limiting',
    'task.10.2': 'Rate limiting algorithms comparison',
    'task.10.3': 'Full design: Rate Limiter',

    // Level 11 — Notification System
    'task.11.1': 'Quiz: notification system',
    'task.11.2': 'Notification pipeline builder',
    'task.11.3': 'Full design: Notification System',

    // Level 12 — Messenger
    'task.12.1': 'Quiz: real-time messaging',
    'task.12.2': 'Message delivery simulator',
    'task.12.3': 'Message storage design',
    'task.12.4': 'Full design: Messenger',

    // Level 13 — News Feed
    'task.13.1': 'Quiz: feed generation',
    'task.13.2': 'Fan-out calculator',
    'task.13.3': 'Social graph design',
    'task.13.4': 'Full design: News Feed',

    // Level 14 — Search System
    'task.14.1': 'Quiz: search systems',
    'task.14.2': 'Inverted index visualizer',
    'task.14.3': 'Full design: Search System',

    // Level 15 — Distributed Cache
    'task.15.1': 'Quiz: distributed cache',
    'task.15.2': 'Cluster simulator',
    'task.15.3': 'Full design: Distributed Cache',

    // Level 16 — Video Streaming
    'task.16.1': 'Quiz: video streaming',
    'task.16.2': 'Video infrastructure calculator',
    'task.16.3': 'Transcoding pipeline design',
    'task.16.4': 'Full design: Video Platform',

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
    'quiz.wrong': '❌ Incorrect',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.select': 'Select language',
    'language.ru': 'Русский',
    'language.en': 'English',
    'scroll.top': 'Back to top',

    // Level descriptions
    'level.0.desc': 'TCP/IP, HTTP/2, WebSocket, gRPC, DNS — how data travels across the network',
    'level.1.desc': 'Vertical and horizontal scaling, stateless/stateful, scaling cube',
    'level.2.desc': 'L4/L7 balancing, algorithms, consistent hashing, health checks',
    'level.3.desc': 'Cache-aside, write-through, LRU/LFU, CDN, multi-level caching',
    'level.4.desc': 'SQL vs NoSQL, CAP theorem, replication, sharding, indexes',
    'level.5.desc': 'RabbitMQ, Kafka, pub/sub, delivery guarantees, backpressure, CQRS',
    'level.6.desc': 'REST, GraphQL, gRPC, pagination, rate limiting, API Gateway, BFF',
    'level.7.desc': 'Circuit breaker, retry, bulkhead, SLA/SLO, graceful degradation',
    'level.8.desc': 'Design URL Shortener: hashing, base62, caching, scaling',
    'level.9.desc': 'Design Paste Service: object storage, CDN, metadata separation',
    'level.10.desc': 'Design Rate Limiter: distributed state, Redis, atomicity',
    'level.11.desc': 'Design Notification System: push/email/SMS, priority queues',
    'level.12.desc': 'Design Messenger: WebSocket, presence, delivery, groups',
    'level.13.desc': 'Design News Feed: fan-out, social graph, ranking',
    'level.14.desc': 'Design Search: inverted index, TF-IDF, Elasticsearch, typeahead',
    'level.15.desc': 'Design Distributed Cache: consistent hashing, gossip, replication',
    'level.16.desc': 'Design Video Platform: transcoding, CDN, adaptive bitrate',
  },
}
