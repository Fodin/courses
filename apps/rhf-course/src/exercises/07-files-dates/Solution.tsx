import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// ============================================
// Задание 7.1: File Upload — Решение
// ============================================

const fileSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine(files => files.length > 0, 'Выберите файл')
    .refine(files => files[0]?.size < 2000000, 'Максимум 2MB')
    .refine(
      files => ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type),
      'Только JPG, PNG, GIF'
    ),
})

type FileForm = z.infer<typeof fileSchema>

export function Task7_1_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FileForm>({
    resolver: zodResolver(fileSchema),
  })

  const [preview, setPreview] = useState<string | null>(null)

  const onSubmit = (data: FileForm) => {
    console.log('File:', data.avatar[0])
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 7.1: File Upload</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Аватар *</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            {...register('avatar')}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                setPreview(URL.createObjectURL(file))
              }
            }}
          />
          {errors.avatar && <span className="error">{errors.avatar.message}</span>}
        </div>

        {preview && (
          <div style={{ marginTop: '1rem' }}>
            <img src={preview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
          </div>
        )}

        <button type="submit" style={{ marginTop: '1rem' }}>
          Загрузить
        </button>
      </form>
    </div>
  )
}

// ============================================
// Задание 7.2: Дата и время — Решение
// ============================================

const dateSchema = z.object({
  birthDate: z.string().min(1, 'Выберите дату'),
  appointment: z.string().min(1, 'Выберите время'),
})

type DateForm = z.infer<typeof dateSchema>

export function Task7_2_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DateForm>({
    resolver: zodResolver(dateSchema),
  })

  const onSubmit = (data: DateForm) => {
    console.log('Dates:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 7.2: Дата и время</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="birthDate">Дата рождения *</label>
          <input id="birthDate" type="date" {...register('birthDate')} />
          {errors.birthDate && <span className="error">{errors.birthDate.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="appointment">Запись на встречу *</label>
          <input id="appointment" type="datetime-local" {...register('appointment')} />
          {errors.appointment && <span className="error">{errors.appointment.message}</span>}
        </div>

        <button type="submit">Записаться</button>
      </form>
    </div>
  )
}
