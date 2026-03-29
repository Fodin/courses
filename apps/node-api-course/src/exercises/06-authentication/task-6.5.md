# Задание 6.5: RBAC

## 🎯 Цель

Реализовать Role-Based Access Control: определение ролей и разрешений, middleware для проверки доступа и resource-level permissions.

## Требования

1. Определите роли и разрешения: admin (полный доступ), editor (посты), user (свои посты), viewer (чтение)
2. Реализуйте middleware `requirePermission(...permissions)` для проверки прав
3. Продемонстрируйте проверку доступа для разных ролей и endpoints
4. Реализуйте resource-level permissions: пользователь может редактировать только свои ресурсы
5. Покажите ответ 403 Forbidden с информацией о необходимых правах

## Чеклист

- [ ] Таблица ролей: admin, editor, user, viewer с перечислением разрешений
- [ ] `requirePermission()` проверяет, что все указанные permissions есть у роли
- [ ] 403 содержит: required permissions и текущую роль пользователя
- [ ] Resource-level: проверка authorId === req.user.id || role === 'admin'
- [ ] Middleware используется: `router.delete('/users/:id', requirePermission('users.delete'), handler)`

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: таблица ролей показана, симуляция проверки доступа для разных ролей корректна, resource-level permissions объяснены.
