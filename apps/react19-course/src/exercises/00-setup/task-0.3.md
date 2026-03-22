# Задание 0.3: Breaking Changes

## Цель

Создать интерактивный компонент с таблицей всех breaking changes в React 19 — что удалено и чем заменено.

## Требования

1. Создайте массив breaking changes с полями:
   - `removed` — что удалено
   - `replacement` — чем заменено
   - `category` — категория (Components, ReactDOM, Types, Testing и т.д.)
2. Отобразите данные в виде таблицы
3. Добавьте фильтрацию по категориям (кнопки-фильтры)
4. Покажите общее количество breaking changes

## Список breaking changes для включения

### Компоненты
- `defaultProps` для функциональных компонентов → default parameters
- `propTypes` → TypeScript
- String refs → `useRef` / callback refs
- Legacy Context → `createContext`

### ReactDOM
- `ReactDOM.render` → `createRoot().render()`
- `ReactDOM.hydrate` → `hydrateRoot()`
- `ReactDOM.unmountComponentAtNode` → `root.unmount()`
- `ReactDOM.findDOMNode` → `useRef`

### Типы
- Неявный `children` в FC → явный `children: ReactNode`
- `useRef()` без аргумента → `useRef(null)`

### Тестирование
- `react-test-renderer` → `@testing-library/react`

## Подсказки

- Используйте `useState` для хранения текущего фильтра
- `new Set(arr.map(...))` поможет получить уникальные категории
- Используйте `<table>` для отображения данных

## Чеклист

- [ ] Таблица с колонками: Удалено, Замена, Категория
- [ ] Фильтрация по категориям
- [ ] Кнопка "Все" для сброса фильтра
- [ ] Счётчик общего количества изменений
