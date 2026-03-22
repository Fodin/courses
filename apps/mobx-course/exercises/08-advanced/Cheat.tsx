// 8.1: observer on each ListItem, not on the whole list
// 8.2: intercept(this, 'field', change => { return null to block })
//      observe(this, 'field', change => { log(change.oldValue, change.newValue) })
// 8.3: toJSON() + autorun(() => localStorage.setItem(key, JSON.stringify(store.toJSON())))
// 8.4: Test: const store = new Store(); store.action(); assert(store.computed === expected)
// 8.5: Kanban: columns[], addCard, moveCard, removeCard
export {}
