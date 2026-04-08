import { useState } from 'react'
import React from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: withLoading HOC
// Task 4.1: withLoading HOC
// ============================================
//
// Реализуйте HOC withLoading<P>, который принимает компонент
// Implement the withLoading<P> HOC that accepts a component
// с пропсами типа P и возвращает компонент с P & { isLoading: boolean }.
// with props of type P and returns a component with P & { isLoading: boolean }.
//
// Когда isLoading=true — рендерите спиннер.
// When isLoading=true — render a spinner.
// Когда isLoading=false — рендерите оригинальный компонент.
// When isLoading=false — render the original component.
//
// Правила:
// Rules:
//   - P extends object (ограничение generic)
//   - P extends object (generic constraint)
//   - isLoading не должен попасть в оригинальный компонент
//   - isLoading must not pass through to the original component
//   - Установите displayName в формате: withLoading(ComponentName)
//   - Set displayName in the format: withLoading(ComponentName)
//   - HOC создавайте вне рендер-функции!
//   - Create the HOC outside the render function!

// --- Компонент Spinner (можно изменить внешний вид) ---
// --- Spinner component (you can change the appearance) ---

function Spinner() {
  return (
    <div style={{ padding: '1rem', color: '#64748b' }}>
      {/* TODO: Добавьте визуальную индикацию загрузки */}
      {/* TODO: Add visual loading indication */}
      Загрузка...
    </div>
  )
}

// --- Реализуйте withLoading здесь ---
// --- Implement withLoading here ---

// TODO: Реализуйте HOC withLoading<P extends object>
// TODO: Implement the withLoading<P extends object> HOC
// function withLoading<P extends object>(Component: React.ComponentType<P>) {
//   const WithLoading = ({ isLoading, ...props }: P & { isLoading: boolean }) => {
//     // ваш код здесь
//     // your code here
//   }
//   WithLoading.displayName = `withLoading(${???})`
//   return WithLoading
// }

// --- Компоненты для демонстрации ---
// --- Components for demonstration ---

interface UserCardProps {
  name: string
  role: string
}

// TODO: Реализуйте компонент UserCard
// TODO: Implement the UserCard component
function UserCard({ name, role }: UserCardProps) {
  return (
    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      {/* TODO: отобразите name и role */}
      {/* TODO: display name and role */}
      <div>{name}</div>
      <div>{role}</div>
    </div>
  )
}

interface ProductListProps {
  products: Array<{ id: string; name: string; price: number }>
}

// TODO: Реализуйте компонент ProductList
// TODO: Implement the ProductList component
function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {/* TODO: отобразите список продуктов */}
      {/* TODO: display the list of products */}
      {products.map(p => <div key={p.id}>{p.name} — {p.price} ₽</div>)}
    </div>
  )
}

// TODO: Создайте обёрнутые компоненты ЗДЕСЬ (вне рендера!)
// TODO: Create wrapped components HERE (outside render!)
// const UserCardWithLoading = withLoading(UserCard)
// const ProductListWithLoading = withLoading(ProductList)

const MOCK_PRODUCTS = [
  { id: '1', name: 'Keychron K2', price: 8990 },
  { id: '2', name: 'Logitech MX Master 3', price: 6490 },
]

export function Task4_1() {
  const { t } = useLanguage()
  const [loadingUser, setLoadingUser] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)

  const simulateLoad = (setter: (v: boolean) => void) => {
    setter(true)
    setTimeout(() => setter(false), 1500)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.1 — withLoading HOC</h2>
      <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
        {/* Реализуйте HOC withLoading, оберните UserCard и ProductList, добавьте кнопки симуляции загрузки. */}
        {/* Implement the withLoading HOC, wrap UserCard and ProductList, add load simulation buttons. */}
        Реализуйте HOC withLoading, оберните UserCard и ProductList, добавьте кнопки симуляции загрузки.
      </p>

      {/* TODO: После реализации withLoading — замените эти заглушки */}
      {/* TODO: After implementing withLoading — replace these placeholders */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <button
            onClick={() => simulateLoad(setLoadingUser)}
            style={{ marginBottom: '0.75rem', padding: '0.3rem 0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {/* Симулировать загрузку UserCard */}
            {/* Simulate loading UserCard */}
            Симулировать загрузку UserCard
          </button>
          {/* TODO: замените на <UserCardWithLoading isLoading={loadingUser} name="..." role="..." /> */}
          {/* TODO: replace with <UserCardWithLoading isLoading={loadingUser} name="..." role="..." /> */}
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
            TODO: здесь должен быть UserCardWithLoading (isLoading={String(loadingUser)})
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <button
            onClick={() => simulateLoad(setLoadingProducts)}
            style={{ marginBottom: '0.75rem', padding: '0.3rem 0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {/* Симулировать загрузку ProductList */}
            {/* Simulate loading ProductList */}
            Симулировать загрузку ProductList
          </button>
          {/* TODO: замените на <ProductListWithLoading isLoading={loadingProducts} products={MOCK_PRODUCTS} /> */}
          {/* TODO: replace with <ProductListWithLoading isLoading={loadingProducts} products={MOCK_PRODUCTS} /> */}
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
            TODO: здесь должен быть ProductListWithLoading (isLoading={String(loadingProducts)})
          </div>
        </div>
      </div>

      {/* TODO: После реализации раскомментируйте и проверьте displayName */}
      {/* TODO: After implementation uncomment and check displayName */}
      {/* <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
        displayName: {UserCardWithLoading.displayName}
      </div> */}
    </div>
  )
}
