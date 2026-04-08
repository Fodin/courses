# Задание 16.3: Alerting — конфигуратор алертов

## Цель

Реализовать **интерактивный конфигуратор алертов** с симуляцией метрик в реальном времени. Пользователь создаёт правила вида "если metric > threshold → severity", наблюдает срабатывания и разрешение алертов по мере изменения симулируемых значений.

## Требования

1. Объявить типы: `MetricId = 'consumer_lag' | 'queue_depth' | 'publish_rate' | 'error_rate'`, `Severity = 'warning' | 'critical'`, `AlertState = 'ok' | 'firing' | 'resolved'`.
2. Объявить интерфейсы:
   - `AlertRule`: `id: string`, `metric: MetricId`, `threshold: number`, `severity: Severity`, `enabled: boolean`.
   - `AlertFiring`: `ruleId: string`, `metric: MetricId`, `currentValue: number`, `threshold: number`, `severity: Severity`, `firedAt: number`, `state: AlertState`.
3. Объявить константу `METRIC_META: Record<MetricId, { label, unit, defaultThreshold, min, max, step }>` с параметрами для каждой метрики:
   - `consumer_lag` — unit `'msgs'`, defaultThreshold 1000, min 100, max 10000, step 100.
   - `queue_depth` — unit `'msgs'`, defaultThreshold 5000, min 100, max 50000, step 500.
   - `publish_rate` — unit `'msg/s'`, defaultThreshold 1000, min 50, max 5000, step 50.
   - `error_rate` — unit `'%'`, defaultThreshold 1, min 0.1, max 10, step 0.1.
4. Объявить константу `SEVERITY_COLORS: Record<Severity, string>`: warning — `'#ed8936'`, critical — `'#e53e3e'`.
5. Реализовать функцию `generateSimValue(metric: MetricId): number`, которая возвращает случайное число в диапазоне, специфичном для метрики.
6. Объявить состояния компонента:
   - `rules: AlertRule[]` — список правил (начальные: 3 правила: lag warning 1000, lag critical 5000, error_rate critical 1).
   - `firing: AlertFiring[]` — список активных/разрешённых алертов.
   - `simValues: Record<MetricId, number>` — текущие симулируемые значения.
   - `newMetric`, `newThreshold`, `newSeverity` — состояния формы добавления нового правила.
7. Реализовать `useEffect` с интервалом 2000ms: генерировать новые значения через `generateSimValue`, обновлять `simValues`, пересчитывать `firing`:
   - Если `val > rule.threshold` и нет активного алерта → добавить `{ state: 'firing', firedAt: Date.now(), ... }`.
   - Если `val <= rule.threshold` и есть активный алерт → изменить его `state` на `'resolved'`.
   - Удалять resolved-алерты, у которых `Date.now() - firedAt > 5000ms`.
8. Реализовать функцию `addRule`: добавлять новое правило с уникальным id, сбрасывать `newThreshold` до `defaultThreshold` выбранной метрики.
9. Реализовать функции `removeRule(id)` и `toggleRule(id)`. При удалении правила удалять соответствующие алерты из `firing`.
10. Вычислять `criticalCount` и `warningCount` — количество активных алертов (state `'firing'`) по severity.
11. Отрисовать двухколоночный макет:
    - **Левая колонка**: заголовок с количеством правил, форма добавления (select метрики, number input порога, кнопки severity, кнопка "+ Добавить правило"), список существующих правил.
    - **Правая колонка**: сводка Critical/Warning counts, раздел "Текущие метрики" с прогресс-барами, список активных/resolved алертов.
12. Каждое правило в списке отображает:
    - Чекбокс включения/отключения (`enabled`).
    - Название метрики, порог и severity.
    - Текущее значение метрики.
    - Badge "FIRING" (с pulse-анимацией) если правило активно и включено.
    - Кнопку удаления "×".
    - Рамку с цветом severity когда алерт firing; нейтральную когда нет.
13. В разделе "Текущие метрики" отображать прогресс-бар для каждой метрики с цветом: красный если пробит critical-порог, оранжевый если пробит warning-порог, зелёный если всё в норме.
14. Добавить CSS-анимацию `pulse` для badge FIRING.

## Чеклист

- [ ] Типы `MetricId`, `Severity`, `AlertState` объявлены
- [ ] Интерфейсы `AlertRule` и `AlertFiring` объявлены с правильными полями
- [ ] Константа `METRIC_META` содержит все 4 метрики с правильными параметрами
- [ ] `generateSimValue` возвращает значения в ожидаемом диапазоне для каждой метрики
- [ ] `useEffect` с интервалом 2000ms симулирует метрики и пересчитывает `firing`
- [ ] Resolved-алерты удаляются через 5 секунд
- [ ] `addRule` добавляет правило и сбрасывает форму до defaultThreshold
- [ ] `removeRule` удаляет правило и связанные алерты из `firing`
- [ ] `toggleRule` переключает `enabled` у правила
- [ ] Форма добавления: select метрики, number input, кнопки severity, кнопка добавить
- [ ] Список правил: чекбокс, название, порог, severity, текущее значение, кнопка ×
- [ ] Badge FIRING с pulse-анимацией появляется при активном алерте
- [ ] Прогресс-бары метрик меняют цвет в зависимости от нарушенных порогов
- [ ] Сводка Critical/Warning counts обновляется в реальном времени
- [ ] Список алертов показывает RESOLVED с fade-эффектом перед удалением

## Как проверить себя

1. Откройте задание — видны три начальных правила. Метрики симулируются каждые 2 секунды: значения в прогресс-барах меняются.
2. Подождите несколько секунд — при превышении порога в списке правил появляется badge "FIRING" с пульсацией, в правой колонке вырастает счётчик Critical или Warning.
3. Снимите галочку с правила — badge FIRING исчезает, правило перестаёт влиять на алерты, но остаётся в списке.
4. Добавьте новое правило: выберите "Error Rate", порог 0.1, severity "critical". Нажмите "+ Добавить правило" — правило появляется в списке. Оно сразу начнёт срабатывать почти всегда.
5. Удалите правило кнопкой "×" — оно исчезает из списка, связанные алерты убираются из правой колонки.
6. Наблюдайте RESOLVED-алерт: когда значение метрики опускается ниже порога, badge меняется с "FIRING" на "RESOLVED" и через 5 секунд алерт пропадает из списка.
