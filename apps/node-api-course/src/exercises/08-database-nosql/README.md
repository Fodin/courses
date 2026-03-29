# 🔥 Уровень 8: NoSQL-базы данных

## 🎯 Три технологии

1. **MongoDB** -- документная БД, гибкая схема, мощная агрегация
2. **Mongoose** -- ODM для MongoDB с валидацией, middleware и типизацией
3. **Redis** -- in-memory хранилище для кэширования, сессий, pub/sub

## 🔥 Документные БД vs Реляционные

| Характеристика | SQL (PostgreSQL) | NoSQL (MongoDB) |
|---|---|---|
| Модель данных | Таблицы, строки, колонки | Коллекции, документы (JSON) |
| Схема | Строгая (ALTER TABLE) | Гибкая (schema-less) |
| Связи | JOIN | Embedding / $lookup |
| Транзакции | ACID по умолчанию | ACID с v4.0 (multi-doc) |
| Масштабирование | Вертикальное | Горизонтальное (шардинг) |
| Лучше для | Сложные связи, финансы | Гибкие данные, прототипы |

📌 **Когда выбирать MongoDB:** данные неструктурированные или часто меняют схему, нужен горизонтальный шардинг, документы естественно вложенные (каталог товаров, CMS, логи).

📌 **Когда оставаться на SQL:** сложные JOIN между таблицами, строгая целостность данных, финансовые транзакции.

## 🔥 MongoDB: Архитектура

```
Client → MongoClient → Connection Pool → mongod
                                        ├── Database
                                        │   ├── Collection (users)
                                        │   │   ├── Document { _id, name, ... }
                                        │   │   └── Document { _id, name, ... }
                                        │   └── Collection (posts)
                                        └── Database
```

### MongoClient и Connection Pool

```typescript
import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://localhost:27017', {
  maxPoolSize: 10,        // Макс. соединений в пуле
  minPoolSize: 2,         // Мин. соединений (всегда готовы)
  maxIdleTimeMS: 30000,   // Таймаут idle-соединения
  retryWrites: true,      // Автоматический retry записи
  w: 'majority'           // Write concern
})

await client.connect()
const db = client.db('myapp')
const users = db.collection('users')
```

### CRUD операции

```typescript
// INSERT
const result = await users.insertOne({
  name: 'Alice',
  email: 'alice@example.com',
  age: 28,
  tags: ['developer', 'nodejs']
})
console.log(result.insertedId) // ObjectId

// FIND
const user = await users.findOne({ email: 'alice@example.com' })
const devs = await users.find({
  tags: 'developer',
  age: { $gte: 25 }
}).toArray()

// UPDATE
await users.updateOne(
  { _id: userId },
  {
    $set: { name: 'Alice Updated' },
    $push: { tags: 'lead' },
    $inc: { loginCount: 1 }
  }
)

// DELETE
const { deletedCount } = await users.deleteOne({ _id: userId })
```

📌 **Операторы обновления:** `$set` (установить), `$unset` (удалить поле), `$push` (добавить в массив), `$pull` (удалить из массива), `$inc` (инкремент), `$addToSet` (уникальное добавление в массив).

### Индексы

```typescript
// Уникальный индекс
await users.createIndex({ email: 1 }, { unique: true })

// Составной индекс
await users.createIndex({ age: 1, name: 1 })

// Текстовый индекс
await users.createIndex({ name: 'text', bio: 'text' })

// TTL индекс (автоудаление через 24 часа)
await sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 })

// Проверка плана запроса
const plan = await users.find({ email: 'test@test.com' }).explain()
// IXSCAN = использован индекс, COLLSCAN = полный перебор (плохо!)
```

### Aggregation Pipeline

```typescript
const results = await users.aggregate([
  { $match: { tags: 'developer' } },
  { $group: {
    _id: '$role',
    count: { $sum: 1 },
    avgAge: { $avg: '$age' }
  }},
  { $sort: { count: -1 } },
  { $limit: 10 }
]).toArray()

// $lookup (аналог JOIN)
const usersWithOrders = await users.aggregate([
  { $lookup: {
    from: 'orders',
    localField: '_id',
    foreignField: 'userId',
    as: 'orders'
  }},
  { $addFields: { orderCount: { $size: '$orders' } } }
]).toArray()
```

## 🔥 Mongoose ODM

### Schema и Model

```typescript
import mongoose, { Schema, model, Document } from 'mongoose'

interface IUser extends Document {
  name: string
  email: string
  age: number
  role: 'user' | 'admin'
  fullInfo: string
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Min 2 chars']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  age: { type: Number, min: 0, max: 150 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true })
```

### Virtuals

```typescript
userSchema.virtual('fullInfo').get(function() {
  return `${this.name} (${this.email})`
})

// Виртуальная связь (не хранится в БД)
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
})
```

### Middleware (хуки)

```typescript
// Pre-save: хеширование пароля
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})

// Post-save: отправка email
userSchema.post('save', function(doc) {
  sendWelcomeEmail(doc.email)
})

// Pre-find: фильтр удалённых
userSchema.pre(/^find/, function(next) {
  this.where({ isDeleted: { $ne: true } })
  next()
})
```

### Population (загрузка связей)

```typescript
// Простой populate
const post = await Post.findById(id).populate('author')

// Выборочный populate
const post = await Post.findById(id).populate('author', 'name email')

// Глубокий populate
const post = await Post.findById(id)
  .populate('author')
  .populate({
    path: 'comments',
    populate: { path: 'author', select: 'name' }
  })

// Фильтрация при populate
const user = await User.findById(id).populate({
  path: 'posts',
  match: { published: true },
  options: { sort: { createdAt: -1 }, limit: 5 }
})
```

## 🔥 Redis

### Структуры данных

```typescript
import { createClient } from 'redis'

const client = createClient({ url: 'redis://localhost:6379' })
await client.connect()

// Strings
await client.set('key', 'value')
await client.setEx('session:abc', 60, JSON.stringify({ userId: 1 })) // TTL 60s
const val = await client.get('key')

// Hashes (объекты)
await client.hSet('user:1', { name: 'Alice', email: 'alice@test.com' })
const user = await client.hGetAll('user:1')

// Lists (очереди)
await client.lPush('queue:emails', 'job1', 'job2')
const next = await client.rPop('queue:emails') // FIFO

// Sets (уникальные значения)
await client.sAdd('tags:post:1', 'nodejs', 'api')
const tags = await client.sMembers('tags:post:1')

// Sorted Sets (с рейтингом)
await client.zAdd('leaderboard', { score: 100, value: 'alice' })

// Delete
await client.del('key')
```

### Cache-Aside паттерн

```typescript
async function getUserById(id: string) {
  const cacheKey = `user:${id}`

  // 1. Проверяем кэш
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached) // Cache HIT

  // 2. Запрос к БД (Cache MISS)
  const user = await db.users.findById(id)

  // 3. Записываем в кэш с TTL
  if (user) {
    await redis.setEx(cacheKey, 300, JSON.stringify(user)) // 5 min
  }
  return user
}

// Инвалидация при обновлении
async function updateUser(id: string, data: Partial<User>) {
  await db.users.updateById(id, data)
  await redis.del(`user:${id}`) // Удаляем из кэша
}
```

### Pub/Sub

```typescript
// Подписчик (отдельное соединение!)
const subscriber = createClient()
await subscriber.connect()

await subscriber.subscribe('notifications', (message) => {
  console.log('Received:', JSON.parse(message))
})

// Паттерн-подписка
await subscriber.pSubscribe('order:*', (message, channel) => {
  console.log(`${channel}: ${message}`)
})

// Издатель
const publisher = createClient()
await publisher.connect()

await publisher.publish('notifications', JSON.stringify({
  type: 'new_order',
  orderId: 'ORD-001'
}))
```

⚠️ **Важно:** подписчик не может выполнять другие команды Redis. Используйте отдельное соединение для pub/sub.

## ⚠️ Частые ошибки новичков

### Ошибка 1: Embedding vs Reference

```typescript
// ❌ Embedding больших/растущих данных
const userSchema = {
  name: String,
  orders: [orderSchema]  // Массив растёт бесконечно!
}
// MongoDB документ ограничен 16 МБ

// ✅ Reference для растущих коллекций
const orderSchema = {
  userId: { type: ObjectId, ref: 'User' },
  items: [itemSchema]  // Ограниченный набор
}
```

### Ошибка 2: Забыли индекс

```typescript
// ❌ COLLSCAN на миллионах документов
await users.find({ email: 'alice@test.com' }) // Полный перебор!

// ✅ Создайте индекс
await users.createIndex({ email: 1 }, { unique: true })
// Теперь IXSCAN -- O(log n) вместо O(n)
```

### Ошибка 3: N+1 запросы в Mongoose

```typescript
// ❌ N+1: один запрос + N populate
const posts = await Post.find()
for (const post of posts) {
  post.author = await User.findById(post.authorId) // N запросов!
}

// ✅ Используйте populate
const posts = await Post.find().populate('author')
// 2 запроса: find posts + find users WHERE _id IN [...]
```

### Ошибка 4: Redis без TTL

```typescript
// ❌ Кэш без срока жизни -- memory leak
await redis.set('user:1', JSON.stringify(user))

// ✅ Всегда устанавливайте TTL
await redis.setEx('user:1', 300, JSON.stringify(user)) // 5 min
```

## 💡 Best Practices

1. **Embedding** для данных, которые читаются вместе и редко меняются (адрес в заказе)
2. **Reference** для данных, которые растут или нужны отдельно (посты пользователя)
3. **Индексы** на всех полях, по которым фильтруете/сортируете
4. **TTL** на всех ключах Redis -- предотвращайте утечки памяти
5. **Отдельное соединение** для Redis Pub/Sub
6. **Mongoose middleware** для cross-cutting concerns (хеширование, soft-delete)
7. **Aggregation pipeline** вместо обработки в коде -- MongoDB оптимизирует
