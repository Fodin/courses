// Подсказки для уровня 1: Observable

// 1.1: makeAutoObservable определяет аннотации автоматически:
//   - свойства → observable
//   - геттеры → computed
//   - методы → action

// 1.2: makeObservable требует явных аннотаций:
//   makeObservable(this, {
//     field: observable,
//     method: action,
//     getter: computed,
//   })

// 1.3: MobX поддерживает Map и Set нативно:
//   tags = new Map<string, string>()
//   selected = new Set<number>()

// 1.4: observable.ref отслеживает только замену ссылки:
//   makeObservable(this, { items: observable.ref })
//   // ❌ this.items.push(x) — не отслеживается
//   // ✅ this.items = [...this.items, x] — отслеживается

export {}
