# Задание 3.3 — Наводим порядок во всём shared (сложное)

## Цель

Собрать public API сразу у четырёх сегментов `shared` (`ui`, `api`, `lib`,
`config`) и подключить через них потребителя.

## Что дано

- `shared/ui/Button.tsx`, `shared/api/apiClient.ts`, `shared/lib/useDebounce.ts`,
  `shared/config/constants.ts` — реализация уже готова (только чтение).
- У всех четырёх сегментов пустые `index.ts` с TODO.
- `widgets/product-search/ui/ProductSearch.tsx` — тянет все четыре сегмента
  глубокими импортами (`@/shared/ui/Button`, `@/shared/api/apiClient`,
  `@/shared/lib/useDebounce`, `@/shared/config/constants`).

## Требования

1. В `shared/ui/index.ts` реэкспортируйте `Button` (и тип `ButtonProps`).
2. В `shared/api/index.ts` реэкспортируйте `apiClient` (и тип `ApiClient`).
3. В `shared/lib/index.ts` реэкспортируйте `useDebounce`.
4. В `shared/config/index.ts` реэкспортируйте `API_BASE_URL`.
5. Переключите все четыре импорта в `ProductSearch.tsx` на public API сегментов
   (`@/shared/ui`, `@/shared/api`, `@/shared/lib`, `@/shared/config`).
6. Нажмите «Проверить».

## Чеклист

- [ ] У всех четырёх сегментов shared есть рабочий `index.ts`
- [ ] `ProductSearch.tsx` не импортирует ни один внутренний файл shared напрямую
- [ ] Пройти квиз уровня ≥ 80%
