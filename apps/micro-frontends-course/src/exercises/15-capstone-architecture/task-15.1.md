# Задание 15.1: Визуализатор архитектуры e-commerce MFE-платформы

## Цель

Построить интерактивный визуализатор полной архитектуры e-commerce платформы: Shell + 5 MFE (Catalog, Cart, Checkout, Profile, Admin). Четыре переключаемых вида — Dependency, Deploy, Team, Traffic — позволяют изучить разные аспекты платформы. Клик на MFE открывает детальную панель с информацией о технологиях, event-контрактах и метриках.

## Требования

1. Реализовать данные для 6 MFE (shell, catalog, cart, checkout, profile, admin): у каждого есть id, label, цвет, команда, framework, маршруты, shared deps, события (emit/listen), стратегия деплоя, процент canary, версия, метрики трафика (requestPct, latency, errorRate, SLO)
2. Реализовать 5 shared libraries: react, react-dom, @company/ui-kit, @company/analytics, react-router-dom
3. Реализовать переключатель из 4 видов: Зависимости / Deploy / Команды / Трафик
4. MfeCard — кликабельный компонент, показывающий релевантную информацию для текущего вида: теги shared deps (Dependency), версию и стратегию (Deploy), команду и SLO (Team), метрики трафика (Traffic)
5. DetailPanel: при клике на MFE показать панель с тремя колонками: Технологии, Events (emit/listen), Метрики и маршруты. Закрывать по кнопке ×
6. Вид Dependency: показать MFE-карточки + панель shared libs + таблицу зависимостей MFE → deps
7. Вид Deploy: группировать MFE по стратегиям деплоя (Blue/Green, Canary, Rolling, Direct), показать версии и статус canary
8. Вид Team: показать MFE-карточки + сетку команд с их MFE и SLO
9. Вид Traffic: показать MFE-карточки + latency bar chart с цветовым кодированием (зелёный <100ms, жёлтый <200ms, красный >=200ms)
10. Summary bar внизу: всего MFE, команд, shared libs, активных canary

## Чеклист

- [ ] 6 MFE заданы с полными данными (все поля: color, team, framework, routes, deps, events, deploy, metrics)
- [ ] Переключатель 4 видов работает, при смене вида MfeCard отображает релевантную информацию
- [ ] MfeCard в режиме Dependency показывает теги shared deps (первые 3 + счётчик остальных)
- [ ] MfeCard в режиме Deploy показывает версию и badge стратегии (жёлтый для canary)
- [ ] MfeCard в режиме Team показывает команду (цветной badge) и SLO
- [ ] MfeCard в режиме Traffic показывает requestPct%, latency (с цветом) и errorRate%
- [ ] Клик на MfeCard открывает DetailPanel с 3 колонками
- [ ] DetailPanel: Events — emit (жёлтый ↑) и listen (зелёный ↓), Метрики: latency с цветом
- [ ] Вид Deploy: MFE сгруппированы по стратегии
- [ ] Вид Team: карточки команд со списком их MFE и SLO
- [ ] Вид Traffic: latency bar chart с правильным цветовым кодированием
- [ ] Summary bar показывает 4 метрики
- [ ] Тёмная тема, все стили inline

## Как проверить себя

1. Откройте задание — должны отображаться 6 MFE-карточек в виде Dependency с тегами shared deps
2. Кликните на Catalog MFE — должна появиться DetailPanel с событиями cart:add, product:viewed (emit) и cart:updated (listen)
3. Переключитесь на вид Traffic — у Checkout должна быть красная latency (312ms), у Shell — зелёная (42ms)
4. В виде Deploy убедитесь, что Catalog показывает желтый badge "canary 15%"
5. В виде Team убедитесь, что Commerce Team содержит Catalog и Cart, а Payments — Checkout
6. Summary bar: MFE всего = 6, Команд = 4, Shared libs = 5, Canary active = 1
