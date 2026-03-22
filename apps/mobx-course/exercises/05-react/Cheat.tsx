// 5.1: export const MyComponent = observer(function MyComponent() { ... })
// 5.2: const store = useLocalObservable(() => ({ field: 0, setField(v) { this.field = v } }))
// 5.3: const Ctx = createContext<Store | null>(null)
//      function useStore() { return useContext(Ctx)! }
// 5.4: observer on each ListItem, not just on List
export {}
