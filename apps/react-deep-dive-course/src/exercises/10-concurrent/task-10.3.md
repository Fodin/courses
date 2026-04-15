# Задание 10.3: Suspense Waterfall vs Parallel

## Цель

Наглядно продемонстрировать waterfall-проблему в Suspense и способ её устранения. Измерить разницу во времени загрузки между последовательным и параллельным подходами.

## Задание

Создайте два сценария загрузки данных пользователя — "Waterfall" и "Parallel" — с визуализацией таймлайна.

### Данные для имитации

Используйте два "медленных" fetch — имитация через Promise + setTimeout:
- `fetchUserProfile(id)` — задержка 1200ms, возвращает `{ name, role, avatar }`
- `fetchUserPosts(id)` — задержка 800ms, возвращает массив постов `{ title, date }[]`

Используйте `createResource` (паттерн из задания 10.1) для wrapping Promise.

### Waterfall сценарий

```
<Suspense fallback={<ProfileSkeleton />}>
  <WaterfallUserProfile>        ← fetch profile здесь, suspend
    <Suspense fallback={<PostsSkeleton />}>
      <WaterfallUserPosts />    ← fetch posts здесь, suspend ПОСЛЕ profile resolve
    </Suspense>
  </WaterfallUserProfile>
</Suspense>
```

Posts fetch НЕ запускается до тех пор, пока Profile не получил данные.

### Parallel сценарий

```
// В родителе — оба fetch стартуют одновременно
const profileResource = createResource(fetchUserProfile(userId))
const postsResource = createResource(fetchUserPosts(userId))

<Suspense fallback={<BothSkeleton />}>
  <ParallelUserProfile resource={profileResource} />
  <ParallelUserPosts resource={postsResource} />
</Suspense>
```

### Таймлайн визуализация

Под каждым сценарием — горизонтальный таймлайн с двумя полосками:
- "Profile fetch" — синяя полоска, длина пропорциональна 1200ms
- "Posts fetch" — зелёная полоска, длина пропорциональна 800ms

В waterfall Posts начинается после Profile. В parallel оба стартуют одновременно.

Показывать: "Итого: Xms" — реальное измеренное время с момента клика до показа полных данных.

## Требования

1. `createResource<T>(promise: Promise<T>)` — функция из задания 10.1 (реализовать здесь заново или использовать локальную копию)
2. `fetchUserProfile` и `fetchUserPosts` — симулированные fetch через `new Promise(r => setTimeout(r, ms, data))`
3. Waterfall: Posts resource создаётся внутри `WaterfallUserProfile` компонента (после получения данных)
4. Parallel: оба resource создаются в родителе одновременно, передаются как props
5. Кнопка "Перезагрузить" для каждого сценария — сбрасывает resources и запускает заново
6. Измерение времени: `Date.now()` при клике "Перезагрузить", `Date.now()` когда оба компонента отрендерились (через `useEffect` в нижнем компоненте)
7. Таймлайн — CSS-полоски с фиксированной шириной пропорционально задержкам

## Чеклист

- [ ] Waterfall: fetch posts запускается ТОЛЬКО после resolve profile fetch
- [ ] Parallel: оба fetch запускаются одновременно при клике "Перезагрузить"
- [ ] Время waterfall ~ 1200 + 800 = 2000ms
- [ ] Время parallel ~ max(1200, 800) = 1200ms
- [ ] Таймлайн корректно отражает последовательность запросов
- [ ] Skeleton-заглушки видны в период loading
- [ ] Кнопка "Перезагрузить" работает и сбрасывает оба сценария

## Как проверить себя

1. Нажмите "Загрузить" в обоих сценариях одновременно — засеките время
2. Waterfall займёт ~2000ms, Parallel ~1200ms — разница наглядная
3. В waterfall сначала появится Profile, потом — Posts с задержкой
4. В parallel оба появятся одновременно (~1200ms)
5. Таймлайн-полоски должны точно отражать эту разницу
