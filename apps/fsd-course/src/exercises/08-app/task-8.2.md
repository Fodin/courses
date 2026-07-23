# Задание 8.2 — Роутинг в app (среднее)

## Цель

Подключить в `app/routes/AppRouter.tsx` страницу `pages/home` через её public API.

## Что дано

- `pages/home/ui/HomePage.tsx` — компонент `HomePage` (🔒 только чтение);
- `pages/home/index.ts` — публичный API страницы (🔒 только чтение);
- `app/routes/AppRouter.tsx` — сейчас лезет в `ui/HomePage` напрямую (deep import).

## Требования

1. Замените импорт `@/pages/home/ui/HomePage` на импорт из `'@/pages/home'`
   (public API страницы).
2. Компонент `AppRouter` должен по-прежнему рендерить `<HomePage />`.
3. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] Нет глубокого импорта в `pages/home/ui/*`
- [ ] `AppRouter` импортирует `HomePage` из `'@/pages/home'`
- [ ] Импорт идёт строго вниз: `app → pages`
- [ ] Пройти квиз уровня ≥ 80%
