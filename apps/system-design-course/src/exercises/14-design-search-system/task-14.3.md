# Задание 14.3: Полный дизайн поисковой системы для e-commerce

## Цель

Спроектировать поисковую систему для крупного e-commerce сервиса (аналог поиска Ozon, Wildberries, Amazon). Описать архитектуру, выбор технологий, sharding strategy, ranking pipeline и обработку специфичных для e-commerce сценариев.

## Требования

1. **Functional Requirements**:
   - Full-text search по товарам (название, описание, бренд)
   - Faceted search: фильтры по цене, категории, бренду, рейтингу
   - Typeahead / autocomplete с популярными запросами
   - Fuzzy matching для опечаток
   - Сортировка: по релевантности, цене, популярности, новизне

2. **Non-Functional Requirements**:
   - 50M товаров, 100K поисковых RPS (пик)
   - Latency < 200 мс (p99)
   - Near real-time indexing: новый товар в поиске за < 30 сек
   - 99.99% availability

3. **Архитектура**:
   - Компоненты: Query Service, Indexing Service, Typeahead Service, Ranking Service
   - Data flow: товар создан → Kafka → Indexer → Elasticsearch shards
   - Sharding strategy: по категории или по hash(product_id)?
   - Replicas: сколько реплик для 100K RPS?

4. **Ranking Pipeline для e-commerce**:
   - BM25 (текстовая релевантность)
   - Коммерческие факторы: цена, рейтинг, наличие на складе, конверсия
   - Персонализация: история покупок, просмотров
   - Sponsored results: как вписать рекламу в органическую выдачу

5. **Специфика e-commerce**:
   - Нулевой результат поиска — что делать? (spell correction, did-you-mean, fallback)
   - Синонимы: «телефон» = «смартфон», «ноутбук» = «лэптоп»
   - Seasonal trends: «купальник» летом vs «пуховик» зимой

## Чеклист

- [ ] Определены functional и non-functional requirements
- [ ] Back-of-the-envelope: QPS, storage, bandwidth
- [ ] Архитектурная диаграмма с основными компонентами
- [ ] Выбор sharding strategy обоснован
- [ ] Расчёт количества шардов и реплик
- [ ] Описан ranking pipeline (BM25 + business signals)
- [ ] Описан data flow индексации (Kafka → Indexer → ES)
- [ ] Typeahead — отдельный сервис с Trie / Redis
- [ ] Faceted search через ES aggregations
- [ ] Обработка нулевых результатов (spell correction, synonyms)
- [ ] Мониторинг: search latency, zero-result rate, CTR, conversion

## Как проверить себя

1. Пройдите по сценарию: пользователь ищет «iphon 13 pro» — как обрабатывается опечатка? Как faceted search показывает фильтры?
2. Пройдите по сценарию: продавец добавил новый товар — через сколько секунд он появится в поиске?
3. Проверьте: что будет при падении одного шарда? Реплики обеспечивают availability?
4. Проверьте: 100K RPS при 300 шардах — сколько QPS на каждый шард?
5. Проверьте: как ranking отличает «дешёвый телефон» от «лучший телефон»?
6. Сравните свой дизайн с эталонным решением (Solution)
