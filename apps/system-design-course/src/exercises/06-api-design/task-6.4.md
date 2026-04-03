# Задание 6.4: API Gateway и BFF

## Цель

Спроектировать слой API Gateway и BFF (Backend for Frontend) для приложения с тремя типами клиентов и пятью микросервисами.

## Требования

1. Три типа клиентов:
   - **Mobile App** — минимум данных, оптимизация под мобильную сеть
   - **Web App** — полные данные, rich UI
   - **Admin Panel** — все данные + метрики, внутренние операции
2. Пять микросервисов:
   - **User Service** — профили, авторизация
   - **Product Service** — каталог, поиск
   - **Order Service** — заказы, корзина
   - **Payment Service** — платежи, баланс
   - **Analytics Service** — метрики, отчёты
3. Для каждого BFF определите:
   - Какие микросервисы он агрегирует
   - Какие данные отдаёт клиенту (пример endpoint)
   - Как оптимизирует ответ под тип клиента
4. Для API Gateway определите:
   - Cross-cutting concerns: auth, rate limiting, logging
   - Routing rules
   - Rate limits для каждого типа клиента
5. Интерактивная схема: клиенты → BFF → API Gateway → микросервисы

## Чеклист

- [ ] 3 BFF: mobile, web, admin — с описанием агрегации
- [ ] Для каждого BFF: пример endpoint + какие сервисы вызывает
- [ ] API Gateway: auth, rate limiting, routing
- [ ] Разные rate limits для mobile/web/admin
- [ ] Описание оптимизации для каждого клиента
- [ ] Визуальная схема потока данных
- [ ] Пример: один и тот же экран (лента товаров) для mobile vs web vs admin

## Как проверить себя

1. Mobile BFF отдаёт компактные данные (маленькие картинки, минимум полей)
2. Web BFF агрегирует данные из 3+ сервисов за один запрос
3. Admin BFF имеет доступ к Analytics и внутренним операциям
4. API Gateway применяет auth ко всем запросам
5. Rate limits: mobile = 100 req/min, web = 200, admin = 50
