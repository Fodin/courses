# Задание 8.6 — Распутать три слоя, тянущих из app (сложное)

## Цель

Три разных слоя (`entities`, `features`, `widgets`) одновременно тянут конфиг из
`app`. Нужно переключить все три на `shared` и убедиться, что их public API
полностью собраны.

## Что дано

- `app/config/appConfig.ts` — старое место `API_BASE_URL` и `FEATURE_FLAGS`
  (🔒 только чтение, импортировать из него больше нельзя);
- `shared/config/appConfig.ts` — то же самое уже в `shared` (🔒 только чтение);
- `entities/product/model/api.ts` — импортирует `API_BASE_URL` из `app`;
- `features/cart/model/checkout.ts` — импортирует `FEATURE_FLAGS` из `app`;
- `widgets/header/ui/Header.tsx` — импортирует `API_BASE_URL` из `app`;
- public API всех трёх слайсов (`index.ts`) уже готовы и ждут эти реэкспорты
  (🔒 только чтение).

## Требования

1. В `entities/product/model/api.ts` замените импорт на `'@/shared/config/appConfig'`.
2. В `features/cart/model/checkout.ts` замените импорт на `'@/shared/config/appConfig'`.
3. В `widgets/header/ui/Header.tsx` замените импорт на `'@/shared/config/appConfig'`.
4. Поведение файлов не меняется — меняется только источник констант.
5. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] Ни один из трёх слайсов не импортирует ничего из `app`
- [ ] Все три берут конфиг из `'@/shared/config/appConfig'`
- [ ] `productUrl`, `useNewCheckout`, `Header` по-прежнему видны через public API
  своих слайсов
- [ ] Пройти квиз уровня ≥ 80%
