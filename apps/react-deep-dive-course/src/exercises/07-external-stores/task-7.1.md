# Задание 7.1: Manual Subscription → useSyncExternalStore

## Задание

Перед вами компонент `useMediaQuery`, реализованный через `useEffect + useState`. Это работающий, но дефектный код: он делает лишний рендер при mount, подвержен tearing и небезопасен при SSR. Ваша задача — отрефакторить его на `useSyncExternalStore`.

## Цель

Понять разницу между ручной подпиской и `useSyncExternalStore`, научиться строить SSR-safe медиа-хуки, которые React рассматривает как часть своего render pipeline.

## Требования

1. Реализовать хук `useMediaQueryV2(query: string): boolean` через `useSyncExternalStore`
2. `subscribe` — стабильная функция, подписывающаяся на изменения `MediaQueryList`
3. `getSnapshot` — возвращает `mql.matches` (примитив, бесконечного цикла нет)
4. `getServerSnapshot` — возвращает `false` (SSR-safe default)
5. При изменении `query` хук должен переподписываться на новый `MediaQueryList` (подсказка: `useMemo` для пересоздания subscribe/getSnapshot)
6. В компоненте-демо показать оба варианта (`V1` через useEffect и `V2` через useSyncExternalStore) side-by-side
7. Добавить счётчик рендеров у каждого компонента, чтобы визуально показать разницу (V1 делает +1 лишний рендер при mount)

## Чеклист

- [ ] `useMediaQueryV2` использует `useSyncExternalStore`, а не `useEffect + setState`
- [ ] `subscribe` возвращает функцию отписки (`mql.removeEventListener`)
- [ ] `getSnapshot` возвращает примитив (`boolean`), не объект
- [ ] `getServerSnapshot` существует и возвращает `false`
- [ ] При смене query компонент корректно переподписывается
- [ ] Оба хука показаны в демо side-by-side с счётчиками рендеров
- [ ] При изменении размера окна (или через DevTools эмуляцию мобильного) оба хука показывают одинаковый результат

## Как проверить себя

1. Откройте DevTools → Elements → Toggle device toolbar (мобильная эмуляция)
2. Переключитесь между мобильным и десктопным viewport
3. Откройте React DevTools Profiler и запишите профиль
4. V2 (useSyncExternalStore) должен показывать один рендер при изменении, V1 — два (у него есть дополнительный setState в useEffect)
5. Убедитесь, что счётчик рендеров V2 при первоначальном монтировании не увеличивается дважды (в отличие от V1)
