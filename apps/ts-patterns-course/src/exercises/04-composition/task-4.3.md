# Задание 4.3: Plugin System

## Цель

Реализовать типобезопасную систему плагинов с lifecycle-хуками и конфигурацией.

## Требования

1. Создайте интерфейс `Plugin<TConfig>` с полями:
   - `name: string`
   - `config?: TConfig`
   - `onInit?(): string` — вызывается при установке
   - `onDestroy?(): string` — вызывается при удалении
2. Создайте класс `PluginManager` с методами:
   - `install<T>(plugin: Plugin<T>)` — устанавливает плагин, вызывает `onInit`
   - `uninstall(name: string)` — удаляет плагин, вызывает `onDestroy`
   - `isInstalled(name: string): boolean`
   - `getPlugin<T>(name: string): Plugin<T> | undefined`
   - `listPlugins(): string[]`
3. Создайте минимум 3 плагина с разными конфигурациями:
   - `loggerPlugin` с `LoggerPluginConfig` (level, prefix)
   - `analyticsPlugin` с `AnalyticsPluginConfig` (trackingId, enabled)
   - `cachePlugin` без конфигурации
4. Защита от дублирования: `install` бросает ошибку если плагин уже установлен
5. Продемонстрируйте установку, получение конфига, удаление

## Чеклист

- [ ] `Plugin<TConfig>` — дженерик-интерфейс с lifecycle-хуками
- [ ] `PluginManager` хранит плагины в `Map`
- [ ] `install` вызывает `onInit` и проверяет дублирование
- [ ] `uninstall` вызывает `onDestroy` и удаляет из Map
- [ ] `getPlugin<T>` возвращает плагин с типизированным конфигом
- [ ] Три плагина с разными конфигурациями созданы
- [ ] Демонстрация всех операций на экране

## Как проверить себя

- После `install(loggerPlugin)`, `isInstalled("logger")` должен вернуть `true`
- `getPlugin<LoggerPluginConfig>("logger")?.config?.level` должен вернуть `"info"`
- Повторный `install(loggerPlugin)` должен бросить ошибку
