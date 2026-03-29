# Задание 3.4: Версионирование API

## 🎯 Цель

Сравнить три подхода к версионированию API: URL, заголовки и content negotiation, с примерами реализации и стратегией deprecation.

## Требования

1. Покажите URL versioning: `/api/v1/users` vs `/api/v2/users` с разными роу��ерами
2. Покажите Header versioning: `X-API-Version: 2` с middleware для определения версии
3. Покажите Content negotiation: `Accept: application/vnd.myapi.v2+json`
4. Продемонстрируйте разницу ответов v1 и v2 для одного ресурса
5. Покажите стратегию deprecation: заголовки Deprecation, Sunset, Link

## Чеклист

- [ ] URL versioning: разные роутеры для v1/v2, плюсы и минусы
- [ ] Header versioning: middleware для версионирования, плюсы и минусы
- [ ] Content negotiation: Accept header, плюсы и минусы
- [ ] Пример: v1 возвращает плоскую структуру, v2 -- вложенную с HATEOAS links
- [ ] Deprecation заголовки: Deprecation, Sunset, Link rel="successor-version"

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: все три подхода показаны с примерами и trade-offs, v1/v2 демонстрируют разницу в формате ответа, стратегия deprecation включает HTTP-заголовки.
