# Задание 8.3 — Точка сборки: провайдеры и роутинг (сложное)

## Цель

Навести порядок сразу в двух файлах `app`: провайдеры (тема + стор) должны брать
всё из `shared` через public API, а роутер — подключать обе страницы через их
public API.

## Что дано

- `shared/ui` (`ThemeProvider`) и `shared/lib` (`createStore`, тип `Store`) —
  готовые сегменты с public API (🔒 только чтение);
- `pages/home` и `pages/settings` — готовые страницы с public API (🔒 только чтение);
- `app/providers/AppProviders.tsx` — тянет `ThemeProvider` и `createStore` напрямую
  из внутренних файлов `shared`;
- `app/routes/AppRouter.tsx` — тянет `HomePage` и `SettingsPage` напрямую из
  внутренних сегментов `ui/` обеих страниц.

## Требования

1. В `AppProviders.tsx` замените импорты на `'@/shared/ui'` и `'@/shared/lib'`.
2. `AppProviders` по-прежнему оборачивает `children` в `ThemeProvider` и показывает
   `store.value`.
3. В `AppRouter.tsx` замените импорты на `'@/pages/home'` и `'@/pages/settings'`.
4. `AppRouter` по-прежнему рендерит нужную страницу по `route`.
5. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `AppProviders` импортирует `ThemeProvider` из `'@/shared/ui'`
- [ ] `AppProviders` импортирует `createStore` из `'@/shared/lib'`
- [ ] `AppRouter` импортирует `HomePage` из `'@/pages/home'`
- [ ] `AppRouter` импортирует `SettingsPage` из `'@/pages/settings'`
- [ ] Нигде нет глубоких импортов в обход public API
- [ ] Пройти квиз уровня ≥ 80%
