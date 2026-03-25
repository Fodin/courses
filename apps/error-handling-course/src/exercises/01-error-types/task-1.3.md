# Задание 1.3: Иерархия ошибок

## Цель

Построить многоуровневую иерархию ошибок для реального приложения.

## Требования

1. Создайте базовый класс `AppError extends Error` с полями:
   - `code: string` — код ошибки
   - `timestamp: Date` — время возникновения
2. Создайте `DatabaseError extends AppError` с полем `query?: string`
3. Создайте `NetworkError extends AppError` с полями `url: string` и `status?: number`
4. Создайте `AuthError extends AppError`
5. Продемонстрируйте обработку разных ошибок через цепочку `instanceof`

## Чеклист

- [ ] `AppError` с полями `code` и `timestamp`
- [ ] `DatabaseError`, `NetworkError`, `AuthError` наследуют от `AppError`
- [ ] Каждый подкласс добавляет свои поля
- [ ] Все ошибки проходят проверку `instanceof AppError`
- [ ] Результаты с контекстом отображаются на странице
