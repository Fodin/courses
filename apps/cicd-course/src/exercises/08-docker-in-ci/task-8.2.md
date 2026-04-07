# Задание 8.2: Kaniko — настройка безопасной сборки

## Цель

Создать интерактивный конструктор Kaniko-команды для GitLab CI. Пользователь настраивает параметры (кэш, snapshot mode, destination теги, аутентификация) и получает готовый YAML-конфиг.

## Требования

1. Поле ввода для имени образа (destination): по умолчанию `$CI_REGISTRY_IMAGE`
2. Чекбоксы тегов: `$CI_COMMIT_SHORT_SHA`, `$CI_COMMIT_REF_SLUG`, `latest` (предупреждение при выборе latest без условия)
3. Переключатель кэша: off / on. При включении — поле для `--cache-repo` (по умолчанию `${CI_REGISTRY_IMAGE}/cache`)
4. Выбор snapshot mode: `time` (default) / `redo` / `full` — с кратким описанием каждого
5. Чекбокс `--compressed-caching=false` — с пояснением, когда это полезно
6. Итоговый YAML-блок с полным конфигом джоба: `image`, `before_script` (config.json), `script` с собранными флагами
7. Показывать итоговую строку `/kaniko/executor` с текущими флагами крупно

## Чеклист

- [ ] Поле для имени образа (изменяемое, дефолт — переменная GitLab)
- [ ] Минимум 3 чекбокса тегов (SHA, branch slug, latest)
- [ ] Предупреждение при выборе latest без ветки main
- [ ] Переключатель кэша с дополнительным полем cache-repo
- [ ] Выбор snapshot mode с описаниями
- [ ] YAML с блоком before_script (создание config.json для Registry)
- [ ] Итоговая команда /kaniko/executor со всеми флагами
- [ ] YAML обновляется в реальном времени при любом изменении

## Как проверить себя

1. Включи кэш — в YAML появляются `--cache=true` и `--cache-repo`
2. Выбери snapshot mode `redo` — флаг `--snapshot-mode=redo` появляется в команде
3. Отметь тег `latest` — появляется предупреждение о семантике latest
4. Включи `--compressed-caching=false` — флаг добавляется к команде
5. Выбери все три тега — в YAML три строки `--destination`

## Подсказки

- Используй `useState` для: `imageName`, `selectedTags` (массив), `cacheEnabled`, `cacheRepo`, `snapshotMode`, `compressedCaching`
- Команду executor собирай из массива флагов через join с переносом строк
- Блок `before_script` с config.json всегда одинаковый — его можно хардкодить
- Для предупреждения latest: показывай его при `selectedTags.includes('latest')`
