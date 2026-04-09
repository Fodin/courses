# Задание 2.2 — Конструктор конфига Host

## Цель

Создать интерактивную форму для настройки host-приложения с Module Federation, которая генерирует готовый `vite.config.ts` в реальном времени.

## Требования

1. Форма содержит три секции:
   - **name**: текстовое поле — имя host-приложения
   - **remotes**: список подключаемых remote-приложений
   - **shared**: библиотеки, разделяемые через singleton

2. Управление remotes:
   - Кнопка "Добавить remote" добавляет строку с двумя полями: имя remote + URL remoteEntry.js
   - Каждый remote можно удалить
   - URL должен содержать `remoteEntry` (валидация)

3. Управление shared:
   - Пресет из 4 библиотек: `react`, `react-dom`, `react-router-dom`, `zustand`
   - Для каждой: чекбокс `singleton` и поле `requiredVersion`
   - Возможность добавить кастомную библиотеку (поле + кнопка)
   - Пресетные библиотеки нельзя удалить (только кастомные)

4. Live-preview справа от формы:
   - Блок `<pre>` с тёмным фоном
   - Обновляется при каждом изменении формы
   - Отображает валидный синтаксис `vite.config.ts`

5. Валидация:
   - `name` не может быть пустым
   - Должен быть хотя бы один remote
   - URL remote должен содержать `remoteEntry`
   - Список ошибок отображается под формой

## Checklist

- [ ] Поле `name` обязательно, ошибка при пустом значении
- [ ] Можно добавить несколько remotes, каждый можно удалить
- [ ] Для `react` и `react-dom` при снятом `singleton` показывается предупреждение
- [ ] Live-preview обновляется при каждом изменении
- [ ] Добавление кастомной shared-библиотеки через Enter или кнопку
- [ ] При невалидном URL (без `remoteEntry`) отображается ошибка

## Как проверить себя

- Очистите поле `name` — должна появиться ошибка валидации
- Снимите галочку `singleton` с `react` — должно появиться предупреждение "нужен singleton"
- Добавьте remote с URL без `remoteEntry.js` — должна появиться ошибка
- Проверьте, что generated config содержит все введённые данные

## Формат генерируемого конфига

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-app',
      remotes: {
        catalogApp: 'catalogApp@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        'react': { singleton: true, requiredVersion: '^18.0.0' },
        // ...
      },
    }),
  ],
  build: { target: 'esnext', minify: false },
})
```
