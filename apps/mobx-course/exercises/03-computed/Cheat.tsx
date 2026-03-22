// Подсказки для уровня 3: Computed

// 3.1: computed — это геттер:
//   get totalPrice() { return this.items.reduce(...) }

// 3.2: computed может зависеть от другого computed:
//   get tax() { return this.subtotal * this.taxRate }

// 3.3: computed кешируется автоматически:
//   Повторный доступ без изменения зависимостей не вызывает пересчет

// 3.4: comparer.structural предотвращает ререндер при том же значении:
//   makeAutoObservable(this, {
//     viewport: computed({ equals: comparer.structural }),
//   })

export {}
