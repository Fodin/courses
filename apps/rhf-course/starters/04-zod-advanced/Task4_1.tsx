import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: refine и сообщения
// Task 4.1: refine and Messages
// ============================================

// TODO: Создайте схему Zod с .refine() для cross-field валидации
// TODO: Create Zod schema with .refine() for cross-field validation

// TODO: Выведите тип FormData из схемы
// TODO: Derive FormData type from schema

// TODO: Инициализируйте useForm с zodResolver
// TODO: Initialize useForm with zodResolver

// TODO: Создайте функцию onSubmit
// TODO: Create onSubmit function

export function Task4_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>

      {/* TODO: Создайте форму ниже */}
      {/* TODO: Create form below */}
    </div>
  )
}
