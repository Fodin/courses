# Задание 14.1 — Переносим примитив в shared (простое)

## Цель

Сделать первый шаг миграции: перенести переиспользуемый компонент `Button` из
legacy-папки `src/components/` в правильный слой FSD — `shared/ui`.

## Что дано

- `src/components/Button.tsx` — legacy-компонент `Button` (🔒 только чтение, образец
  для переноса).
- `src/shared/ui/Button.tsx` — заглушка с TODO, куда нужно перенести код.
- `src/shared/ui/index.ts` — пустой public API сегмента.
- `src/pages/home/ui/HomePage.tsx` — потребитель, сейчас импортирующий `Button` из
  legacy-пути `@/components/Button`.

## Требования

1. Перенесите компонент `Button` (и его типы) в `shared/ui/Button.tsx`.
2. Заполните `shared/ui/index.ts`, реэкспортировав `Button`.
3. Переключите импорт в `HomePage.tsx` на `@/shared/ui`.
4. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `shared/ui/Button.tsx` содержит перенесённый компонент
- [ ] `shared/ui/index.ts` реэкспортирует `Button`
- [ ] `HomePage.tsx` импортирует `Button` из `@/shared/ui`
- [ ] Пройти квиз уровня ≥ 80%
