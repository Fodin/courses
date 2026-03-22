// Подсказки для уровня 2: Actions

// 2.1: configure({ enforceActions: 'always' })
//   Все мутации должны быть внутри action

// 2.2: runInAction(() => { this.field = value })
//   Используется после await для обновления состояния

// 2.3: makeAutoObservable(this, {}, { autoBind: true })
//   Автоматически привязывает this к методам

// 2.4: Все мутации внутри action = один батч = один ререндер

export {}
