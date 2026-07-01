import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.1: Submit loading
// Task 13.1: Submit Loading
// ============================================

// TODO: Определите интерфейс ContactForm
// TODO: Define ContactForm interface

// TODO: Инициализируйте useForm<ContactForm>
// TODO: Initialize useForm<ContactForm>

// TODO: Создайте состояния для error и success
// TODO: Create error and success states

// TODO: Создайте функцию onSubmit
// TODO: Create onSubmit function

export function Task13_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>

      {/* TODO: Создайте форму ниже */}
      {/* TODO: Create form below */}
    </div>
  )
}
