# Задание 6.3: URL & DNS

## Цель

Освоить WHATWG URL API, URLSearchParams и модуль `dns` для разрешения доменных имён.

## Требования

1. Покажите разбор URL через `new URL()` со всеми полями
2. Продемонстрируйте `URLSearchParams`: get, set, append, toString, итерация
3. Покажите построение URL программно
4. Продемонстрируйте `dns.lookup()` vs `dns.resolve()` с таблицей сравнения
5. Покажите различные типы DNS-записей: A, AAAA, MX, TXT, NS, CNAME
6. Симулируйте DNS resolution для нескольких типов записей

## Чеклист

- [ ] URL разобран на все компоненты (protocol, hostname, port, pathname, search, hash)
- [ ] URLSearchParams с операциями get/set/append показан
- [ ] Построение URL программно продемонстрировано
- [ ] Таблица dns.lookup() vs dns.resolve() присутствует
- [ ] Типы DNS-записей показаны
- [ ] Симуляция DNS resolution работает

## Как проверить себя

1. Нажмите "Запустить" и изучите разбор URL
2. Убедитесь, что все компоненты URL показаны корректно
3. Проверьте, что URLSearchParams правильно строит query string
4. Убедитесь, что объяснена разница между lookup и resolve
