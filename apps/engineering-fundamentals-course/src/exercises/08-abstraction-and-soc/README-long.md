# Уровень 8: Абстракция и разделение ответственности — подробная теория

## Что такое абстракция и зачем она нужна

Представьте, что вы едете за рулём. Вы нажимаете педаль газа — машина ускоряется. Вам не нужно думать о том, как бензин смешивается с воздухом в цилиндрах, как поршни движутся, как крутящий момент передаётся на колёса. Педаль газа — это абстракция. За ней скрыто несколько сотен движущихся частей.

А теперь представьте: вы везёте гонщика на Формулу-1. Он нажимает педаль — и хочет знать всё: температуру двигателя, момент впрыска, угол опережения зажигания. Для него абстракция «педаль газа» недостаточна — она «протекает» в его область работы.

Это и есть главная истина об абстракциях: **они созданы для определённой аудитории и определённого уровня**.

### Уровни абстракции в программировании

Программное обеспечение существует на нескольких уровнях абстракции одновременно:

```
Бизнес-логика:    оформить заказ, списать деньги, отправить уведомление
  ↓
Доменные операции: создать Order, вызвать PaymentService, отправить Email
  ↓
Инфраструктура:   INSERT INTO orders..., POST /charge, SMTP SEND
  ↓
Системные вызовы: write(), socket(), connect()
  ↓
Машинный код:     байты, регистры, адреса памяти
```

Каждый слой скрывает от верхнего детали нижнего. Разработчик бизнес-логики не думает про TCP-пакеты. Он думает про «списать деньги с карты».

```typescript
// Бизнес-уровень — читается как требование из задачи
async function processCheckout(userId: string, cartId: string): Promise<Order> {
  const cart = await cartService.getCart(cartId)
  const user = await userService.getUser(userId)
  const order = await orderService.create({ cart, user })
  await paymentService.charge(order)
  await notificationService.sendConfirmation(user, order)
  return order
}

// Инфраструктурный уровень — детали реализации скрыты внизу
class StripePaymentService implements PaymentService {
  async charge(order: Order): Promise<void> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'rub',
      customer: order.user.stripeCustomerId,
      payment_method: order.user.defaultPaymentMethodId,
      confirm: true,
    })
    if (paymentIntent.status !== 'succeeded') {
      throw new PaymentError(`Payment failed: ${paymentIntent.status}`)
    }
  }
}
```

`processCheckout` работает на высоком уровне — бизнес-операции. `StripePaymentService` работает на низком уровне — детали Stripe API. Каждый на своём этаже.

---

## SLAP — Single Level of Abstraction Principle

SLAP — принцип, сформулированный Кентом Беком: **каждая функция должна работать на одном уровне абстракции**.

Аналогия: представьте книгу, в которой один абзац — это стратегия завоевания рынка, следующий — как правильно заточить карандаш перед встречей, потом снова о конкурентах. Читать невозможно. Мозг вынужден постоянно переключаться между масштабами.

То же самое происходит с кодом, где в одной функции смешаны разные уровни.

### Нарушение SLAP — как это выглядит

```typescript
// ❌ Всё в одной функции — три уровня абстракции
async function handleUserRegistration(formData: FormData) {
  // Высокий уровень: бизнес-проверка
  const email = formData.get('email') as string
  if (!email || !email.includes('@')) {
    // Низкий уровень: работа с DOM напрямую
    const errorEl = document.querySelector('#email-error')
    errorEl!.textContent = 'Некорректный email'
    errorEl!.style.display = 'block'
    return
  }

  // Высокий уровень: бизнес-операция
  const password = formData.get('password') as string

  // Средний уровень: HTTP-детали
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')!.getAttribute('content')!,
    },
    body: JSON.stringify({ email, password }),
  })

  // Низкий уровень: разбор HTTP-ответа
  if (response.status === 409) {
    document.querySelector('#email-error')!.textContent = 'Email уже существует'
    return
  }

  const data = await response.json()

  // Высокий уровень: навигация
  localStorage.setItem('token', data.token)
  window.location.href = '/dashboard'
}
```

Что здесь плохо:
1. Функцию невозможно протестировать: она работает с DOM и глобальными состояниями
2. Логику сложно переиспользовать: форма привязана к конкретному HTTP-запросу
3. Изменение одного уровня ломает понимание всей функции

### Рефакторинг по SLAP

```typescript
// ✅ Каждая функция — один уровень абстракции

// Верхний уровень: бизнес-оркестрация
async function handleUserRegistration(formData: FormData) {
  const credentials = extractCredentials(formData)
  const validationError = validateCredentials(credentials)

  if (validationError) {
    showFieldError('email', validationError)
    return
  }

  try {
    const token = await registerUser(credentials)
    saveAuthToken(token)
    redirectToDashboard()
  } catch (error) {
    handleRegistrationError(error)
  }
}

// Средний уровень: извлечение и валидация
function extractCredentials(formData: FormData): Credentials {
  return {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
}

function validateCredentials(credentials: Credentials): string | null {
  if (!credentials.email?.includes('@')) return 'Некорректный email'
  if (credentials.password?.length < 8) return 'Пароль слишком короткий'
  return null
}

// Нижний уровень: HTTP и DOM-детали
async function registerUser(credentials: Credentials): Promise<string> {
  const csrfToken = getCsrfToken()
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
    body: JSON.stringify(credentials),
  })
  if (response.status === 409) throw new ConflictError('Email уже существует')
  if (!response.ok) throw new ApiError(`HTTP ${response.status}`)
  const data = await response.json()
  return data.token
}

function showFieldError(field: string, message: string): void {
  const el = document.querySelector(`#${field}-error`)
  if (el) { el.textContent = message; (el as HTMLElement).style.display = 'block' }
}

function saveAuthToken(token: string): void {
  localStorage.setItem('token', token)
}

function redirectToDashboard(): void {
  window.location.href = '/dashboard'
}

function getCsrfToken(): string {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
}
```

Теперь `handleUserRegistration` читается как бизнес-процесс. Детали каждого шага можно найти в соответствующей функции — и они тестируются изолированно.

---

## Separation of Concerns (SoC)

SoC — принцип из 1974 года, описанный Эдсгером Дейкстрой: **разные задачи должны решаться в разных частях системы**.

Аналогия: в ресторане есть зал (UI), кухня (бизнес-логика) и склад (данные). Официант не готовит еду. Повар не принимает оплату. Кладовщик не общается с гостями. У каждого — своя роль, своя ответственность.

### Горизонтальное разделение — слои

Классический вариант: разделение по техническим слоям.

```mermaid
graph LR
  P["Presentation Layer"] --> A["Application Layer"]
  A --> D["Domain Layer"]
  D --> I["Infrastructure Layer"]
```

```typescript
// Presentation Layer — только отображение
function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const colors = { pending: 'yellow', paid: 'green', cancelled: 'red' }
  return <span style={{ background: colors[status] }}>{status}</span>
}

// Application Layer — оркестрация бизнес-операций
class OrderApplicationService {
  constructor(
    private orderRepo: OrderRepository,
    private paymentService: PaymentService,
    private emailService: EmailService,
  ) {}

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    const order = await this.orderRepo.findById(orderId)
    order.cancel(reason)  // вызываем доменную логику
    await this.orderRepo.save(order)
    await this.emailService.sendCancellationNotice(order)
  }
}

// Domain Layer — бизнес-правила, без зависимости от инфраструктуры
class Order {
  private status: OrderStatus = 'pending'
  private cancelledAt?: Date
  private cancellationReason?: string

  cancel(reason: string): void {
    if (this.status === 'paid') {
      throw new DomainError('Оплаченный заказ нельзя отменить напрямую')
    }
    this.status = 'cancelled'
    this.cancelledAt = new Date()
    this.cancellationReason = reason
  }
}

// Infrastructure Layer — детали хранения
class PgOrderRepository implements OrderRepository {
  async findById(id: string): Promise<Order> {
    const row = await this.db.query('SELECT * FROM orders WHERE id = $1', [id])
    return this.mapper.toDomain(row)
  }

  async save(order: Order): Promise<void> {
    const data = this.mapper.toPersistence(order)
    await this.db.query('UPDATE orders SET ...', [data])
  }
}
```

Ключевое: `Order` (Domain) не знает про PostgreSQL. `PgOrderRepository` не содержит бизнес-правил. Каждый слой делает своё.

### Вертикальное разделение — фичи (Feature Slices)

Альтернативный подход: разделить не по техническим слоям, а по бизнес-фичам.

```
features/
  auth/
    api/          ← HTTP-запросы к auth-эндпоинтам
    hooks/        ← useAuth, useLogin, useRegister
    components/   ← LoginForm, RegisterForm
    store/        ← authSlice (Redux/Zustand)
    types.ts
  orders/
    api/
    hooks/
    components/
    store/
    types.ts
  profile/
    api/
    hooks/
    components/
    types.ts
```

Преимущество: **фича — самодостаточная единица**. Хочешь удалить функционал заказов — удаляешь папку `orders/`. Нет раскиданных кусков по разным слоям.

Недостаток: если команд несколько и они работают с разными слоями, горизонтальное разделение удобнее.

### SoC в React: Container/Presentational

Паттерн из 2015 года (Dan Abramov), актуальный по сей день:

```typescript
// ✅ Presentational компонент — только UI, никакой логики
interface ProductListProps {
  products: Product[]
  isLoading: boolean
  error: string | null
  onAddToCart: (productId: string) => void
  onLoadMore: () => void
}

function ProductList({ products, isLoading, error, onAddToCart, onLoadMore }: ProductListProps) {
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
      <button onClick={onLoadMore}>Загрузить ещё</button>
    </div>
  )
}

// ✅ Container компонент — только логика и данные, никакой вёрстки
function ProductListContainer() {
  const { products, isLoading, error, fetchMore } = useProducts()
  const { addToCart } = useCart()

  return (
    <ProductList
      products={products}
      isLoading={isLoading}
      error={error}
      onAddToCart={addToCart}
      onLoadMore={fetchMore}
    />
  )
}
```

С появлением React Hooks этот паттерн реализуется через хуки: логика уходит в хук, компонент остаётся презентационным.

```typescript
// Вся логика в хуке — максимальное разделение
function useProductList() {
  const [page, setPage] = useState(1)
  const { data: products, isLoading, error } = useQuery(['products', page], fetchProducts)

  const { mutate: addToCart } = useMutation(cartApi.add)

  return {
    products: products ?? [],
    isLoading,
    error: error?.message ?? null,
    onAddToCart: addToCart,
    onLoadMore: () => setPage(p => p + 1),
  }
}

// Компонент — чистый рендеринг
function ProductListPage() {
  const props = useProductList()
  return <ProductList {...props} />
}
```

### Нарушает ли CSS-in-JS принцип SoC?

Часто задаваемый вопрос. Ответ: **нет, если понять SoC правиль**.

SoC не означает «HTML в одном файле, CSS в другом, JS в третьем». Это технологическое разделение, а не функциональное. SoC означает разделение по **смысловым задачам**.

Стили кнопки — это ответственность кнопки. Если кнопка меняет стили в зависимости от своего состояния — это не нарушение SoC, это инкапсуляция.

```typescript
// CSS Modules или styled-components — не нарушение SoC
// Стиль кнопки — ответственность компонента Button
const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  background: ${({ variant }) => variant === 'primary' ? '#0066cc' : 'transparent'};
  color: ${({ variant }) => variant === 'primary' ? 'white' : '#0066cc'};
`

// SoC нарушается когда бизнес-логика попадает в стили
// (например, меняем цвет кнопки напрямую из бизнес-слоя)
```

---

## Утечка абстракции (Leaky Abstraction)

В 2002 году Джоэл Спольски сформулировал «Закон дырявых абстракций»:

> **All non-trivial abstractions, to some degree, are leaky.**
> Все нетривиальные абстракции в какой-то степени дырявые.

Это не проблема конкретной библиотеки. Это фундаментальное свойство реальности: любая абстракция скрывает сложность, но иногда эта сложность «просачивается» сквозь абстракцию.

### ORM утекает: проблема N+1

```typescript
// Выглядит как простой код с объектами:
const users = await User.findAll()

for (const user of users) {
  // Выглядит как доступ к полю объекта...
  const posts = await user.getPosts()
  // ...но за этим стоит отдельный SQL-запрос!
  // Если users = 1000, будет 1001 SQL-запрос
  console.log(user.name, posts.length)
}

// ❌ Сгенерированный SQL:
// SELECT * FROM users                    ← 1 запрос
// SELECT * FROM posts WHERE user_id = 1  ← ещё 1
// SELECT * FROM posts WHERE user_id = 2  ← ещё 1
// SELECT * FROM posts WHERE user_id = 3  ← ещё 1
// ... × N users
```

ORM абстрагирует SQL, но чтобы писать эффективный код, нужно понимать, что происходит на уровне базы данных:

```typescript
// ✅ Eager loading — знаем о "дыре" в абстракции и используем правильный инструмент
const users = await User.findAll({
  include: [{ model: Post }],
})
// SQL: SELECT users.*, posts.* FROM users LEFT JOIN posts ON posts.user_id = users.id
// Один запрос вместо N+1
```

### HTTP скрывает TCP, но...

```typescript
// HTTP выглядит просто: отправить запрос, получить ответ
const response = await fetch('/api/data')

// Но TCP-детали «протекают» в нескольких местах:

// 1. Таймауты — нужно управлять вручную
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 5000)
const response = await fetch('/api/data', { signal: controller.signal })
clearTimeout(timeout)

// 2. Keep-alive — HTTP/1.1 переиспользует соединения, но браузер имеет лимиты на параллельные соединения
// 3. Retry-логика — нужна явная, потому что сеть ненадёжна
// 4. Idempotency — GET можно повторять, POST — нет. Нужно знать про HTTP-методы

// ✅ Хорошая HTTP-библиотека скрывает часть этих деталей:
const client = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Accept': 'application/json' },
})
// Но retry, idempotency, circuit breaker — всё равно ваша ответственность
```

### Array.sort() скрывает алгоритм, но...

```typescript
// Выглядит просто:
const sorted = [3, 1, 4, 1, 5].sort((a, b) => a - b)

// Но поведение разное в зависимости от размера массива:
// V8 (Chrome/Node.js): до ~10 элементов — InsertionSort, больше — TimSort
// Важно: sort() мутирует исходный массив — «утечка» изменяемости

const arr = [3, 1, 4]
const sorted = arr.sort()
console.log(arr)    // [1, 3, 4] — оригинал изменён!
console.log(sorted) // [1, 3, 4] — это тот же массив

// ✅ Знаем о "дыре" — делаем копию
const sorted = [...arr].sort((a, b) => a - b)
```

### Что делать с утечками?

Утечки — не повод отказываться от абстракций. Правило: **знай один уровень ниже**.

Работаешь с ORM — понимай SQL. Работаешь с React — понимай как работает reconciliation. Работаешь с HTTPS — понимай HTTP.

```typescript
// Правило: когда абстракция ведёт себя неожиданно — смотри ниже
// React не ре-рендерит компонент?
// → Смотри в алгоритм сравнения (shallow equality для props)
// → Object.is() для примитивов, ссылочное равенство для объектов

// ❌ Непонимание приводит к:
function Parent() {
  const options = { color: 'red' }  // новый объект при каждом рендере
  return <Child options={options} />  // Child ре-рендерится каждый раз
}

// ✅ Знаем про утечку shallow equality:
function Parent() {
  const options = useMemo(() => ({ color: 'red' }), [])  // стабильная ссылка
  return <Child options={options} />
}
```

---

## Слоёная архитектура: принцип зависимостей

Слоёная архитектура — конкретная реализация SoC. Четыре слоя, строгое правило зависимостей.

```mermaid
graph LR
  UI["Presentation\n(UI, Controllers)"] --> App["Application\n(Use Cases)"]
  App --> Dom["Domain\n(Entities, Business Rules)"]
  Dom --> Inf["Infrastructure\n(DB, HTTP, Files)"]
```

Правило: **зависимости текут только вниз**. Presentation зависит от Application, Application от Domain, Domain — ни от чего (или от абстракций Infrastructure через интерфейсы).

```typescript
// ✅ Domain — чистая бизнес-логика, ноль зависимостей от фреймворков
interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
}

interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}

class ChangeUserRoleUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string, newRole: User['role'], requesterId: string): Promise<void> {
    const requester = await this.userRepo.findById(requesterId)
    if (!requester || requester.role !== 'admin') {
      throw new ForbiddenError('Только администратор может менять роли')
    }

    const user = await this.userRepo.findById(userId)
    if (!user) throw new NotFoundError(`Пользователь ${userId} не найден`)

    // Доменное правило: нельзя лишить роли последнего администратора
    if (user.role === 'admin') {
      const admins = await this.userRepo.countByRole('admin')
      if (admins <= 1) throw new DomainError('Нельзя удалить последнего администратора')
    }

    await this.userRepo.save({ ...user, role: newRole })
  }
}

// ✅ Infrastructure — конкретная реализация UserRepository
class PgUserRepository implements UserRepository {
  constructor(private db: Pool) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] ?? null
  }

  async save(user: User): Promise<void> {
    await this.db.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [user.role, user.id]
    )
  }

  async countByRole(role: string): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) FROM users WHERE role = $1', [role])
    return parseInt(result.rows[0].count)
  }
}

// ✅ Presentation — только HTTP, никаких бизнес-правил
app.put('/users/:id/role', authMiddleware, async (req, res) => {
  try {
    await changeRoleUseCase.execute(req.params.id, req.body.role, req.user.id)
    res.json({ success: true })
  } catch (error) {
    if (error instanceof ForbiddenError) return res.status(403).json({ error: error.message })
    if (error instanceof NotFoundError) return res.status(404).json({ error: error.message })
    if (error instanceof DomainError) return res.status(422).json({ error: error.message })
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

Почему Domain не зависит от Infrastructure, а наоборот? Потому что бизнес-правила — самое ценное в приложении. Они не должны знать, какая у нас база данных, PostgreSQL или MongoDB. Это Dependency Inversion Principle в действии.

---

## ⚠️ Частые ошибки начинающих

### Нарушение SLAP: детали в бизнес-функции

```typescript
// ❌ Бизнес-функция знает про CSV-формат
async function exportUserReport(users: User[]) {
  // Бизнес: фильтрация
  const activeUsers = users.filter(u => u.active)

  // Низкий уровень: CSV-генерация прямо в бизнес-функции
  let csv = 'name,email,registeredAt\n'
  for (const user of activeUsers) {
    const date = new Date(user.registeredAt).toLocaleDateString('ru')
    csv += `${user.name},${user.email},${date}\n`
  }

  // Низкий уровень: скачивание файла
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'users.csv'
  a.click()
}
```

```typescript
// ✅ Разделение: каждый уровень знает своё
function getActiveUsers(users: User[]): User[] {
  return users.filter(u => u.active)
}

function usersToCSV(users: User[]): string {
  const header = 'name,email,registeredAt'
  const rows = users.map(u => {
    const date = new Date(u.registeredAt).toLocaleDateString('ru')
    return `${u.name},${u.email},${date}`
  })
  return [header, ...rows].join('\n')
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Оркестрация — читается как требование
async function exportUserReport(users: User[]) {
  const activeUsers = getActiveUsers(users)
  const csv = usersToCSV(activeUsers)
  downloadFile(csv, 'users.csv', 'text/csv')
}
```

### Нарушение SoC: логика в компоненте

```tsx
// ❌ Компонент знает про HTTP, форматирование и бизнес-правила
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        // Бизнес-правило в компоненте: лимит имени
        const name = data.name.length > 50 ? data.name.slice(0, 47) + '...' : data.name
        // Форматирование в компоненте
        const phone = data.phone.replace(/(\d{3})(\d{3})(\d{4})/, '+7 ($1) $2-$3')
        setUser({ ...data, name, phone })
      })
  }, [userId])

  return <div>{user?.name} — {user?.phone}</div>
}
```

```tsx
// ✅ Разделение ответственности
// Хук: загрузка данных
function useUser(userId: string) {
  return useQuery(['user', userId], () => userApi.getById(userId))
}

// Утилиты: форматирование
function truncateName(name: string, maxLength: number = 50): string {
  return name.length > maxLength ? name.slice(0, maxLength - 3) + '...' : name
}

function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+7 ($1) $2-$3')
}

// Компонент: только рендеринг
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId)
  if (isLoading) return <Skeleton />
  return <div>{truncateName(user.name)} — {formatPhone(user.phone)}</div>
}
```

### Нарушение слоёной архитектуры: Domain импортирует Infrastructure

```typescript
// ❌ Domain знает про PostgreSQL
import { Pool } from 'pg'  // ← инфраструктурная зависимость!

class Order {
  constructor(private db: Pool) {}  // ← инъекция БД в доменный объект

  async save(): Promise<void> {
    await this.db.query('INSERT INTO orders ...')
  }
}

// ✅ Domain работает только с абстракциями
interface OrderRepository {
  save(order: Order): Promise<void>
}

class Order {
  // Доменная логика — без зависимостей от инфраструктуры
  validate(): boolean {
    return this.items.length > 0 && this.total > 0
  }
}
```

---

## Итог

- **Абстракция** скрывает сложность за простым контрактом. Разные уровни — разные масштабы карты
- **SLAP**: каждая функция работает на одном уровне абстракции. Если читаешь функцию и замечаешь смену «масштаба» — пора выделить функцию
- **SoC**: разные задачи — в разных местах. Горизонтально (по слоям) или вертикально (по фичам)
- **Утечки неизбежны**: знай один уровень ниже — поймёшь, почему абстракция ведёт себя неожиданно
- **Слоёная архитектура**: зависимости текут в одном направлении. Domain — вершина ценности, не зависит от инфраструктуры
