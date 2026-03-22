# Задание 4.3: when — Loading Store

## 🎯 Цель

Создать стор загрузки и реализовать два паттерна использования `when`: callback-форму и promise-форму (`await when`).

## 📋 Требования

1. Создайте класс `LoadingStore` с observable полями:
   - `isLoaded: boolean` (по умолчанию `false`)
   - `data: string | null` (по умолчанию `null`)
2. Добавьте метод `startLoading()` — сбрасывает состояние и через `setTimeout` (2 секунды) устанавливает `data` и `isLoaded = true`
3. Добавьте метод `reset()` — сбрасывает `isLoaded` и `data`
4. В компоненте реализуйте **два паттерна**:
   - **when callback**: внутри `useEffect` создайте `when`, который ждёт `isLoaded === true` и пишет в лог
   - **await when**: создайте async-функцию, которая вызывает `startLoading()`, затем `await when(() => isLoaded)`, и после разрешения записывает результат
5. Верните disposer от `when` в cleanup `useEffect`
6. Добавьте три кнопки: Start Loading (callback), Start Loading (await), Reset

## Чеклист

- [ ] `LoadingStore` создан с `makeAutoObservable`
- [ ] when callback срабатывает один раз, когда `isLoaded` становится `true`
- [ ] await when разрешает промис, когда `isLoaded` становится `true`
- [ ] После срабатывания when-callback повторное нажатие Start Loading **не** вызывает повторный callback (when одноразовый)
- [ ] Disposer от when вызывается в cleanup `useEffect`
- [ ] Кнопка Reset сбрасывает состояние

## 🔍 Как проверить себя

1. Нажмите «Start Loading (when callback)» — через 2 секунды в логе появится запись от when
2. Нажмите Reset, затем снова «Start Loading (when callback)» — **новая запись не появится** (when уже сработал и утилизировался)
3. Нажмите «Start Loading (await when)» — через 2 секунды появится результат от await when и запись в логе
4. Await when можно использовать многократно, потому что каждый вызов создаёт новый промис
