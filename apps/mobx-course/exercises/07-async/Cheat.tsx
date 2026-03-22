// 7.1: runInAction(() => { this.users = data; this.isLoading = false })
// 7.2: fetchUsers = flow(function* (this: Store) { this.users = yield api.fetch() })
// 7.3: const promise = store.fetchData(); return () => promise.cancel()
// 7.4: get isStale() { return Date.now() - this.lastFetchedAt > this.maxAge }
// 7.5: Optimistic: update UI first, rollback on error
export {}
