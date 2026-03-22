# Задание 7.4: Loading и Cache

## 🎯 Цель

Реализовать стор с кэшированием данных — загружать данные только если они устарели.

## 📋 Требования

Создайте стор `CachedUserStore` с логикой кэширования:

1. Объявите observable-поля:
   - `users: User[]` — список пользователей
   - `isLoading: boolean` — индикатор загрузки
   - `lastFetchedAt: number | null` — timestamp последней загрузки
   - `maxAge: number` — время жизни кэша в миллисекундах (по умолчанию 5000)
2. Реализуйте computed `isStale`:
   - Возвращает `true`, если `lastFetchedAt === null`
   - Возвращает `true`, если `Date.now() - lastFetchedAt > maxAge`
   - Иначе `false`
3. Реализуйте `async fetchIfNeeded()`:
   - Если `!this.isStale` — выйти из метода (данные свежие)
   - Иначе — загрузить пользователей и обновить `lastFetchedAt`
   - Использовать `runInAction` после `await`
4. Реализуйте action `invalidate()` — сбросить `lastFetchedAt = null`
5. В компоненте показать:
   - Кнопку «Fetch if needed»
   - Кнопку «Invalidate cache»
   - Статус: stale или сколько секунд до устаревания

```typescript
class CachedUserStore {
  // ...
  get isStale(): boolean { /* computed */ }
  async fetchIfNeeded(): Promise<void> { /* ... */ }
  invalidate(): void { /* action */ }
}
```

## Чеклист

- [ ] `CachedUserStore` с `makeAutoObservable`
- [ ] `isStale` — computed свойство
- [ ] `fetchIfNeeded` загружает данные только при `isStale === true`
- [ ] `lastFetchedAt` обновляется после успешной загрузки
- [ ] `invalidate()` сбрасывает `lastFetchedAt`
- [ ] Повторное нажатие «Fetch if needed» не перезагружает свежие данные

## 🔍 Как проверить себя

1. Нажмите «Fetch if needed» — данные загрузятся
2. Нажмите ещё раз сразу — загрузки не будет (данные свежие)
3. Подождите 5 секунд и нажмите снова — загрузка произойдёт (данные устарели)
4. Нажмите «Invalidate cache» — статус станет Stale
5. Следующее нажатие «Fetch if needed» загрузит данные заново
