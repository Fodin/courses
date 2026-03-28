import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.1: Performance
// Task 11.1: Performance
// ============================================

// TODO: Определите интерфейс PerformanceForm
// TODO: Define PerformanceForm interface

// TODO: Инициализируйте useForm<PerformanceForm>
// TODO: Initialize useForm<PerformanceForm>

// TODO: Получите значения через watch
// TODO: Get values via watch

// TODO: Считайте рендеры
// TODO: Count renders

// TODO: Используйте useMemo для оптимизации
// TODO: Use useMemo for optimization

export function Task11_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      {/* TODO: Создайте форму ниже */}
      {/* TODO: Create form below */}
    </div>
  )
}
