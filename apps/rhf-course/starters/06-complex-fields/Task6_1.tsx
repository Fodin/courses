import { Controller, useForm } from 'react-hook-form'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.1: Controller
// Task 6.1: Controller
// ============================================

// TODO: Определите интерфейс CountryForm
// TODO: Define CountryForm interface

// TODO: Создайте кастомный компонент Select
// TODO: Create custom Select component

// TODO: Инициализируйте useForm<CountryForm>
// TODO: Initialize useForm<CountryForm>

// TODO: Создайте функцию onSubmit
// TODO: Create onSubmit function

export function Task6_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      {/* TODO: Создайте форму ниже */}
      {/* TODO: Create form below */}
    </div>
  )
}
