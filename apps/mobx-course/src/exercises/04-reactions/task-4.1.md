# Задание 4.1: autorun — Theme Store

## 🎯 Цель

Создать стор темы и настроить `autorun`, который применяет CSS-класс к `document.body` при каждом изменении темы.

## 📋 Требования

1. Создайте класс `ThemeStore` с observable полем `theme: 'light' | 'dark'` (по умолчанию `'light'`)
2. Добавьте метод `toggleTheme()` — переключает тему между `'light'` и `'dark'`
3. Добавьте метод `setTheme(value)` — устанавливает конкретную тему
4. В компоненте создайте `autorun` внутри `useEffect`, который:
   - Читает `themeStore.theme`
   - Удаляет классы `theme-light` и `theme-dark` с `document.body`
   - Добавляет класс `theme-${theme}` на `document.body`
   - Пишет запись в лог
5. Верните disposer в cleanup-функции `useEffect`
6. В cleanup также удалите CSS-классы с `document.body`
7. Оберните компонент в `observer`

## Чеклист

- [ ] `ThemeStore` создан с `makeAutoObservable`
- [ ] `autorun` запускается сразу при монтировании и применяет начальную тему
- [ ] Нажатие кнопки Toggle Theme переключает тему и `autorun` применяет новый класс
- [ ] Disposer вызывается в cleanup `useEffect`
- [ ] CSS-классы очищаются при размонтировании

## 🔍 Как проверить себя

1. Откройте DevTools → Elements → `<body>`. При монтировании компонента на `body` появится класс `theme-light`
2. Нажмите Toggle Theme — класс сменится на `theme-dark`
3. Посмотрите лог в компоненте — первая запись должна появиться сразу (autorun запускается при создании)
4. Каждое нажатие кнопки добавляет новую запись в лог
