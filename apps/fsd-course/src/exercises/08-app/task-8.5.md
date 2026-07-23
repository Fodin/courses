# Задание 8.5 — Общий конфиг переезжает в shared (среднее)

## Цель

Переключить `entities/user` и `widgets/dashboard` с импорта `APP_NAME` из `app` на
импорт из `shared`, куда конфиг уже вынесен.

## Что дано

- `app/config/appConfig.ts` — старое место константы `APP_NAME` (🔒 только чтение,
  трогать не нужно, но и импортировать из него больше нельзя);
- `shared/config/appConfig.ts` — то же самое, уже в `shared` (🔒 только чтение) —
  именно отсюда и нужно импортировать;
- `entities/user/model/greeting.ts` — импортирует `APP_NAME` из `app`;
- `widgets/dashboard/ui/Dashboard.tsx` — импортирует `APP_NAME` из `app`.

## Требования

1. В `greeting.ts` замените импорт на `'@/shared/config/appConfig'`.
2. В `Dashboard.tsx` замените импорт на `'@/shared/config/appConfig'`.
3. Поведение обоих файлов не меняется — меняется только источник константы.
4. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `entities/user` не импортирует ничего из `app`
- [ ] `widgets/dashboard` не импортирует ничего из `app`
- [ ] Оба берут `APP_NAME` из `'@/shared/config/appConfig'`
- [ ] Пройти квиз уровня ≥ 80%
