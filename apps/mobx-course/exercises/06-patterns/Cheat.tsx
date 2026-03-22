// 6.1: Domain Store — pure business logic, no UI
// 6.2: UI Store — filter, editingId, isFormOpen
// 6.3: class RootStore { todoStore; uiStore; constructor() { this.todoStore = new TodoStore(this) } }
// 6.4: class Todo { constructor() { makeAutoObservable(this) } toggle() { this.completed = !this.completed } }
export {}
