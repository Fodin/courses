# Задание 7.6 — Динамический import() применяется дважды (сложное)

## Цель

Разорвать два независимых двусторонних цикла — `reports.ts ↔ exporter.ts` и `search.ts ↔ indexer.ts` — заменив в обоих случаях статический обратный импорт на динамический.

## Что дано

- `reports.ts` — экспортирует `generateReport`, вызывает `exportReport` из `exporter.ts` (🔒 только чтение);
- `exporter.ts` — функция `reExportLatest` импортирует `generateReport` статически из `reports.ts`;
- `search.ts` — экспортирует `search`, вызывает `rebuildIndex` из `indexer.ts` (🔒 только чтение);
- `indexer.ts` — функция `verifyIndex` импортирует `search` статически из `search.ts`.

## Требования

1. В `exporter.ts` уберите статический импорт `generateReport` из `./reports`; сделайте `reExportLatest` асинхронной и получите `generateReport` через `await import('./reports')`.
2. В `indexer.ts` уберите статический импорт `search` из `./search`; сделайте `verifyIndex` асинхронной и получите `search` через `await import('./search')`.
3. Файлы `reports.ts` и `search.ts` менять не нужно.
4. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `exporter.ts` использует `await import('./reports')` вместо статического импорта
- [ ] `indexer.ts` использует `await import('./search')` вместо статического импорта
- [ ] Цикл в графе импортов отсутствует (в обоих местах)
- [ ] Пройти квиз уровня ≥ 80%
