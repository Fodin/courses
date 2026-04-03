# Задание 13.4: Полный дизайн News Feed System

## Цель

Спроектировать систему ленты новостей (Twitter/Instagram) от и до — как на реальном System Design интервью. Пройти все этапы: требования, fan-out стратегия, social graph, feed ranking, caching, масштабирование.

## Требования

1. **Requirements** — сформулируйте functional и non-functional требования
2. **Fan-out Strategy** — обоснуйте выбор hybrid-подхода (push + pull)
3. **Social Graph** — спроектируйте хранение связей и выбор БД
4. **Feed Ranking** — опишите pipeline ранжирования (retrieval → scoring → filtering → diversification)
5. **Caching** — многослойный кеш, инвалидация, TTL
6. **Post Service** — публикация, хранение, медиа
7. **Architecture** — компоненты системы и их связи
8. **Scaling** — масштабирование каждого компонента

## Чеклист

### Requirements
- [ ] Перечислены 5+ functional requirements (публикация, лента, follow, ranking, infinite scroll)
- [ ] Перечислены 3+ non-functional requirements (задержка, масштаб, доступность, eventual consistency)
- [ ] Back-of-the-envelope: DAU, QPS чтения/записи, storage

### Fan-out Strategy
- [ ] Описан fan-out on write (push) с плюсами и минусами
- [ ] Описан fan-out on read (pull) с плюсами и минусами
- [ ] Hybrid: push для обычных (< 10K followers), pull для селебрити
- [ ] Celebrity threshold обоснован (почему 10K, а не 1K или 100K)
- [ ] Описан flow публикации поста через Kafka → Fan-out Service → Redis

### Social Graph
- [ ] Data model: follows, blocks, user_stats
- [ ] Graph DB + Redis cache для разных типов запросов
- [ ] Sharding strategy с обоснованием
- [ ] Решение для hot spots (chunked lists, dedicated cache)

### Feed Ranking
- [ ] Pipeline: retrieval → scoring → filtering → diversification
- [ ] Факторы scoring: freshness, affinity, engagement, content type
- [ ] Кеширование scored feed (не пересчитывать при каждом scroll)
- [ ] Инкрементальное обновление (новый пост → вставить в scored list)

### Caching
- [ ] Многослойный: CDN (media) → Redis (feed, posts) → DB
- [ ] Feed cache: список postId per user в Redis
- [ ] Post cache: отдельный ключ post:{id} для дедупликации
- [ ] Инвалидация: инкрементальная (lpush) + TTL fallback (5 мин)

### Architecture & Scaling
- [ ] Компоненты: API Gateway, Feed Service, Post Service, Fan-out Service, Ranking Service, Social Graph Service
- [ ] Kafka для async fan-out
- [ ] Posts DB (MySQL sharded), Graph DB (Neo4j/TAO), Redis Cluster
- [ ] S3 + CDN для медиа
- [ ] Горизонтальное масштабирование каждого компонента

## Как проверить себя

1. Пройдите по каждой секции чеклиста — все пункты должны быть закрыты
2. «Прогоните» сценарий: селебрити с 10M подписчиков публикует пост. Что происходит на каждом этапе?
3. Проверьте: пользователь открывает ленту впервые за 3 дня. Откуда берутся посты?
4. Проверьте: пользователь отписался от аккаунта. Как обновляется лента?
5. Проверьте: пост удалён автором. Как он исчезает из всех лент?
6. Сравните свой дизайн с эталонным решением (Solution)
