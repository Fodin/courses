import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Определите тип Either<L, R> как tagged union
// Left — ошибка, Right — успех
// ============================================

// type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

// ============================================
// TODO 2: Реализуйте конструкторы
// ============================================

// function Left<L>(value: L): Either<L, never> { ... }
// function Right<R>(value: R): Either<never, R> { ... }

// ============================================
// TODO 3: Реализуйте map
// Применяет fn к Right, возвращает Left без изменений
// ============================================

// function eitherMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => R2): Either<L, R2> { ... }

// ============================================
// TODO 4: Реализуйте flatMap
// fn возвращает Either, позволяет цепочки валидации
// ============================================

// function eitherFlatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> { ... }

// ============================================
// TODO 5: Реализуйте match (fold)
// Принимает два обработчика: для Left и для Right
// ============================================

// function match<L, R, T>(e: Either<L, R>, onLeft: (v: L) => T, onRight: (v: R) => T): T { ... }

// ============================================
// TODO 6: Реализуйте три валидатора
// Каждый возвращает Either<string, ...>
// ============================================

// validateName: не пусто, минимум 2 символа
// function validateName(name: string): Either<string, string> { ... }

// validateEmail: не пусто, содержит @ и .
// function validateEmail(email: string): Either<string, string> { ... }

// validateAge: не пусто, число, от 18 до 120
// function validateAge(age: string): Either<string, number> { ... }

// ============================================
// TODO 7: Реализуйте pipeline через flatMap
// Соедините все три валидатора в одну Either<string, User>
// function createRegistrationPipeline(name: string, email: string, age: string): Either<string, {...}> { ... }
// ============================================

export function Task6_2() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', age: '' })
  void setForm

  return (
    <div className="exercise-container">
      <h2>{t('task.6.2')}</h2>

      {/* TODO 8: Поля формы с onChange handlers */}
      <div>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Имя" />
        <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" />
        <input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Возраст" />
      </div>

      {/* TODO 9: После каждого поля — статус Either
          Right → зелёный бейдж "Right"
          Left("msg") → красный бейдж */}

      {/* TODO 10: Railway diagram
          4 блока: validateName → validateEmail → validateAge → createUser
          - Зелёный если Right
          - Красный если Left (первая ошибка)
          - Серый если после первой ошибки (не выполнялся) */}

      {/* TODO 11: Финальный результат под диаграммой */}
    </div>
  )
}
