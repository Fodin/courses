# Уровень 7: Metadata & Stylesheets

## Введение

React 19 позволяет рендерить **метаданные документа** (`<title>`, `<meta>`, `<link>`) прямо в компонентах. React автоматически поднимает (hoists) их в `<head>`. Также добавлены API для **предзагрузки ресурсов**.

---

## Document Metadata

### title и meta

```tsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title} — Мой блог</title>
      <meta name="description" content={post.excerpt} />
      <meta name="author" content={post.author} />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

React 19 автоматически:
1. Находит `<title>`, `<meta>`, `<link>` в JSX
2. Поднимает их в `<head>` документа
3. Обновляет при изменении компонента
4. Удаляет при размонтировании

### Преимущества

- **Колокация** — метаданные рядом с контентом
- **Динамические** — обновляются при навигации
- **Нет библиотек** — не нужен react-helmet или next/head

---

## Stylesheet Precedence

```tsx
function Dashboard() {
  return (
    <>
      <link rel="stylesheet" href="/base.css" precedence="default" />
      <link rel="stylesheet" href="/dashboard.css" precedence="high" />
      <div className="dashboard">...</div>
    </>
  )
}
```

### Как работает precedence

| Значение | Приоритет | Использование |
|----------|-----------|---------------|
| `"default"` | Низкий | Базовые стили |
| `"high"` | Высокий | Стили компонента |

React гарантирует:
- Стили загружаются **до** рендера компонента
- Порядок соответствует приоритету
- Дубликаты одного href не загружаются повторно

---

## Preload API

React 19 добавляет функции для предзагрузки ресурсов:

```tsx
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'

function App() {
  // DNS-резолв для стороннего API
  prefetchDNS('https://api.analytics.com')

  // Установить соединение с CDN
  preconnect('https://cdn.example.com')

  // Предзагрузить критичный ресурс
  preload('/hero.jpg', { as: 'image' })

  // Загрузить и выполнить скрипт
  preinit('/analytics.js', { as: 'script' })

  return <div>...</div>
}
```

### Сравнение функций

| Функция | Что делает | Когда использовать |
|---------|-----------|-------------------|
| `prefetchDNS(url)` | Резолвит DNS | Сторонние домены |
| `preconnect(url)` | DNS + TCP + TLS | CDN, API |
| `preload(url, opts)` | Загружает ресурс | Изображения, шрифты |
| `preinit(url, opts)` | Загружает + выполняет | Скрипты |
| `preloadModule(url)` | Загружает ES-модуль | Динамические импорты |
| `preinitModule(url)` | Загружает + выполняет модуль | Виджеты |

### Типы ресурсов

```tsx
// Шрифт
preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

// Стиль
preload('/critical.css', { as: 'style' })

// Изображение
preload('/hero.webp', { as: 'image', imageSrcSet: '...' })
```

---

## Итого

| Возможность | API | Пример |
|-------------|-----|--------|
| Заголовок страницы | `<title>` в JSX | `<title>Страница</title>` |
| Meta-теги | `<meta>` в JSX | `<meta name="desc" content="..."/>` |
| Стили с приоритетом | `precedence` | `<link precedence="high"/>` |
| Предзагрузка | `preload()` и др. | `preload('/img.jpg', {as:'image'})` |
