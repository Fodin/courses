import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.3: Иерархия ошибок
// Task 1.3: Error Hierarchy
// ============================================

// TODO: Создайте AppError extends Error с полями code и timestamp
// TODO: Create AppError extends Error with code and timestamp fields

// TODO: Создайте DatabaseError extends AppError с полем query
// TODO: Create DatabaseError extends AppError with query field

// TODO: Создайте NetworkError extends AppError с полями url и status
// TODO: Create NetworkError extends AppError with url and status fields

// TODO: Создайте AuthError extends AppError
// TODO: Create AuthError extends AppError

export function Task1_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* TODO: Демонстрация иерархии с instanceof проверками */}
      {/* TODO: Hierarchy demonstration with instanceof checks */}
    </div>
  )
}
