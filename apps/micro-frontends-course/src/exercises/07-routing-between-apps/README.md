# Уровень 7: Роутинг между приложениями

## Проблема: у каждого MFE свой роутер

Представьте оркестр, где у каждого музыканта свои часы — и они играют по своим. Именно так выглядит URL в системе микрофронтендов без централизованного роутинга: Shell думает, что сейчас `/catalog`, Cart MFE думает, что сейчас `/cart/checkout`, а браузерная история содержит смесь их попыток управлять адресной строкой.

У браузера один URL. Но у нас четыре команды, каждая из которых хочет быть дирижёром.

## Shell-router: один хозяин URL

Фундаментальный принцип: **только Shell владеет `history` API**. MFE никогда не вызывают `history.pushState()` напрямую.

```
Browser URL ←── history.pushState() ←── Shell Router
                                              ↑
                         CustomEvent('navigate', { path }) ←── Catalog MFE
                         CustomEvent('navigate', { path }) ←── Cart MFE
                         CustomEvent('navigate', { path }) ←── Profile MFE
```

Shell слушает события от MFE, принимает решение о переходе и единственный меняет URL.

```js
// Shell: слушаем запросы на навигацию от всех MFE
window.addEventListener('mfe:navigate', (event) => {
  const { path } = event.detail
  router.navigate(path) // Shell выполняет переход
})

// Catalog MFE: хочет перейти — просим Shell
function navigateTo(path) {
  window.dispatchEvent(
    new CustomEvent('mfe:navigate', { detail: { path } })
  )
}
```

## Top-level vs Nested routing

Маршруты делятся на два уровня:

```
/ ──────────────────────── Shell (верхний уровень)
├── /catalog/* ──────────── Catalog MFE (владеет подпутями)
│   ├── /catalog ──────────── CatalogList (внутри MFE)
│   ├── /catalog/search ───── CatalogSearch
│   └── /catalog/:id ──────── ProductDetail
├── /cart/* ─────────────── Cart MFE
│   ├── /cart ──────────────── CartPage
│   └── /cart/checkout ────── CheckoutPage
└── /profile/* ──────────── Profile MFE
```

Shell знает только о верхнем уровне (`/catalog/*`). Всё, что начинается с `/catalog/` — зона ответственности Catalog MFE. Shell передаёт управление и больше не вмешивается во внутренние маршруты.

```js
// React Router v6 в Shell
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/catalog/*',      // wildcard: всё, что после /catalog/ — Catalog MFE
    element: <CatalogMFE />,
    // children не нужны: внутренний роутер Catalog MFE сам разберётся
  },
  {
    path: '/cart/*',
    element: <CartMFE />,
  },
])
```

В самом Catalog MFE свой Router, который видит только относительные пути:

```js
// Catalog MFE (внутренний роутер)
const catalogRouter = createBrowserRouter([
  { index: true, element: <CatalogList /> },         // /catalog
  { path: 'search', element: <CatalogSearch /> },    // /catalog/search
  { path: ':id', element: <ProductDetail /> },       // /catalog/:id
])
```

## Конфликт pushState: когда два MFE спорят об URL

```
время:  ─────────────────────────────────────────→
Cart:         pushState('/cart/checkout') ────┐
Catalog:                          pushState('/catalog/42') ─┐
                                               ↓             ↓
URL:                               /cart/checkout   /catalog/42  ← побеждает последний!
```

Это не теоретическая проблема. В реальных приложениях такое происходит при:
- Одновременном монтировании нескольких MFE
- Race condition при async загрузке MFE
- MFE, который «просыпается» и пытается восстановить своё состояние

⚠️ `history.pushState()` не бросает исключение при конфликте — второй вызов тихо перезаписывает первый.

## Коммуникация при навигации

Два паттерна: Custom Events и Shared Bus.

**Custom Events** — простой браузерный стандарт, не требует дополнительных библиотек:

```js
// MFE отправляет запрос
window.dispatchEvent(new CustomEvent('mfe:navigate', {
  detail: { path: '/cart/checkout', source: 'cart-mfe' }
}))

// Shell слушает и выполняет
window.addEventListener('mfe:navigate', ({ detail }) => {
  console.log(`[Shell] навигация запрошена от ${detail.source}: ${detail.path}`)
  router.navigate(detail.path)
})
```

**Shared Navigation Bus** — если нужна очередь, история событий, middleware:

```js
// navigation-bus.js (shared singleton)
class NavigationBus {
  private handlers: Array<(path: string) => void> = []

  navigate(path: string, source: string) {
    console.log(`[NavigationBus] ${source} → ${path}`)
    this.handlers.forEach(h => h(path))
  }

  onNavigate(handler: (path: string) => void) {
    this.handlers.push(handler)
    return () => this.handlers = this.handlers.filter(h => h !== handler)
  }
}

export const navigationBus = new NavigationBus()
```

## Deep Linking

Deep link — это URL, набранный напрямую или полученный по ссылке из внешнего источника. Например, пользователь открывает `/catalog/42` через email-ссылку.

```
Сценарий:
  1. Браузер загружает страницу с URL /catalog/42
  2. Shell анализирует URL: путь начинается с /catalog → нужен Catalog MFE
  3. Shell загружает Catalog MFE
  4. Передаёт initialPath = '/catalog/42'
  5. Catalog MFE монтируется и внутренний роутер сразу открывает ProductDetail
```

```js
// Shell передаёт начальный путь в MFE
function CatalogMFE() {
  const location = useLocation()
  return (
    <CatalogApp
      initialPath={location.pathname}  // '/catalog/42'
      basePath="/catalog"
    />
  )
}
```

## Lazy vs Eager загрузка MFE

| | Lazy | Eager |
|---|---|---|
| Когда загружается | При первом переходе на маршрут | При старте Shell |
| Время первого рендера | Чуть медленнее (+ время загрузки) | Мгновенно |
| Влияние на время старта Shell | Нет | Увеличивает |
| Подходит для | Большинство MFE | Shell, часто используемые MFE |

```js
// Lazy (рекомендуется для большинства MFE)
const CatalogMFE = lazy(() => import('./catalog/catalog-entry'))

// Eager (для критически важных)
import CatalogMFE from './catalog/catalog-entry'
```

## SEO и Server-Side Rendering

Для публичных страниц deep linking недостаточно — нужен SSR. Каждый MFE должен уметь рендериться на сервере по своему маршруту:

```
GET /catalog/42
  → Server: определяет маршрут → Catalog MFE
  → Рендерит ProductDetail на сервере
  → Отдаёт HTML с правильным title, meta og:*, structured data
```

📌 В большинстве B2B и внутренних приложений SSR не нужен — достаточно client-side deep linking с правильным `nginx` (`try_files $uri /index.html`).

## Стратегия: правила роутинга в команде

```
✅ Shell владеет history API — только Shell вызывает pushState
✅ MFE используют события/шину для запросов навигации
✅ Shell route = prefix + wildcard (/catalog/*)
✅ MFE route = относительные пути без base (search, :id)
✅ Deep links обрабатываются Shell: URL → нужный MFE → initialPath
✅ Порядок routes: точные маршруты перед wildcard, * в конце

❌ MFE не вызывает history.pushState() или history.replaceState() напрямую
❌ Не дублируйте shell prefix в internal routes MFE (/catalog/search — плохо, search — хорошо)
❌ Wildcard-маршрут (*) не в конце списка — другие маршруты после него никогда не сработают
```
