# Задание 16.3: Проектирование Transcoding Pipeline

## Цель

Спроектировать и визуализировать полный transcoding pipeline: от загрузки raw видео до готовых HLS-сегментов на CDN. Показать этапы, параллелизм, обработку ошибок и расчёт времени обработки.

## Требования

1. **Pipeline этапы** (визуализация в виде flow):
   - **Upload** — приём файла (resumable, chunked)
   - **Validation** — проверка формата, codec, duration, malware scan
   - **Splitting** — разбиение на 4-sec сегменты для параллельного transcoding
   - **Transcoding** — конвертация каждого сегмента в N разрешений
   - **Thumbnail Generation** — извлечение ключевых кадров (параллельно с transcoding)
   - **Merging** — объединение сегментов, создание HLS/DASH manifest
   - **Quality Check** — автоматическая проверка (VMAF score, bitrate compliance)
   - **Storage** — запись в Object Store
   - **CDN Push** — pre-push на edge POPs (для popular channels)
   - **Notification** — webhook / notification пользователю

2. **Настройки** (интерактивные):
   - Выбор input resolution (720p, 1080p, 4K)
   - Выбор target resolutions (чекбоксы)
   - Выбор codecs (чекбоксы)
   - Параллелизм: количество параллельных workers
   - GPU vs CPU transcoding toggle

3. **Расчёт времени**:
   - Для каждого этапа — estimated time (в зависимости от настроек)
   - Total pipeline time
   - С параллелизмом vs без (показать разницу)
   - GPU vs CPU speedup factor (5-10x)

4. **DAG визуализация**:
   - Показать, какие этапы выполняются параллельно (transcoding разных resolutions)
   - Показать зависимости: splitting → transcoding → merging
   - Thumbnail generation — параллельно с transcoding

5. **Error handling**:
   - Показать retry стратегию для каждого этапа
   - Dead letter queue для failed jobs
   - Partial success: если 1080p failed, 720p и 480p всё равно ready

## Чеклист

- [ ] Визуализация всех 10 этапов pipeline с описаниями
- [ ] Интерактивный выбор: resolutions, codecs, parallelism, GPU/CPU
- [ ] Расчёт времени каждого этапа и total pipeline time
- [ ] Показана параллелизация (DAG): какие этапы параллельны
- [ ] GPU vs CPU сравнение времени
- [ ] Error handling: retry, DLQ, partial success
- [ ] Визуальный прогресс: какой этап выполняется, какой завершён
- [ ] Статистика: total jobs, queue depth, avg processing time

## Как проверить себя

1. Выберите 1080p input, targets 720p+480p+360p, H.264, GPU — pipeline должен быть < 2 мин
2. Переключите на CPU — время должно вырасти в 5-10x
3. Увеличьте параллелизм с 1 до 4 — total time должен уменьшиться
4. 4K input, все resolutions, все codecs — максимальный pipeline time
5. Убедитесь, что thumbnail generation показан как параллельный этап
6. Сравните с эталонным решением (Solution)
