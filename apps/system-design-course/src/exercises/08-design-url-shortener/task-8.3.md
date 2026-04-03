# Задание 8.3: Полный дизайн URL Shortener

## Цель

Спроектировать URL Shortener от и до — как на реальном интервью по System Design. Пройти все этапы: требования, оценка нагрузки, API, модель данных, алгоритм, архитектура, масштабирование.

## Требования

1. **Requirements** — сформулируйте functional и non-functional требования
2. **Capacity Estimation** — рассчитайте QPS (read/write), объём хранилища на 5 лет, bandwidth
3. **API Design** — опишите REST API endpoints (POST создание, GET redirect, DELETE удаление)
4. **Data Model** — спроектируйте таблицы БД и индексы
5. **Algorithm** — выберите и обоснуйте алгоритм генерации коротких кодов (hash / counter / pre-generated)
6. **Architecture** — нарисуйте компоненты системы и их связи
7. **Scaling** — опишите стратегии масштабирования для каждого компонента

## Чеклист

### Requirements
- [ ] Перечислены 3+ functional requirements
- [ ] Перечислены 3+ non-functional requirements (доступность, задержка, масштаб)
- [ ] Определено read/write ratio

### Capacity Estimation
- [ ] Рассчитан write QPS (ссылок/сек)
- [ ] Рассчитан read QPS с учётом read/write ratio
- [ ] Рассчитан peak QPS (×2-3 от среднего)
- [ ] Рассчитан объём хранилища на 5 лет
- [ ] Определена минимальная длина короткого кода (base62)

### API Design
- [ ] POST /api/shorten — создание (body: longUrl, customAlias?, expiresAt?)
- [ ] GET /:shortCode — redirect (response: 301/302)
- [ ] DELETE /api/urls/:shortCode — удаление (auth required)
- [ ] GET /api/urls/:shortCode/stats — аналитика

### Data Model
- [ ] Таблица url_mappings с индексом по shortCode
- [ ] Таблица click_events для аналитики
- [ ] Обоснован выбор SQL vs NoSQL
- [ ] Описана стратегия шардирования

### Algorithm
- [ ] Выбран алгоритм генерации (hash / counter / pre-generated)
- [ ] Описана обработка коллизий
- [ ] Объяснено, почему 7 символов base62 достаточно

### Architecture
- [ ] Нарисована (или описана) общая схема с компонентами
- [ ] Описан поток создания ссылки (write path)
- [ ] Описан поток redirect (read path)
- [ ] Cache перед DB для read-heavy нагрузки

### Scaling
- [ ] Stateless API серверы за Load Balancer
- [ ] DB sharding по shortCode
- [ ] Redis Cluster для кэша
- [ ] Асинхронная аналитика (Kafka / очередь)
- [ ] Cleanup протухших ссылок (TTL)

## Как проверить себя

1. Пройдите по каждой секции чеклиста — все пункты должны быть закрыты
2. «Прогоните» два сценария мысленно: создание ссылки и redirect
3. Проверьте: если один API-сервер упал — система продолжает работать?
4. Проверьте: если Redis недоступен — система деградирует, но не падает?
5. Сравните свой дизайн с эталонным решением (Solution)
