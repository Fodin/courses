# Задание 3.2: Пагинация

## 🎯 Цель

Реализовать два подхода к пагинации: offset-based и cursor-based, с Link headers и метаданными.

## Требования

1. Реализуйте offset-based ��агинацию: `?page=3&per_page=20` -> SQL `LIMIT 20 OFFSET 40`
2. Добавьте метаданные: `meta: { total, page, perPage, totalPages }`
3. Добавьте Link headers (first, prev, next, last) по RFC 5988
4. Реализуйте cursor-based пагинацию: `?after=<cursor>&limit=20` -> SQL `WHERE id > N`
5. Сравните подходы: offset (произвольный доступ, медленный на больших offset) vs cursor (стабильный, быстрый)

## Чеклист

- [ ] Offset-based: SQL LIMIT/OFFSET, метаданные total/page/totalPages
- [ ] Link headers содержат rel="first", "prev", "next", "last"
- [ ] Cursor-based: cursor = base64(JSON), запрос limit+1 для определения hasMore
- [ ] Cursor-based meta: `{ hasMore, nextCursor, prevCursor }`
- [ ] Таблица сравнения: плюсы и минусы каждого подхода

## Как проверить себя

Нажм��те "Запустить" и убедитесь, что: оба типа пагинации показаны с SQL-запросами, метаданными и Link headers, а также приведено сравнение подходов.
