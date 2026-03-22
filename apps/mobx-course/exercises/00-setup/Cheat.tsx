// ============================================
// ПОДСКАЗКИ / HINTS — Уровень 0: Setup
// ============================================

// ---- Task 0.1 ----
// RU: Импортируйте makeAutoObservable:
// EN: Import makeAutoObservable:
//
// import { makeAutoObservable } from 'mobx'
//
// RU: Класс стора выглядит так:
// EN: Store class looks like this:
//
// class CounterStore {
//   count = 0
//   constructor() { makeAutoObservable(this) }
//   increment() { this.count++ }
//   decrement() { this.count-- }
// }

// ---- Task 0.2 ----
// RU: Импортируйте observer:
// EN: Import observer:
//
// import { observer } from 'mobx-react-lite'
//
// RU: Оборачивайте компонент так:
// EN: Wrap the component like this:
//
// export const Task0_2 = observer(function Task0_2() { ... })
//
// RU: Создавайте стор ВНЕ компонента:
// EN: Create store OUTSIDE the component:
//
// const counterStore = new CounterStore()
//
// RU: Привязывайте кнопки к методам стора:
// EN: Bind buttons to store methods:
//
// <button onClick={() => counterStore.increment()}>+1</button>

// ---- Task 0.3 ----
// RU: Геттер summary — это computed-свойство:
// EN: The summary getter is a computed property:
//
// get summary() {
//   return `${this.name}, ${this.age} years old`
// }
//
// RU: Привязка инпутов к стору:
// EN: Binding inputs to store:
//
// <input
//   value={profileStore.name}
//   onChange={(e) => profileStore.setName(e.target.value)}
// />
//
// RU: Для числового поля конвертируйте строку в число:
// EN: For number field, convert string to number:
//
// onChange={(e) => profileStore.setAge(Number(e.target.value))}

export {}
