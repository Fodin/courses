import { useState } from 'react'

// TODO: Define interface MappingExample: / TODO: Определить интерфейс MappingExample:
//   id: string, label: string, openapi: string,
//   typescript: string, description: string

// TODO: Create MAPPING_EXAMPLES array with 6 entries: / TODO: Создать массив MAPPING_EXAMPLES с 6 записями:
//   1. id: 'simple', label: 'Простая модель'
//      openapi: User schema with id (uuid), name, email, age (integer), isActive (boolean)
//      typescript: matching User interface — note: integer → number, required → required fields, others optional
//      description: 'Базовые типы: string, number, boolean, integer → number'
//
//   2. id: 'enum', label: 'Enum'
//      openapi: OrderStatus enum (string) + Order object using $ref to OrderStatus
//      typescript: type OrderStatus = 'pending' | ... + Order interface
//      description: 'OpenAPI enum превращается в TypeScript union type из строковых литералов'
//
//   3. id: 'array', label: 'Массивы'
//      openapi: ProductList with items: array of $ref Product, tags: string[], scores: number[]
//      typescript: ProductList interface with T[] notation
//      description: 'type: array + items → TypeScript Array<T> или T[]'
//
//   4. id: 'nested', label: 'Вложенные объекты'
//      openapi: Address + UserProfile using $ref Address
//      typescript: Address interface + UserProfile interface referencing Address
//      description: '$ref на другую схему → ссылка на соответствующий TypeScript interface'
//
//   5. id: 'oneof', label: 'oneOf → Union type'
//      openapi: Notification oneOf [EmailNotification, SmsNotification, PushNotification]
//      typescript: type Notification = EmailNotification | SmsNotification | PushNotification
//      description: 'oneOf / anyOf превращается в TypeScript union type (|)'
//
//   6. id: 'allof', label: 'allOf → Intersection type'
//      openapi: BaseEntity (id uuid, createdAt, updatedAt) + Product allOf [BaseEntity, {name, price}]
//      typescript: BaseEntity interface + Product as intersection A & B or extends
//      description: 'allOf превращается в TypeScript intersection type (&) — аналог "наследования"'

const LANG_BADGE_COLORS = {
  yaml: '#10b981',
  ts: '#3b82f6',
}

export function Task9_1() {
  // TODO: activeId state: string (default 'simple') / TODO: Состояние activeId: string (по умолчанию 'simple')

  // TODO: Find active example from MAPPING_EXAMPLES
  // TODO: Найти активный пример из MAPPING_EXAMPLES

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>OpenAPI → TypeScript</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Как типы OpenAPI-спецификации превращаются в TypeScript-интерфейсы при генерации кода
      </p>

      {/* TODO: Tabs — one button per example
           Active tab: border and background '#6366f1', color white
           Inactive: border '#e2e8f0', background white */}
      {/* TODO: Вкладки — одна кнопка на пример
           Активная вкладка: рамка и фон '#6366f1', цвет белый
           Неактивная: рамка '#e2e8f0', фон белый */}

      {/* TODO: Description block — yellow background #fefce8, border #fde68a
           Show active.description with '💡 ' prefix */}
      {/* TODO: Блок описания — жёлтый фон #fefce8, рамка #fde68a
           Показать active.description с префиксом '💡 ' */}

      {/* TODO: Split view — two columns
           Left column (YAML):
             Header: dark bg #0f172a, green badge 'YAML', label 'openapi.yaml'
             Code block: bg #1e293b, color #e2e8f0, show active.openapi

           Right column (TypeScript):
             Header: dark bg #0f172a, blue badge 'TS', label 'api.d.ts (сгенерировано)'
             Code block: bg #1e293b, color #93c5fd, show active.typescript */}
      {/* TODO: Разделённый вид — две колонки
           Левая колонка (YAML):
             Заголовок: тёмный фон #0f172a, зелёный бейдж 'YAML', метка 'openapi.yaml'
             Блок кода: фон #1e293b, цвет #e2e8f0, показать active.openapi

           Правая колонка (TypeScript):
             Заголовок: тёмный фон #0f172a, синий бейдж 'TS', метка 'api.d.ts (сгенерировано)'
             Блок кода: фон #1e293b, цвет #93c5fd, показать active.typescript */}

      {/* TODO: Mapping reference table — 12 type pairs, 3-column grid
           Each card: left side green code (OpenAPI type), arrow, right side blue code (TypeScript type)
           Pairs to include:
           ['type: string', 'string'],
           ['type: integer', 'number'],
           ['type: number', 'number'],
           ['type: boolean', 'boolean'],
           ['type: array + items: T', 'T[]'],
           ['type: object', 'interface {}'],
           ["enum: [a, b]", "'a' | 'b'"],
           ['oneOf: [A, B]', 'A | B'],
           ['allOf: [A, B]', 'A & B'],
           ['anyOf: [A, B]', 'A | B | (A & B)'],
           ['required: [x]', 'x: T (обязательное)'],
           ['без required', 'x?: T (опциональное)'] */}
      {/* TODO: Таблица соответствия типов — 12 пар типов, 3-колоночная сетка
           Каждая карточка: слева зелёный код (тип OpenAPI), стрелка, справа синий код (тип TypeScript)
           Включить пары:
           ['type: string', 'string'],
           ['type: integer', 'number'],
           ['type: number', 'number'],
           ['type: boolean', 'boolean'],
           ['type: array + items: T', 'T[]'],
           ['type: object', 'interface {}'],
           ["enum: [a, b]", "'a' | 'b'"],
           ['oneOf: [A, B]', 'A | B'],
           ['allOf: [A, B]', 'A & B'],
           ['anyOf: [A, B]', 'A | B | (A & B)'],
           ['required: [x]', 'x: T (обязательное)'],
           ['без required', 'x?: T (опциональное)'] */}
    </div>
  )
}
