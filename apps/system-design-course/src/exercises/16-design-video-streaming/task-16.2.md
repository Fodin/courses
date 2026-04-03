# Задание 16.2: Калькулятор видеоинфраструктуры

## Цель

Создать интерактивный калькулятор, который оценивает стоимость и ресурсы видеоплатформы на основе входных параметров: количество загрузок, длительность, разрешения, retention. Визуализация breakdown по категориям и прогноз роста.

## Требования

1. **Входные параметры** (ввод с controls):
   - Videos/day: количество загружаемых видео в день (slider или input, 1K-1M)
   - Avg duration: средняя длительность видео в минутах (1-60)
   - Resolutions: чекбоксы выбора (240p, 360p, 480p, 720p, 1080p, 4K)
   - Codecs: чекбоксы (H.264, H.265, VP9, AV1)
   - Retention: срок хранения в годах (1-10)
   - Peak viewers multiplier: отношение пикового к среднему трафику (2x-10x)

2. **Расчёты** (автоматические, при изменении параметров):
   - **Storage/year**: raw + transcoded для всех выбранных resolutions × codecs × retention
   - **Transcoding compute**: GPU-hours/day, стоимость (AWS GPU instance pricing)
   - **CDN bandwidth**: daily egress на основе views × avg bitrate × duration
   - **Monthly costs**: storage + compute + CDN + metadata DB
   - **Total cost/year**: с учётом retention и роста

3. **Bitrate таблица** (показывать для каждого resolution):
   - Resolution → bitrate (Mbps) → size per minute → size per video
   - Суммарный размер одного видео во всех вариантах

4. **Визуализация**:
   - Breakdown pie/bar chart стоимости: Storage vs Compute vs CDN vs Other
   - Таблица роста: Year 1, Year 2, ... Year N (storage accumulation)
   - Цветовая индикация: зелёный (OK), жёлтый (дорого), красный (очень дорого)

5. **Preset-сценарии** (кнопки быстрого заполнения):
   - «Стартап» — 1K videos/day, 5 min avg, 720p+480p, H.264, 1 year
   - «Средняя платформа» — 50K videos/day, 10 min, up to 1080p, H.264+VP9, 3 years
   - «YouTube-scale» — 500K videos/day, 10 min, up to 4K, all codecs, 5 years

## Чеклист

- [ ] Ввод параметров: videos/day, duration, resolutions, codecs, retention
- [ ] Таблица bitrate для каждого resolution с размером per video
- [ ] Расчёт storage/year (raw + transcoded, все resolution/codec комбинации)
- [ ] Расчёт transcoding compute (GPU-hours и стоимость)
- [ ] Расчёт CDN bandwidth и стоимость
- [ ] Итоговая стоимость: monthly и yearly
- [ ] Breakdown по категориям (визуальный)
- [ ] Таблица роста по годам (storage accumulation)
- [ ] Preset-сценарии (стартап, средняя, YouTube-scale)
- [ ] Цветовая индикация стоимости

## Как проверить себя

1. Выберите preset «Стартап» — monthly cost должен быть ~$5-50K
2. Выберите «YouTube-scale» — monthly cost должен быть ~$50-500M
3. Увеличьте retention с 1 до 5 лет — storage cost должен вырасти ~5x
4. Добавьте 4K resolution — storage и compute должны значительно вырасти
5. Сравните breakdown: для стартапа CDN — основная статья, для YouTube — storage
6. Сравните с эталонным решением (Solution)
