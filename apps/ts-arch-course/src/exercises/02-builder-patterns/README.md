# Уровень 2: Типобезопасные билдеры

## 🎯 Цель уровня

Научиться создавать Builder-паттерны, в которых TypeScript контролирует порядок вызова методов, отслеживает установленные свойства и ограничивает доступные методы в зависимости от текущего состояния.

---

## Проблема: билдеры без гарантий

Классический Builder в JavaScript не защищает от ошибок:

```typescript
// ❌ Ничто не мешает забыть обязательные поля
const request = new RequestBuilder()
  .header('Content-Type', 'application/json')
  .build() // Ой — забыли URL и метод!

// ❌ Ничто не мешает вызвать body для GET
const getRequest = new RequestBuilder()
  .get('/api/users')
  .body({ data: 'oops' }) // GET с body — семантическая ошибка!
  .build()
```

---

## Паттерн 1: Step Builder

Step Builder использует разные интерфейсы для каждого шага, управляя последовательностью вызовов:

```typescript
// Каждый шаг возвращает интерфейс следующего шага
interface Step1_ChooseMethod {
  get(url: string): Step3_Configure
  post(url: string): Step2_SetBody
  put(url: string): Step2_SetBody
  delete(url: string): Step3_Configure
}

interface Step2_SetBody {
  body(data: string | object): Step3_Configure
}

interface Step3_Configure {
  header(key: string, value: string): Step3_Configure
  timeout(ms: number): Step3_Configure
  build(): HttpRequest
}
```

💡 **Ключевая идея**: возвращаемый тип каждого метода определяет, какие методы доступны далее.

```typescript
function createRequestBuilder(): Step1_ChooseMethod {
  const request: Partial<HttpRequest> = { headers: {} }

  const step3: Step3_Configure = {
    header(key, value) {
      request.headers = { ...request.headers, [key]: value }
      return step3  // Цепочка: можно добавить ещё header
    },
    timeout(ms) {
      request.timeout = ms
      return step3
    },
    build() {
      return { ...request } as HttpRequest
    },
  }

  const step2: Step2_SetBody = {
    body(data) {
      request.body = typeof data === 'string' ? data : JSON.stringify(data)
      return step3  // После body -> переходим к configure
    },
  }

  return {
    get(url) { request.method = 'GET'; request.url = url; return step3 },
    post(url) { request.method = 'POST'; request.url = url; return step2 },
    // ...
  }
}
```

### Гарантии Step Builder

```typescript
// ✅ GET: method -> configure -> build
createRequestBuilder().get('/users').header('Auth', 'Bearer').build()

// ✅ POST: method -> body -> configure -> build
createRequestBuilder().post('/users').body({ name: 'John' }).build()

// ❌ GET с body — метод body() недоступен на step3
createRequestBuilder().get('/users').body({})  // Compile error!

// ❌ POST без body — build() недоступен на step2
createRequestBuilder().post('/users').build()  // Compile error!

// ❌ build() до выбора метода — нет такого метода на step1
createRequestBuilder().build()  // Compile error!
```

---

## Паттерн 2: Accumulating Builder

Accumulating Builder отслеживает установленные свойства через generic-параметр:

```typescript
// TSet накапливает информацию о том, какие поля установлены
class FormBuilder<TSet extends Partial<Record<'title' | 'action' | 'method', true>> = {}> {
  private config: Partial<FormConfig> = {}

  title(value: string): FormBuilder<TSet & { title: true }> {
    this.config.title = value
    return this as any
  }

  action(value: string): FormBuilder<TSet & { action: true }> {
    this.config.action = value
    return this as any
  }

  method(value: 'GET' | 'POST'): FormBuilder<TSet & { method: true }> {
    this.config.method = value
    return this as any
  }

  // build() доступен только когда все обязательные поля установлены
  build(
    this: FormBuilder<{ title: true; action: true; method: true }>
  ): FormConfig {
    return this.config as FormConfig
  }
}
```

📌 **Ключевой трюк**: каждый setter возвращает `FormBuilder<TSet & { field: true }>`. Метод `build()` использует `this:` параметр для ограничения — он доступен только когда `TSet` содержит все обязательные ключи.

### Преимущества перед Step Builder

1. **Порядок не важен** — можно вызывать методы в любом порядке
2. **Опциональные методы** — не влияют на доступность `build()`
3. **Лучшее автодополнение** — IDE показывает все доступные методы

```typescript
// ✅ Любой порядок
new FormBuilder()
  .method('POST')        // TSet = { method: true }
  .title('Contact')      // TSet = { method: true, title: true }
  .action('/submit')     // TSet = { method: true, title: true, action: true }
  .build()               // OK!

// ❌ Не все обязательные поля
new FormBuilder()
  .title('Form')
  .build()  // Error: missing action and method
```

---

## Паттерн 3: Conditional Builder Methods

Методы билдера доступны только в зависимости от текущего состояния:

```typescript
class DbConfigBuilder<T extends 'postgres' | 'mysql' | 'sqlite' | null = null> {
  // Выбор базы данных
  postgres(): DbConfigBuilder<'postgres'> { /* ... */ }
  mysql(): DbConfigBuilder<'mysql'> { /* ... */ }
  sqlite(): DbConfigBuilder<'sqlite'> { /* ... */ }

  // Общие методы
  database(name: string): this { /* ... */ }

  // Только для сетевых баз
  host(this: DbConfigBuilder<'postgres'> | DbConfigBuilder<'mysql'>, h: string): this {
    /* ... */
  }

  // Только для PostgreSQL
  ssl(this: DbConfigBuilder<'postgres'>, enabled: boolean): this { /* ... */ }
  poolSize(this: DbConfigBuilder<'postgres'>, size: number): this { /* ... */ }

  // Только для MySQL
  charset(this: DbConfigBuilder<'mysql'>, charset: string): this { /* ... */ }

  // Только для SQLite
  filename(this: DbConfigBuilder<'sqlite'>, path: string): this { /* ... */ }
  mode(this: DbConfigBuilder<'sqlite'>, mode: 'memory' | 'file'): this { /* ... */ }
}
```

💡 **This-parameter typing**: TypeScript позволяет указать тип `this` в параметрах метода. Если вызвать метод на объекте с несовместимым `this`, будет ошибка компиляции.

```typescript
// ✅ PostgreSQL: ssl и poolSize доступны
new DbConfigBuilder()
  .postgres()
  .host('localhost')
  .ssl(true)
  .poolSize(20)
  .build()

// ✅ SQLite: filename и mode доступны
new DbConfigBuilder()
  .sqlite()
  .filename('./data.db')
  .mode('file')
  .build()

// ❌ SQLite не имеет host
new DbConfigBuilder().sqlite().host('localhost')  // Compile error!

// ❌ MySQL не имеет ssl
new DbConfigBuilder().mysql().ssl(true)  // Compile error!
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Мутабельный билдер, возвращающий this

```typescript
// ❌ Возвращение this не меняет тип
class BadBuilder {
  private url?: string
  setUrl(url: string) {
    this.url = url
    return this // Тип всегда BadBuilder — нет прогресса
  }
  build() {
    return { url: this.url! } // Может упасть в рантайме!
  }
}

// ✅ Возвращение нового типа
class GoodBuilder<TSet extends {}> {
  setUrl(url: string): GoodBuilder<TSet & { url: true }> {
    // ... return с новым generic-типом
  }
  build(this: GoodBuilder<{ url: true }>): Config { /* ... */ }
}
```

### Ошибка 2: Слишком много шагов в Step Builder

```typescript
// ❌ 10 шагов — невозможно запомнить порядок
builder.step1().step2().step3().step4()...step10().build()

// ✅ Step Builder для 2-4 обязательных шагов, Accumulating для большего
```

**Правило**: Step Builder для строгой последовательности (2-4 шага). Accumulating Builder когда порядок неважен.

### Ошибка 3: Потеря generic-контекста при cast

```typescript
// ❌ as any теряет типизацию
title(value: string) {
  this.config.title = value
  return this as any // Все типы потеряны!
}

// ✅ Явное приведение с сохранением generic
title(value: string): FormBuilder<TSet & { title: true }> {
  this.config.title = value
  return this as unknown as FormBuilder<TSet & { title: true }>
}
```

### Ошибка 4: Отсутствие дефолтов для опциональных параметров

```typescript
// ❌ Опциональные поля могут быть undefined
build(): Config {
  return {
    title: this.config.title!,
    logging: this.config.logging, // undefined если не вызвали
  }
}

// ✅ Дефолты в build
build(): Config {
  return {
    title: this.config.title!,
    logging: this.config.logging ?? false, // Гарантированный дефолт
  }
}
```

---

## 🔥 Лучшие практики

1. **Step Builder** для строгих последовательностей (HTTP: method -> body -> headers)
2. **Accumulating Builder** когда порядок вызовов не важен, но обязательные поля нужны
3. **Conditional Builder** для ветвящихся конфигураций (разные БД, протоколы)
4. **Immutable builder** — каждый метод создаёт новый экземпляр (функциональный стиль)
5. **Дефолтные значения** для всех необязательных параметров в `build()`
6. **Fluent API** — все setter-ы возвращают `this` (или новый тип) для цепочки
7. **Минимум шагов** — не более 4-5 в Step Builder, иначе Accumulating
