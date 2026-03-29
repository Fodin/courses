# Задание 4.3: Response DTOs

## 🎯 Цель

Реализовать паттерн DTO (Data Transfer Object) для безопасной сериализации ответов: фильтрация полей, трансформация и разные DTO для разных контекстов.

## Требования

1. Покажите проблему: отправка объекта БД напрямую утечёт password_hash, internal_notes, stripe_customer_id
2. Реализуйте `UserResponseDTO.fromEntity()` -- статический метод для безопасной трансформации
3. Покажите паттерн `toJSON` для Mongoose/Sequelize моделей
4. Реализуйте разные DTO для разных контекстов: UserListDTO, UserDetailDTO, AdminUserDTO
5. Покажите трансформацию snake_case -> camelCase

## Чеклист

- [ ] Проблема утечки данных показана наглядно (объект БД vs ответ клиенту)
- [ ] DTO содержит только публичные поля (id, name, email, createdAt)
- [ ] `fromEntity()` трансформирует snake_case в camelCase
- [ ] `toJSON` переопределяет сериализацию на уровне модели
- [ ] Разные DTO: List (id, name, avatar), Detail (+ email, bio), Admin (+ role, lastLogin)

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: утечка данных продемонстрирована, DTO фильтрует чувствительные поля, три контекста (list, detail, admin) показывают разные наборы полей.
