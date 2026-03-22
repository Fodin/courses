# Задание 2.2: runInAction

## Цель
Использовать `runInAction` для обновления состояния после асинхронной операции.

## Требования

- [ ] Создайте класс `UserLoaderStore` с полями `user`, `loading`, `error`
- [ ] Используйте `makeAutoObservable(this)` в конструкторе
- [ ] Добавьте async метод `loadUser(id)` с имитацией загрузки (setTimeout/Promise)
- [ ] Перед await установите `loading = true` (это внутри action — OK)
- [ ] После await оберните обновление state в `runInAction(() => { ... })`
- [ ] Обработайте ошибку в catch, также через `runInAction`
- [ ] Оберните компонент в `observer`, добавьте кнопку загрузки
