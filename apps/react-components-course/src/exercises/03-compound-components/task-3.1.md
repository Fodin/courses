# Задание 3.1: Компонент `<Tabs>` с Compound Components

## Цель

Реализовать компонент переключения вкладок с декларативным API, используя паттерн Compound Components на основе React Context.

## Требования

1. Создать контекст `TabsContext` с полями `activeTab: string` и `setActiveTab: (id: string) => void`
2. Реализовать хук `useTabsContext()` с проверкой на использование вне Provider (бросает ошибку с понятным сообщением)
3. Реализовать `TabsRoot` — корневой компонент, хранящий `activeTab` в `useState`, принимает `defaultTab: string` и `children`
4. Реализовать `Tabs.List` — обёртка для кнопок табов (просто `<div role="tablist">`)
5. Реализовать `Tabs.Tab` — кнопка таба, принимает `id: string` и `children`; читает `activeTab` из контекста, добавляет класс `active` при совпадении id, при клике вызывает `setActiveTab`
6. Реализовать `Tabs.Panel` — панель содержимого, принимает `id: string` и `children`; отображается только когда `activeTab === id`
7. Собрать итоговый объект `Tabs` через `Object.assign(TabsRoot, { List, Tab, Panel })`
8. Продемонстрировать работу в компоненте `Task3_1_Solution` с тремя табами и реальным содержимым

## Подсказки

- Начните с типов: опишите интерфейсы `TabsContextValue`, `TabsProps`, `TabProps`, `PanelProps` до написания компонентов
- `createContext<TabsContextValue | null>(null)` — начальное значение `null`, проверка в хуке
- Для активного таба добавляйте aria-атрибуты: `aria-selected={isActive}` на кнопке и `role="tabpanel"` на панели
- `Object.assign` возвращает первый аргумент с добавленными свойствами — TypeScript выведет тип автоматически

## Чеклист

- [ ] `TabsContext` создан с типом `TabsContextValue | null`
- [ ] `useTabsContext()` бросает ошибку вне Provider
- [ ] `TabsRoot` хранит `activeTab` в `useState(defaultTab)`
- [ ] `Tabs.List` рендерит `<div role="tablist">`
- [ ] `Tabs.Tab` применяет класс `active` и меняет таб по клику
- [ ] `Tabs.Panel` скрывается когда `activeTab !== id`
- [ ] Финальный объект собран через `Object.assign`
- [ ] В демо есть минимум 3 таба с разным содержимым

## Как проверить себя

Откройте компонент в браузере и убедитесь:
- Клик по любому табу показывает его панель и скрывает остальные
- Активный таб визуально выделен
- В React DevTools видно дерево: `Tabs > Tabs.List > Tabs.Tab`, `Tabs > Tabs.Panel`
- Если вынести `<Tabs.Tab>` за пределы `<Tabs>` — в консоли появляется понятная ошибка
