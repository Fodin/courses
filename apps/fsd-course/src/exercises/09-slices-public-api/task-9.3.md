# Задание 9.3 — Полный public API (сложное)

## Цель

Собрать public API разросшегося слайса: вынести наружу всё нужное и спрятать внутреннее,
затем перевести потребителя на этот API.

## Что дано

- `entities/user` с сегментами: `model/types` (`User`), `model/store` (`userStore`),
  `ui/UserCard`, `ui/UserAvatar` и внутренним `lib/formatName` (🔒 только чтение);
- `entities/user/index.ts` — пустой public API;
- `widgets/profile/ui/Profile.tsx` — тянет всё глубокими импортами.

## Требования

1. В `index.ts` реэкспортируйте наружу: `User`, `userStore`, `UserCard`, `UserAvatar`.
   Внутренний `formatName` наружу **не** выносите.
2. Перепишите `Profile.tsx` на импорт из `@/entities/user` (одной строкой).
3. Нажмите «Проверить».

## Чеклист

- [ ] `index.ts` отдаёт `User`, `userStore`, `UserCard`, `UserAvatar`
- [ ] `Profile.tsx` импортирует только из `@/entities/user`
- [ ] Нет глубоких импортов
- [ ] Пройти квиз уровня ≥ 80%
