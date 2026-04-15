import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Определите тип Maybe<T> как tagged union
// Два варианта: Some (есть значение) и None (нет значения)
// ============================================

// type Maybe<T> = { tag: 'Some'; value: T } | { tag: 'None' }

// ============================================
// TODO 2: Реализуйте конструкторы
// ============================================

// function Some<T>(value: T): Maybe<T> { ... }
// const None: Maybe<never> = { tag: 'None' }

// ============================================
// TODO 3: Реализуйте fromNullable
// null/undefined → None, иначе → Some(value)
// ============================================

// function fromNullable<T>(v: T | null | undefined): Maybe<T> { ... }

// ============================================
// TODO 4: Реализуйте map
// Применяет fn если Some, возвращает None если None
// ============================================

// function maybeMap<T, U>(m: Maybe<T>, fn: (v: T) => U): Maybe<U> { ... }

// ============================================
// TODO 5: Реализуйте flatMap
// Как map, но fn возвращает Maybe (избегаем Maybe<Maybe<T>>)
// ============================================

// function maybeFlatMap<T, U>(m: Maybe<T>, fn: (v: T) => Maybe<U>): Maybe<U> { ... }

// ============================================
// TODO 6: Реализуйте getOrElse
// Возвращает значение из Some или fallback если None
// ============================================

// function getOrElse<T>(m: Maybe<T>, fallback: T): T { ... }

// ============================================
// Типы данных для демо
// ============================================

interface Address {
  city?: string
  zip?: string
}

interface Subscription {
  plan?: string
}

interface UserProfile {
  name: string
  address?: Address
  subscription?: Subscription
}

// TODO 7: Определите три пресета пользователей
// - Один с полными данными (address.city, address.zip, subscription.plan)
// - Один с частичными (address.city без zip, subscription без plan)
// - Один без address (только subscription)
const PRESET_USERS: { label: string; user: UserProfile }[] = [
  // Пример структуры:
  // { label: 'Полные данные', user: { name: 'Анна', address: { city: 'Москва', zip: '101000' }, subscription: { plan: 'Pro' } } },
]

// TODO 8: Реализуйте getCityMaybe через fromNullable + flatMap + getOrElse
// function getCityMaybe(user: UserProfile): string { ... }

// TODO 9: Реализуйте getZipMaybe аналогично
// function getZipMaybe(user: UserProfile): string { ... }

// TODO 10: Реализуйте getPlanMaybe
// function getPlanMaybe(user: UserProfile): string { ... }

// Заглушка чтобы TypeScript не жаловался
void PRESET_USERS

export function Task6_1() {
  const { t } = useLanguage()
  const [presetIdx, setPresetIdx] = useState(0)
  void presetIdx
  void setPresetIdx

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      {/* TODO 11: Добавьте кнопки выбора пресета */}

      {/* TODO 12: Добавьте две колонки:
          Левая — "Традиционный if/null" с вложенными проверками
          Правая — "Maybe chain" через fromNullable/flatMap/getOrElse */}

      {/* TODO 13: Добавьте блок "Шаги Maybe-цепочки"
          Показывает промежуточные Some(...)/None для city */}
    </div>
  )
}
