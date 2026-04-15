# Задание 6.2: Either / Result

## Цель

Реализовать тип `Either<L, R>` и функции для работы с ним. Построить форму регистрации с validation pipeline по принципу railway-oriented programming.

## Требования

1. Реализуйте тип и конструкторы:
   - `type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }`
   - `Left<L>(value: L): Either<L, never>`
   - `Right<R>(value: R): Either<never, R>`

2. Реализуйте функции:
   - `map<L, R, R2>(e: Either<L, R>, fn: (v: R) => R2): Either<L, R2>`
   - `flatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2>`
   - `match<L, R, T>(e: Either<L, R>, onLeft: (v: L) => T, onRight: (v: R) => T): T`

3. Реализуйте три валидатора (каждый возвращает `Either<string, ...>`):
   - `validateName(name: string)` — не пусто, минимум 2 символа
   - `validateEmail(email: string)` — не пусто, содержит `@` и `.`
   - `validateAge(age: string)` — не пусто, число, от 18 до 120

4. Соедините их в pipeline через `flatMap` — результат `Either<string, User>`.

5. Компонент должен содержать:
   - Три поля ввода (name, email, age)
   - После каждого поля — статус: `Right` (зелёный) или `Left("сообщение")` (красный)
   - "Railway diagram": 4 блока (validateName → validateEmail → validateAge → createUser) с цветовой индикацией
   - Первый `Left` подсвечен красным, последующие блоки — серые ("не выполнялся")
   - Под диаграммой — финальный результат (Left с ошибкой или Right с данными)

## Чеклист

- [ ] `Left(value)` создаёт `{ tag: 'Left', value }`
- [ ] `Right(value)` создаёт `{ tag: 'Right', value }`
- [ ] `map` на `Left` не вызывает функцию и возвращает тот же `Left`
- [ ] `flatMap` на `Left` не вызывает функцию и возвращает тот же `Left`
- [ ] `match` вызывает `onLeft` для `Left` и `onRight` для `Right`
- [ ] `validateName('')` возвращает `Left`
- [ ] `validateEmail('nodot@com')` возвращает `Left` (нет точки)
- [ ] `validateAge('17')` возвращает `Left` (меньше 18)
- [ ] При корректных данных pipeline возвращает `Right` с объектом пользователя
- [ ] Диаграмма корректно показывает "серые" блоки после первой ошибки

## Как проверить

1. Оставьте все поля пустыми — все блоки красные, первый с ошибкой
2. Введите корректное имя — первый блок зеленеет
3. Введите email без `@` — второй блок красный, третий серый
4. Заполните все поля корректно — все блоки зелёные, показывается `Right({ name, email, age })`
5. Введите возраст `15` — третий блок красный, четвёртый серый
