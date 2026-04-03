# Задание 15.3: Полный дизайн Distributed Cache для социальной сети

## Цель

Спроектировать распределённый кэш для крупной социальной сети (аналог кэш-слоя Twitter, Instagram). Описать архитектуру, partitioning strategy, replication, eviction, persistence и обработку edge cases (hot keys, cache stampede, split-brain).

## Требования

1. **Functional Requirements**:
   - GET / SET / DELETE с sub-ms latency
   - TTL для автоматической инвалидации
   - Кэширование: user profiles, timelines, session data, counters (likes, followers)
   - Atomic counters: INCR likes, DECR inventory
   - Pub/Sub для real-time notifications

2. **Non-Functional Requirements**:
   - 500M активных пользователей, 200M DAU
   - 2M cache RPS (пик), latency < 1 мс (p99)
   - 50 TB hot data в кэше
   - 99.99% availability
   - Потеря данных ≤ 1 секунда при крахе ноды

3. **Data Partitioning**:
   - Consistent hashing с hash slots (16384)
   - Расчёт: сколько нод, сколько слотов на ноду
   - Стратегия для multi-key операций (hash tags)
   - Hot key mitigation: user profiles знаменитостей (10M followers)

4. **Replication и Failover**:
   - Leader-follower: async vs semi-sync
   - Automatic failover: gossip → PFAIL → FAIL → promote follower
   - Split-brain protection: MIN_REPLICAS_TO_WRITE
   - Расчёт: replication factor, total nodes

5. **Memory Management**:
   - Eviction policy: allkeys-lfu vs allkeys-lru для social network workload
   - Memory overhead: Redis metadata per key (~70 bytes)
   - Large keys: timeline lists (10K items) — как не убить latency

6. **Persistence и Recovery**:
   - RDB + AOF: trade-offs для social network data
   - Warm-up strategy: как прогреть кэш после полного restart
   - Backup: как бэкапить 50 TB in-memory data

7. **Caching Patterns**:
   - Cache-aside vs Write-through vs Write-behind
   - Cache stampede protection (singleflight / probabilistic early expiration)
   - Инвалидация: event-driven (Kafka) vs TTL-based

## Чеклист

- [ ] Определены functional и non-functional requirements
- [ ] Back-of-the-envelope: nodes, memory, RPS per node
- [ ] Архитектурная диаграмма с data flow
- [ ] Hash slots partitioning с расчётом количества нод
- [ ] Hot key strategy (local cache, key sharding)
- [ ] Replication: async leader-follower с failover
- [ ] Split-brain protection (quorum, MIN_REPLICAS_TO_WRITE)
- [ ] Eviction policy обоснован для workload (LFU для social)
- [ ] Persistence: RDB + AOF, warm-up strategy
- [ ] Cache-aside pattern + stampede protection
- [ ] Инвалидация через Kafka events
- [ ] Мониторинг: hit rate, memory usage, replication lag, eviction rate

## Как проверить себя

1. Сценарий: celebrity пользователь (10M followers) публикует пост — как кэш справляется с hot key?
2. Сценарий: нода с 5000 слотами упала — сколько данных потеряно? Как быстро failover?
3. Сценарий: сетевой разрыв делит 6 нод на 2+4 — что происходит с writes в каждой partition?
4. Расчёт: 50 TB / 64 GB RAM per node = ? нод × replication factor 3 = ? total
5. Сценарий: весь кластер перезапущен — как прогреть 50 TB кэша без перегрузки БД?
6. Сравните свой дизайн с эталонным решением (Solution)
