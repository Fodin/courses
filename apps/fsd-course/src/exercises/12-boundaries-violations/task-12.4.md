# Задание 12.4 — Cross-import слайсов одного слоя (простое)

## Цель

Разорвать горизонтальную связь между двумя слайсами одного слоя.

## Что дано

- `features/auth/model/types.ts` импортирует `ProfileForm` из `features/profile`
  (через его public API) и встраивает объект профиля в `LoginForm`.

## Требования

1. Уберите импорт `@/features/profile` из `features/auth/model/types.ts`.
2. Удалите поле `profile: ProfileForm` из `LoginForm` — форме логина не нужны
   данные другого слайса.
3. Нажмите «Проверить».

## Чеклист

- [ ] В `features/auth/model/types.ts` нет импорта `features/profile`
- [ ] `LoginForm` содержит только `email` и `password`
- [ ] Пройти квиз уровня ≥ 80%
