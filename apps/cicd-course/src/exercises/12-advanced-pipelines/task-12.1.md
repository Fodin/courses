# Задание 12.1: Parent-child pipelines

## Цель

Создать интерактивную визуализацию parent-child pipeline. Показать иерархию пайплайнов, механизм trigger + include и влияние параметра `strategy: depend` на поведение parent.

## Требования

1. Отобразить parent pipeline в виде блока с одним trigger-джобом
2. Показать три child pipeline (frontend, backend, infra), которые запускает parent
3. Реализовать переключатель `strategy: depend / без depend` — визуально показать разницу в поведении parent (ждёт или продолжает сразу)
4. Реализовать чекбоксы `rules: changes` для каждого child — показывать, какие child pipeline запустятся при данных изменениях
5. Генерировать YAML для trigger-джоба на основе выбранных настроек
6. При `strategy: depend` отображать статус "ожидание" в parent, пока child не завершились

## Чеклист

- [ ] Блок parent pipeline с trigger-джобом
- [ ] Три блока child pipelines с названиями: frontend, backend, infra
- [ ] Стрелки или линии от parent к каждому child
- [ ] Кнопки переключения strategy: depend / без depend
- [ ] Чекбоксы или кнопки для симуляции изменённых директорий (frontend/, backend/, infra/)
- [ ] Визуальная индикация "parent ждёт" при strategy: depend (например, спиннер или статус)
- [ ] YAML-блок с конфигом trigger-джоба (обновляется при изменениях)
- [ ] При отключённых rules child pipeline всегда запускается

## Как проверить себя

1. Включи strategy: depend — убедись, что parent показывает "ожидание" child
2. Выключи strategy: depend — parent должен сразу перейти в "завершён", не дожидаясь child
3. Включи rules:changes для frontend/ — при выборе только infra/ изменений frontend child не должен отображаться как запущенный
4. Проверь, что YAML корректно включает или убирает rules:changes в зависимости от настроек
5. Включи все три rules:changes и выбери изменения во всех директориях — все три child должны запуститься

## Подсказки

- Используй `useState` для: `strategyDepend` (boolean), `selectedChanges` (массив директорий), `childStatuses` (объект с состоянием каждого child)
- Для визуализации ожидания можно использовать анимированный индикатор или просто текст "Ожидание child..."
- YAML строй через template literal, добавляя или убирая секцию `strategy:` и `rules:` в зависимости от настроек
- Цветовое кодирование child: зелёный — запущен, серый — пропущен (не соответствует rules)
