# Задание 5.2: useLocalObservable

## 🎯 Цель

Научиться использовать хук `useLocalObservable` для создания локального MobX-состояния внутри компонента вместо множества `useState`.

## 📋 Требования

1. Создайте компонент формы обратной связи, обёрнутый в `observer`
2. Используйте `useLocalObservable` для создания локального стора с полями:
   - `name: string` — имя отправителя
   - `email: string` — электронная почта
   - `message: string` — текст сообщения
3. Добавьте action-методы для обновления каждого поля: `setName`, `setEmail`, `setMessage`
4. Добавьте computed геттеры:
   - `isValid` — возвращает `true`, если:
     - `name` не пустое
     - `email` содержит символ `@`
     - `message` содержит не менее 10 символов
   - `summary` — возвращает строку вида `"Имя (email): первые 30 символов сообщения..."`
5. Отобразите форму с тремя полями ввода (input для name и email, textarea для message)
6. Покажите статус валидации (Valid: Yes/No)
7. Если форма валидна, покажите превью (summary)

```typescript
useLocalObservable(() => ({
  name: '',
  email: '',
  message: '',
  setName(v: string) { this.name = v },
  setEmail(v: string) { this.email = v },
  setMessage(v: string) { this.message = v },
  get isValid(): boolean,
  get summary(): string,
}))
```

## Чеклист

- [ ] Используется `useLocalObservable` (не `useState` или `makeAutoObservable` вручную)
- [ ] Все три поля формы работают и обновляют стор
- [ ] Computed `isValid` корректно проверяет все три условия
- [ ] Computed `summary` формирует строку-превью
- [ ] Превью отображается только при валидной форме
- [ ] Компонент обёрнут в `observer`

## 🔍 Как проверить себя

1. При пустой форме статус валидации — `No`
2. Заполните имя, email с `@`, сообщение длиной 10+ символов — статус станет `Yes`
3. Под формой появится превью с вашими данными
4. Удалите `@` из email — превью исчезнет, статус вернётся к `No`
