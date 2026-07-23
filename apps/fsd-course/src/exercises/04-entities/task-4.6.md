# Задание 4.6 — Разрыв цикла и сборка public API (сложное)

## Цель

Разорвать взаимную зависимость двух сущностей (цикл `user ⇄ company`) и собрать
public API обеих, чтобы граф импортов стал корректным.

## Что дано

- `entities/user/model/types.ts` — `User` с полем `company: Company` (импорт company);
- `entities/company/model/types.ts` — `Company` с полем `ceo: User` (импорт user);
- у обеих сущностей `index.ts` пустой — public API ещё не собран.

## Требования

1. В `user/model/types.ts` уберите импорт `company` и замените `company: Company` на
   `companyId: string`.
2. В `company/model/types.ts` уберите импорт `user` и замените `ceo: User` на
   `ceoId: string`.
3. В `entities/user/index.ts` реэкспортируйте тип `User`.
4. В `entities/company/index.ts` реэкспортируйте тип `Company`.
5. Нажмите «Проверить».

## Чеклист

- [ ] Ни один из файлов не импортирует соседний слайс
- [ ] `User` ссылается на компанию по `companyId`
- [ ] `Company` ссылается на директора по `ceoId`
- [ ] Оба слайса отдают свой тип через `index.ts`
- [ ] Пройти квиз уровня ≥ 80%
