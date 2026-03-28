import { useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.1: Focus management
// Task 10.1: Focus Management
// ============================================

// TODO: Определите интерфейс LoginForm
// TODO: Define LoginForm interface

// TODO: Инициализируйте useForm<LoginForm>
// TODO: Initialize useForm<LoginForm>

// TODO: Создайте refs для полей
// TODO: Create refs for fields

// TODO: Используйте useEffect для фокуса на первом ошибочном поле
// TODO: Use useEffect to focus on first error field

// TODO: Создайте функцию onSubmit
// TODO: Create onSubmit function

export function Task10_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      {/* TODO: Создайте форму ниже */}
      {/* TODO: Create form below */}
    </div>
  )
}
