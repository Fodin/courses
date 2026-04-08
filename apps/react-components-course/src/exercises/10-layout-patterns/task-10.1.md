# Задание 10.1: Layout-компоненты с навигацией

## Цель

Реализовать три layout-компонента — `RootLayout`, `SidebarLayout`, `CenteredLayout` — и продемонстрировать их совместную работу через имитацию навигации с помощью кнопок/табов.

## Требования

1. `RootLayout` — корневой layout:
   - Отображает шапку (Header) с заголовком приложения и навигационными кнопками
   - Принимает `children: ReactNode`
   - Шапка фиксирована сверху (или статична, но всегда видна)

2. `SidebarLayout` — двухколоночный layout:
   - Принимает `sidebar: ReactNode` и `children: ReactNode`
   - Принимает опциональный `sidebarWidth?: number` (default: 220)
   - Сайдбар отображается слева, основной контент справа
   - Реализован через flexbox

3. `CenteredLayout` — центрирующий layout:
   - Принимает `children: ReactNode`
   - Принимает `maxWidth?: number` (default: 720)
   - Центрирует контент по горизонтали с отступами

4. Навигация через кнопки (имитирует React Router):
   - Три "страницы": Dashboard, Profile, Settings
   - Dashboard использует `SidebarLayout` с боковым меню
   - Profile и Settings используют `CenteredLayout`
   - `RootLayout` оборачивает всё

5. Layout-компоненты не содержат бизнес-логику — только структуру

## Подсказки

- Используй `useState` для хранения текущей "страницы"
- `SidebarLayout`: `display: flex`, `aside` фиксированной ширины, `main` с `flex: 1` и `minWidth: 0`
- `CenteredLayout`: `margin: '0 auto'`, `maxWidth`, `padding` по бокам
- Навигационные кнопки можно разместить в шапке `RootLayout`
- Каждый layout-компонент — отдельная функция, не встроенный JSX

## Чеклист

- [ ] `RootLayout` принимает `children` и рендерит шапку + контент
- [ ] `SidebarLayout` принимает `sidebar` + `children`, поддерживает `sidebarWidth`
- [ ] `CenteredLayout` принимает `children`, поддерживает `maxWidth`
- [ ] Навигация переключает три разных "страницы"
- [ ] Dashboard использует `SidebarLayout` с боковым меню
- [ ] Profile и Settings используют `CenteredLayout`
- [ ] Layout-компоненты не импортируют и не знают о конкретных страницах

## Как проверить себя

Переключайте страницы через кнопки в шапке. Dashboard должен показывать двухколоночный layout с сайдбаром. Profile и Settings — контент по центру. При изменении `sidebarWidth` в `SidebarLayout` ширина колонок должна меняться. Контент страниц не должен "знать" о своём расположении.
