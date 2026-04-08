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
    'nav.microservicesIntro': 'Введение в микросервисы',
    'nav.syncCommunication': 'Синхронная коммуникация',
    'nav.asyncMessaging': 'Асинхронная коммуникация',
    'nav.brokerFundamentals': 'Основы брокеров',
    'nav.rabbitmqBasics': 'RabbitMQ: основы',
    'nav.rabbitmqExchanges': 'RabbitMQ: Exchange',
    'nav.rabbitmqReliability': 'RabbitMQ: надёжность',
    'nav.rabbitmqAdvanced': 'RabbitMQ: продвинутое',
    'nav.kafkaBasics': 'Kafka: основы',
    'nav.kafkaProducersConsumers': 'Kafka: Producers/Consumers',
    'nav.kafkaAdvanced': 'Kafka: продвинутое',
    'nav.brokerComparison': 'Сравнение брокеров',
    'nav.eventDriven': 'Event-Driven Architecture',
    'nav.sagaPattern': 'Паттерн Saga',
    'nav.reliabilityPatterns': 'Паттерны надёжности',
    'nav.exactlyOnceOutbox': 'Exactly-Once и Outbox',
    'nav.observability': 'Наблюдаемость',
    'nav.realWorldArchitectures': 'Реальные архитектуры',

    // Описания уровней
    'level.0.desc':
      'Монолит vs микросервисы, преимущества и недостатки, когда применять микросервисную архитектуру',
    'level.1.desc':
      'REST, gRPC, GraphQL — паттерны синхронного взаимодействия между сервисами',
    'level.2.desc':
      'Зачем нужны очереди сообщений, point-to-point vs pub/sub, гарантии доставки',
    'level.3.desc':
      'Что такое брокер, протокол AMQP, producers, consumers, exchanges, queues',
    'level.4.desc':
      'Архитектура RabbitMQ, Erlang VM, Management UI, virtual hosts, пользователи',
    'level.5.desc':
      'Direct, Fanout, Topic, Headers — типы exchange и маршрутизация сообщений',
    'level.6.desc':
      'Publisher confirms, consumer ACK, persistent messages, prefetch',
    'level.7.desc':
      'Dead Letter Exchanges, RPC pattern, priority queues, delayed messages',
    'level.8.desc':
      'Архитектура Kafka, append-only лог, брокеры, topics, partitions, ZooKeeper/KRaft',
    'level.9.desc':
      'Producer API, стратегии партиционирования, Consumer Groups, offset management, rebalancing',
    'level.10.desc':
      'Kafka Streams, Kafka Connect, Schema Registry, exactly-once, compacted topics',
    'level.11.desc':
      'Kafka vs RabbitMQ vs NATS vs Redis Streams vs Pulsar — архитектурное сравнение',
    'level.12.desc':
      'Event Sourcing, CQRS, Domain Events, хореография vs оркестрация',
    'level.13.desc':
      'Распределённые транзакции, Saga choreography и orchestration, компенсирующие действия',
    'level.14.desc':
      'Dead Letter Queues, retry с backoff, idempotency, deduplication, poison messages',
    'level.15.desc':
      'Проблема двойной записи, Transactional Outbox, CDC, Debezium',
    'level.16.desc':
      'Метрики брокеров, distributed tracing, consumer lag, alerting',
    'level.17.desc':
      'E-commerce, централизованное логирование, выбор архитектуры для реальных задач',

    // Задания (общее)
    'task.title': 'Задание',
    'task.description': '📋 Описание задания',
    'task.yourForm': '🎯 Ваш компонент:',
    'task.placeholder': 'Ваш компонент появится здесь',
    'task.openFile': 'Откройте файл',
    'task.andComplete': 'и выполните задание',
    'task.formReady': 'Компонент реализован!',
    'task.markComplete': 'Отметить как выполненное',
    'task.markIncomplete': 'Отметить как не выполненное',

    // Теория
    'theory.title': '📚 Теория',
    'theory.loading': 'Загрузка теории...',
    'theory.brief': 'Кратко',
    'theory.detailed': 'Развёрнуто',
    'theory.notFound': 'Теория для этого уровня не найдена.',

    // Квиз
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

    // Уровень 0 — задания
    'task.0.1': 'Монолит vs микросервисы',
    'task.0.2': 'Карта зависимостей сервисов',
    'task.0.3': 'Калькулятор trade-offs',

    // Уровень 1
    'task.1.1': 'REST vs gRPC: симулятор',
    'task.1.2': 'Каскадные отказы',
    'task.1.3': 'Service Discovery',

    // Уровень 2
    'task.2.1': 'Sync vs Async: сравнение',
    'task.2.2': 'Point-to-Point очередь',
    'task.2.3': 'Pub/Sub: fan-out',

    // Уровень 3
    'task.3.1': 'Анатомия брокера сообщений',
    'task.3.2': 'Протокол AMQP: фреймы',
    'task.3.3': 'ACK/NACK симулятор',

    // Уровень 4
    'task.4.1': 'Архитектура RabbitMQ',
    'task.4.2': 'Management UI: дашборд',
    'task.4.3': 'Virtual Hosts и права',

    // Уровень 5
    'task.5.1': 'Direct Exchange',
    'task.5.2': 'Fanout Exchange',
    'task.5.3': 'Topic Exchange',
    'task.5.4': 'Headers Exchange и сравнение',

    // Уровень 6
    'task.6.1': 'Publisher Confirms',
    'task.6.2': 'Consumer Prefetch',
    'task.6.3': 'Durable vs Transient',

    // Уровень 7
    'task.7.1': 'Dead Letter Exchange',
    'task.7.2': 'RPC через RabbitMQ',
    'task.7.3': 'Priority Queue и Delayed Messages',

    // Уровень 8
    'task.8.1': 'Кластер Kafka: брокеры и контроллер',
    'task.8.2': 'Append-only лог',
    'task.8.3': 'Topics и Partitions',

    // Уровень 9
    'task.9.1': 'Стратегии партиционирования',
    'task.9.2': 'Consumer Groups',
    'task.9.3': 'Offset Management',
    'task.9.4': 'Consumer Rebalancing',

    // Уровень 10
    'task.10.1': 'Kafka Streams: топология',
    'task.10.2': 'Compacted Topics',
    'task.10.3': 'Exactly-Once: транзакции',

    // Уровень 11
    'task.11.1': 'Архитектурное сравнение брокеров',
    'task.11.2': 'Модели доставки',
    'task.11.3': 'Decision Tree: выбор брокера',
    'task.11.4': 'Benchmark Dashboard',

    // Уровень 12
    'task.12.1': 'Event Sourcing',
    'task.12.2': 'CQRS',
    'task.12.3': 'Хореография vs оркестрация',

    // Уровень 13
    'task.13.1': 'Saga Choreography',
    'task.13.2': 'Saga Orchestration',
    'task.13.3': 'Компенсирующие действия',

    // Уровень 14
    'task.14.1': 'Retry с Exponential Backoff',
    'task.14.2': 'Idempotency: дедупликация',
    'task.14.3': 'Poison Message: карантин',

    // Уровень 15
    'task.15.1': 'Проблема двойной записи',
    'task.15.2': 'Transactional Outbox',
    'task.15.3': 'CDC (Change Data Capture)',

    // Уровень 16
    'task.16.1': 'Consumer Lag дашборд',
    'task.16.2': 'Distributed Tracing',
    'task.16.3': 'Alerting: конфигуратор',

    // Уровень 17
    'task.17.1': 'E-Commerce: архитектура заказа',
    'task.17.2': 'Централизованное логирование',
    'task.17.3': 'Выбор архитектуры: кейс',
  },
  en: {
    // Общие
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',

    // Навигация
    'nav.title': '📚 Levels',
    'nav.levels': 'Levels',
    'nav.level': 'Level',
    'nav.microservicesIntro': 'Intro to Microservices',
    'nav.syncCommunication': 'Sync Communication',
    'nav.asyncMessaging': 'Async Messaging',
    'nav.brokerFundamentals': 'Broker Fundamentals',
    'nav.rabbitmqBasics': 'RabbitMQ: Basics',
    'nav.rabbitmqExchanges': 'RabbitMQ: Exchanges',
    'nav.rabbitmqReliability': 'RabbitMQ: Reliability',
    'nav.rabbitmqAdvanced': 'RabbitMQ: Advanced',
    'nav.kafkaBasics': 'Kafka: Basics',
    'nav.kafkaProducersConsumers': 'Kafka: Producers/Consumers',
    'nav.kafkaAdvanced': 'Kafka: Advanced',
    'nav.brokerComparison': 'Broker Comparison',
    'nav.eventDriven': 'Event-Driven Architecture',
    'nav.sagaPattern': 'Saga Pattern',
    'nav.reliabilityPatterns': 'Reliability Patterns',
    'nav.exactlyOnceOutbox': 'Exactly-Once & Outbox',
    'nav.observability': 'Observability',
    'nav.realWorldArchitectures': 'Real-World Architectures',

    // Level descriptions
    'level.0.desc': 'Monolith vs microservices, pros and cons, when to use microservice architecture',
    'level.1.desc': 'REST, gRPC, GraphQL — synchronous communication patterns between services',
    'level.2.desc': 'Why message queues, point-to-point vs pub/sub, delivery guarantees',
    'level.3.desc': 'What is a broker, AMQP protocol, producers, consumers, exchanges, queues',
    'level.4.desc': 'RabbitMQ architecture, Erlang VM, Management UI, virtual hosts, users',
    'level.5.desc': 'Direct, Fanout, Topic, Headers — exchange types and message routing',
    'level.6.desc': 'Publisher confirms, consumer ACK, persistent messages, prefetch',
    'level.7.desc': 'Dead Letter Exchanges, RPC pattern, priority queues, delayed messages',
    'level.8.desc': 'Kafka architecture, append-only log, brokers, topics, partitions, ZooKeeper/KRaft',
    'level.9.desc': 'Producer API, partitioning strategies, Consumer Groups, offset management, rebalancing',
    'level.10.desc': 'Kafka Streams, Kafka Connect, Schema Registry, exactly-once, compacted topics',
    'level.11.desc': 'Kafka vs RabbitMQ vs NATS vs Redis Streams vs Pulsar — architectural comparison',
    'level.12.desc': 'Event Sourcing, CQRS, Domain Events, choreography vs orchestration',
    'level.13.desc': 'Distributed transactions, Saga choreography and orchestration, compensating actions',
    'level.14.desc': 'Dead Letter Queues, retry with backoff, idempotency, deduplication, poison messages',
    'level.15.desc': 'Dual write problem, Transactional Outbox, CDC, Debezium',
    'level.16.desc': 'Broker metrics, distributed tracing, consumer lag, alerting',
    'level.17.desc': 'E-commerce, centralized logging, choosing architecture for real-world tasks',

    // Tasks (common)
    'task.title': 'Task',
    'task.description': '📋 Task Description',
    'task.yourForm': '🎯 Your component:',
    'task.placeholder': 'Your component will appear here',
    'task.openFile': 'Open file',
    'task.andComplete': 'and complete the task',
    'task.formReady': 'Component is implemented!',
    'task.markComplete': 'Mark as complete',
    'task.markIncomplete': 'Mark as incomplete',

    // Theory
    'theory.title': '📚 Theory',
    'theory.loading': 'Loading theory...',
    'theory.brief': 'Brief',
    'theory.detailed': 'Detailed',
    'theory.notFound': 'Theory for this level was not found.',

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

    // Tasks
    'task.0.1': 'Monolith vs Microservices',
    'task.0.2': 'Service Dependency Map',
    'task.0.3': 'Trade-offs Calculator',
    'task.1.1': 'REST vs gRPC: Simulator',
    'task.1.2': 'Cascading Failures',
    'task.1.3': 'Service Discovery',
    'task.2.1': 'Sync vs Async: Comparison',
    'task.2.2': 'Point-to-Point Queue',
    'task.2.3': 'Pub/Sub: Fan-out',
    'task.3.1': 'Message Broker Anatomy',
    'task.3.2': 'AMQP Protocol: Frames',
    'task.3.3': 'ACK/NACK Simulator',
    'task.4.1': 'RabbitMQ Architecture',
    'task.4.2': 'Management UI: Dashboard',
    'task.4.3': 'Virtual Hosts & Permissions',
    'task.5.1': 'Direct Exchange',
    'task.5.2': 'Fanout Exchange',
    'task.5.3': 'Topic Exchange',
    'task.5.4': 'Headers Exchange & Comparison',
    'task.6.1': 'Publisher Confirms',
    'task.6.2': 'Consumer Prefetch',
    'task.6.3': 'Durable vs Transient',
    'task.7.1': 'Dead Letter Exchange',
    'task.7.2': 'RPC via RabbitMQ',
    'task.7.3': 'Priority Queue & Delayed Messages',
    'task.8.1': 'Kafka Cluster: Brokers & Controller',
    'task.8.2': 'Append-only Log',
    'task.8.3': 'Topics & Partitions',
    'task.9.1': 'Partitioning Strategies',
    'task.9.2': 'Consumer Groups',
    'task.9.3': 'Offset Management',
    'task.9.4': 'Consumer Rebalancing',
    'task.10.1': 'Kafka Streams: Topology',
    'task.10.2': 'Compacted Topics',
    'task.10.3': 'Exactly-Once: Transactions',
    'task.11.1': 'Architectural Broker Comparison',
    'task.11.2': 'Delivery Models',
    'task.11.3': 'Decision Tree: Choosing a Broker',
    'task.11.4': 'Benchmark Dashboard',
    'task.12.1': 'Event Sourcing',
    'task.12.2': 'CQRS',
    'task.12.3': 'Choreography vs Orchestration',
    'task.13.1': 'Saga Choreography',
    'task.13.2': 'Saga Orchestration',
    'task.13.3': 'Compensating Actions',
    'task.14.1': 'Retry with Exponential Backoff',
    'task.14.2': 'Idempotency: Deduplication',
    'task.14.3': 'Poison Message: Quarantine',
    'task.15.1': 'Dual Write Problem',
    'task.15.2': 'Transactional Outbox',
    'task.15.3': 'CDC (Change Data Capture)',
    'task.16.1': 'Consumer Lag Dashboard',
    'task.16.2': 'Distributed Tracing',
    'task.16.3': 'Alerting: Configurator',
    'task.17.1': 'E-Commerce: Order Architecture',
    'task.17.2': 'Centralized Logging',
    'task.17.3': 'Architecture Choice: Case Study',
  },
}
