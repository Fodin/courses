import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.1: Декомпозиция ProductPage
// Task 0.1: ProductPage Decomposition
// ============================================
// Разбейте монолитную страницу товара на 4 компонента:
// Split the monolithic product page into 4 components:
// ProductCard, ReviewsList, AddToCartForm, RelatedProducts

// TODO: Определите интерфейсы для данных
// TODO: Define interfaces for the data
// interface Product { ... }
// interface Review { ... }

// TODO: Создайте компонент ProductCard
// TODO: Create the ProductCard component
// Принимает: product: Product
// Accepts: product: Product
// Отображает: фото, название, описание, цену, количество в наличии
// Displays: photo, name, description, price, stock quantity
// function ProductCard({ product }: { product: Product }) { ... }

// TODO: Создайте компонент ReviewsList
// TODO: Create the ReviewsList component
// Принимает: reviews: Review[]
// Accepts: reviews: Review[]
// Отображает: список отзывов с автором, звёздочками, текстом и датой
// Displays: a list of reviews with author, stars, text, and date
// function ReviewsList({ reviews }: { reviews: Review[] }) { ... }

// TODO: Создайте компонент AddToCartForm
// TODO: Create the AddToCartForm component
// Принимает: productId: string, stock: number
// Accepts: productId: string, stock: number
// Управляет: количеством товара (useState), статусом кнопки (useState)
// Manages: product quantity (useState), button status (useState)
// Кнопка "В корзину" меняет текст на "Добавлено ✓" на 2 секунды
// "Add to Cart" button changes text to "Added ✓" for 2 seconds
// function AddToCartForm({ productId, stock }: { ... }) { ... }

// TODO: Создайте компонент RelatedProducts
// TODO: Create the RelatedProducts component
// Принимает: products: Product[]
// Accepts: products: Product[]
// Отображает: горизонтальную плитку похожих товаров
// Displays: a horizontal tile of related products
// function RelatedProducts({ products }: { products: Product[] }) { ... }

// Моковые данные — используйте в компоненте Task0_1
// Mock data — use in the Task0_1 component
const mockProduct = {
  id: '1',
  name: 'Механическая клавиатура Keychron K2',
  description: 'Компактная механическая клавиатура с Bluetooth и проводным режимом.',
  price: 8990,
  image: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Keyboard',
  stock: 15,
  category: 'Периферия',
}

const mockReviews = [
  { id: '1', author: 'Алексей К.', rating: 5, text: 'Отличная клавиатура!', date: '15.03.2024' },
  { id: '2', author: 'Марина П.', rating: 4, text: 'Хорошее качество сборки.', date: '02.03.2024' },
]

const mockRelated = [
  { id: '2', name: 'Мышь Logitech MX Master 3', description: '', price: 6490, image: 'https://placehold.co/150x120/e3f2fd/1565c0?text=Mouse', stock: 8, category: 'Периферия' },
  { id: '3', name: 'Коврик для мыши XL', description: '', price: 1290, image: 'https://placehold.co/150x120/fce4ec/880e4f?text=Pad', stock: 20, category: 'Аксессуары' },
]

export function Task0_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 0.1</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        {/* Декомпозируйте страницу товара на компоненты: ProductCard, AddToCartForm, ReviewsList, RelatedProducts */}
        {/* Decompose the product page into components: ProductCard, AddToCartForm, ReviewsList, RelatedProducts */}
        Декомпозируйте страницу товара на компоненты: ProductCard, AddToCartForm, ReviewsList, RelatedProducts
      </p>

      {/* TODO: Отрендерите четыре компонента, используя данные выше */}
      {/* TODO: Render the four components using the data above */}
      {/* <ProductCard product={mockProduct} /> */}
      {/* <AddToCartForm productId={mockProduct.id} stock={mockProduct.stock} /> */}
      {/* <ReviewsList reviews={mockReviews} /> */}
      {/* <RelatedProducts products={mockRelated} /> */}

      {/* Временная заглушка — замените на реальные компоненты */}
      {/* Temporary placeholder — replace with actual components */}
      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должна быть страница товара, декомпозированная на 4 компонента
        <br />
        <small>Используйте: {JSON.stringify(Object.keys(mockProduct))}</small>
        <br />
        <small>Отзывов: {mockReviews.length}, Похожих: {mockRelated.length}</small>
      </div>
    </div>
  )
}
