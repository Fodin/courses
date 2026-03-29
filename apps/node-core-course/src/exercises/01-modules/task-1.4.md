# Задание 1.4: Package.json exports

## Цель

Научиться использовать поле `exports` в package.json для контроля публичного API пакета.

## Требования

1. Покажите базовую exports map с точками входа
2. Продемонстрируйте conditional exports (import/require/types/default)
3. Покажите subpath patterns с wildcard (*)
4. Симулируйте разрешение путей для разных условий
5. Покажите, как exports блокирует доступ к внутренним файлам

## Чеклист

- [ ] Базовая exports map с примерами
- [ ] Conditional exports для dual CJS/ESM пакета
- [ ] Subpath patterns
- [ ] Симуляция разрешения путей работает
- [ ] Показана блокировка внутренних файлов (ERR_PACKAGE_PATH_NOT_EXPORTED)

## Как проверить себя

1. Запустите симуляцию и проверьте разрешение путей
2. Убедитесь, что internal paths корректно блокируются
