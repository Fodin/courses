# Задание 2.2: allow_failure и when

## Цель

Реализовать интерактивный симулятор пайплайна, который наглядно показывает, как `allow_failure` и `when` влияют на поведение CI/CD при ошибках.

## Требования

1. Отобразить пайплайн из 4 джобов: **lint**, **test**, **coverage**, **deploy**
2. Для каждого джоба добавить переключатели:
   - `allow_failure: true/false`
   - `when`: выпадающий список (on_success, on_failure, always, manual)
3. Кнопка **"Запустить пайплайн"** симулирует выполнение
4. Кнопки **"Провалить"** / **"Успех"** для каждого running джоба — управление результатом
5. Итоговый статус пайплайна (Pass / Fail) должен обновляться в реальном времени
6. Показывать визуальное состояние каждого джоба: pending (серый), running (синий с анимацией), success (зелёный), failed (красный), skipped (серый пунктир), warning (жёлтый — это failed + allow_failure)

## Логика симуляции

- Джобы выполняются последовательно
- `on_success`: запускается только если предыдущие success (или warning)
- `on_failure`: запускается только если есть failed (не warning)
- `always`: запускается всегда
- `manual`: отображается как "ожидает нажатия", не запускается автоматически
- `allow_failure: true`: при падении статус = warning, пайплайн не останавливается
- `allow_failure: false` (default): при падении следующие `on_success` джобы — skipped

## Ожидаемый результат

```
[lint ✅] → [test ❌ warning] → [coverage ⏭️ skipped] → [deploy ✅]
              allow_failure: true    when: on_success       when: always

Итог пайплайна: ✅ SUCCESS (несмотря на падение test)
```

## Подсказки

- Определи тип `JobConfig` с полями: id, name, allowFailure, when
- Определи тип `JobStatus`: 'pending' | 'running' | 'success' | 'failed' | 'warning' | 'skipped' | 'manual'
- Функция `computeNextStatus(job, pipelineHasFailed)` определяет статус следующего джоба
- "Пайплайн сломан" = есть хотя бы один `failed` (не `warning`)

## Проверь себя

- [ ] При `allow_failure: true` падение джоба не блокирует следующие `on_success` джобы
- [ ] При `allow_failure: false` падение показывает следующие `on_success` джобы как skipped
- [ ] Джоб с `when: on_failure` запускается только при наличии реального `failed` (не `warning`)
- [ ] Джоб с `when: always` запускается в любом случае
- [ ] Джоб с `when: manual` ждёт нажатия и не блокирует пайплайн
- [ ] Итоговый статус пайплайна корректен: Pass если нет `failed`, Fail если есть хотя бы один
