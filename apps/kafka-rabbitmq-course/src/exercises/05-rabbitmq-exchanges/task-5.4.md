# Задание 5.4: Headers Exchange и сравнение типов

## Цель

Реализовать симулятор Headers Exchange с поддержкой режимов `x-match: all` и `x-match: any`, а также интерактивную сравнительную таблицу всех 4 типов Exchange.

## Требования

1. Определи интерфейс `HeadersBinding` со свойствами: `id` (string), `queue` (string), `headers` (Record<string, string>), `xMatch: 'all' | 'any'`, `color` (string), `bgColor` (string).
2. Определи интерфейс `ExchangeType` со свойствами: `name`, `icon`, `color`, `bgColor`, `routing`, `speed`, `complexity`, `useCases` (string[]), `when` (string), `example` (string).
3. Создай массив `headersBindings` с 4 фиксированными привязками:
   - `eu-mobile-orders`: `{ region: 'eu', platform: 'mobile' }`, xMatch: `all`
   - `premium-orders`: `{ tier: 'premium' }`, xMatch: `any`
   - `mobile-or-tablet`: `{ platform: 'mobile', platform2: 'tablet' }`, xMatch: `any`
   - `us-all-platforms`: `{ region: 'us' }`, xMatch: `all`
4. Создай массив `exchangeTypes` с данными для Direct, Fanout, Topic, Headers (алгоритм маршрутизации, производительность, сложность, сценарии, когда использовать, пример).
5. Реализуй состояния: `messageHeaders` (Record<string, string>), `headerInput` ({key, value}), `view: 'headers' | 'comparison'`, `activeExchange`, `log`.
6. Реализуй функцию `matchHeaders(binding: HeadersBinding): boolean`:
   - При `xMatch === 'all'`: все заголовки binding должны совпасть
   - При `xMatch === 'any'`: хотя бы один заголовок binding должен совпасть
7. Вычисляй `matchedBindings` как производное состояние.
8. Реализуй функцию `publish()`: записывает в лог строку с заголовками сообщения и очередями-получателями.
9. Реализуй функцию `addHeader()`: добавляет заголовок в `messageHeaders`.
10. Реализуй функцию `removeHeader(key)`: удаляет заголовок из `messageHeaders`.
11. Реализуй переключение вкладок (`view`) кнопками "Headers Exchange" и "Сравнение типов".
12. На вкладке Headers отобрази:
    - Редактор заголовков сообщения (список ключ-значение с удалением, форма добавления)
    - Список привязок: каждая карточка показывает имя очереди, badge с `x-match`, иконку ✅/❌ и детальную проверку каждого заголовка (зелёный — совпал, красный — нет)
    - Лог публикаций
13. На вкладке Сравнение отобрази:
    - Кнопки-переключатели для 4 типов Exchange
    - Карточку выбранного типа с полями: алгоритм маршрутизации, производительность, сложность, сценарии использования, когда выбирать, пример
    - Таблицу-матрицу сравнения всех 4 типов по ключевым характеристикам

## Чеклист

- [ ] Интерфейсы `HeadersBinding` и `ExchangeType` объявлены корректно
- [ ] `matchHeaders` правильно реализует логику `all` (все совпали) и `any` (хотя бы одно)
- [ ] `matchedBindings` вычисляется реактивно
- [ ] Детальная проверка в карточке binding показывает каждый заголовок с результатом
- [ ] `addHeader` и `removeHeader` работают корректно
- [ ] Переключение вкладок работает
- [ ] На вкладке сравнения все 4 типа переключаются
- [ ] Карточка сравнения показывает все поля из `ExchangeType`
- [ ] Лог Headers Exchange показывает заголовки и получателей

## Как проверить себя

1. По умолчанию заголовки `{ region: eu, platform: mobile, tier: standard }`:
   - `eu-mobile-orders` (all: region=eu AND platform=mobile) — совпадает
   - `mobile-or-tablet` (any: platform=mobile OR platform2=tablet) — совпадает
   - `premium-orders` (any: tier=premium) — не совпадает
   - `us-all-platforms` (all: region=us) — не совпадает
2. Добавьте заголовок `tier: premium` — очередь `premium-orders` должна начать совпадать.
3. Измените `region` на `us` — совпадает `us-all-platforms`, перестаёт совпадать `eu-mobile-orders`.
4. Переключитесь на вкладку "Сравнение типов" и кликните по каждому из 4 типов Exchange — карточка обновляется.
