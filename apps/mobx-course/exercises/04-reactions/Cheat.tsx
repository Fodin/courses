// Hints for Level 4: Reactions

// 4.1: const disposer = autorun(() => { /* side effect */ })
//   Call disposer() on unmount

// 4.2: const disposer = reaction(
//   () => store.query,  // data function
//   (query) => { /* effect */ }  // effect function
// )

// 4.3: when(() => store.isLoaded, () => { /* one-time effect */ })
//   Or: await when(() => store.isLoaded)

// 4.4: useEffect(() => { return () => disposer() }, [])
//   Don't forget to clean up reactions!

export {}
