# Задание 8.1: Type-safe Builder

## Цель

Реализовать паттерн Builder, в котором метод `build()` доступен **только** после установки всех обязательных полей. Проверка выполняется на уровне системы типов TypeScript.

## Требования

1. Определите интерфейс `ServerConfig` с полями:
   - `host: string` (обязательное)
   - `port: number` (обязательное)
   - `protocol: 'http' | 'https'` (обязательное)
   - `maxConnections?: number` (необязательное)
   - `timeout?: number` (необязательное)
2. Определите тип `RequiredConfigKeys = 'host' | 'port' | 'protocol'`
3. Создайте класс `ConfigBuilder<Set extends string = never>`:
   - Generic-параметр `Set` отслеживает, какие обязательные поля установлены
   - `setHost(host)` возвращает `ConfigBuilder<Set | 'host'>`
   - `setPort(port)` возвращает `ConfigBuilder<Set | 'port'>`
   - `setProtocol(protocol)` возвращает `ConfigBuilder<Set | 'protocol'>`
   - Необязательные setters возвращают `ConfigBuilder<Set>` (не меняют аккумулятор)
   - `build()` использует параметр `this` с conditional type: доступен **только** когда `RequiredConfigKeys extends Set`
4. Создайте фабричную функцию `createConfigBuilder()` возвращающую `ConfigBuilder<never>`
5. Продемонстрируйте:
   - Успешную сборку с обязательными полями
   - Успешную сборку с обязательными + необязательными полями
   - Комментарии показывающие, что неполная сборка не компилируется

## Чеклист

- [ ] `ConfigBuilder` параметризован аккумулятором `Set`
- [ ] Каждый обязательный setter расширяет `Set` через union
- [ ] `build()` использует conditional type через параметр `this`
- [ ] `build()` невозможно вызвать без всех обязательных полей (ошибка компиляции)
- [ ] Порядок вызова setters не имеет значения
- [ ] Необязательные setters не влияют на доступность `build()`

## Как проверить себя

1. Нажмите кнопку запуска — оба конфига должны собраться корректно
2. Попробуйте раскомментировать вызов `build()` без всех обязательных полей — TypeScript должен показать ошибку
3. Убедитесь, что порядок setters не важен: `setPort → setHost → setProtocol` тоже работает
