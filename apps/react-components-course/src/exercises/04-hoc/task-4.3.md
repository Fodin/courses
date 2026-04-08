# Задание 4.3: Композиция HOC через compose

## Цель

Реализовать generic-утилиту `compose` для чистой композиции нескольких HOC. Применить `withLoading + withAuth + withErrorBoundary` к одному компоненту и убедиться в правильном порядке оборачивания.

## Требования

1. Реализуйте классовый компонент `ErrorBoundaryClass` с методами:
   - `getDerivedStateFromError` — переводит в режим ошибки
   - `componentDidCatch` — логирует ошибку
   - Рендерит `fallback` или дефолтный UI с текстом ошибки
2. Реализуйте HOC `withErrorBoundary<P>(Component, fallback?)`:
   - Оборачивает компонент в `ErrorBoundaryClass`
   - Устанавливает `displayName`
3. Реализуйте функцию `compose`:
   ```ts
   function compose<P>(...hocs: Array<(c: React.ComponentType<any>) => React.ComponentType<any>>)
     : (Component: React.ComponentType<P>) => React.ComponentType<any>
   ```
   HOC применяются **справа налево** (как в математике: `f(g(h(x)))`): крайний левый HOC — самый внешний слой.
4. Примените через `compose`:
   ```ts
   const EnhancedReport = compose(
     withErrorBoundary,
     withAuth,
     withLoading
   )(ReportComponent)
   ```
5. Добавьте кнопку "Сломать компонент" — компонент внутри должен бросать ошибку, `withErrorBoundary` поймает её
6. Продемонстрируйте все состояния: не авторизован → авторизован, loading → загружен, работает → ошибка

## Подсказки

- `reduceRight` — правильный инструмент для compose: применяет функции справа налево
  ```ts
  hocs.reduceRight((acc, hoc) => hoc(acc), Component)
  ```
- Порядок: `compose(withErrorBoundary, withAuth, withLoading)(Comp)` == `withErrorBoundary(withAuth(withLoading(Comp)))`
- `withLoading` — ближайший к компоненту, его `isLoading` пропс нужен снаружи
- `withAuth` — средний, проверяет авторизацию перед рендером компонента
- `withErrorBoundary` — самый внешний, ловит ошибки из всего дерева внутри

## Чеклист

- [ ] `ErrorBoundaryClass` корректно ловит ошибки
- [ ] `withErrorBoundary` HOC работает
- [ ] `compose` применяет HOC в правильном порядке (справа налево)
- [ ] Скомпозированный компонент принимает все нужные пропсы
- [ ] Все три состояния демонстрируются: загрузка, контент, ошибка
- [ ] Авторизационная проверка работает в составе цепочки

## Как проверить себя

Откройте React DevTools. Дерево должно выглядеть так:
```
withErrorBoundary(withAuth(withLoading(ReportComponent)))
  withAuth(withLoading(ReportComponent))
    withLoading(ReportComponent)
      ReportComponent
```

Нажмите "Сломать" — `ErrorBoundary` покажет UI ошибки без падения всей страницы.
