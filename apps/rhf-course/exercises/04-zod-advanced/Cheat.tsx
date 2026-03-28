import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ============================================
// Задание 4.1: refine и кастомные сообщения — Решение
// ============================================

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Обязательно'),
    newPassword: z
      .string()
      .min(8, 'Минимум 8 символов')
      .regex(/[A-Z]/, 'Должна быть заглавная буква')
      .regex(/\d/, 'Должна быть цифра'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })
  .refine(data => data.newPassword !== data.currentPassword, {
    message: 'Новый пароль должен отличаться от текущего',
    path: ['newPassword'],
  })

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>

export function Task4_1_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  })

  const onSubmit = (data: PasswordChangeForm) => {
    console.log('Change password:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 4.1: refine и кастомные сообщения</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="currentPassword">Текущий пароль *</label>
          <input id="currentPassword" type="password" {...register('currentPassword')} />
          {errors.currentPassword && (
            <span className="error">{errors.currentPassword.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">Новый пароль *</label>
          <input id="newPassword" type="password" {...register('newPassword')} />
          {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля *</label>
          <input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <button type="submit">Сменить пароль</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 4.2: superRefine и discriminatedUnion — Решение
// ============================================

const paymentSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('card'),
    cardNumber: z
      .string()
      .min(1, 'Обязательно')
      .regex(/^\d{16}$/, 'Номер карты: 16 цифр'),
    expiry: z
      .string()
      .min(1, 'Обязательно')
      .regex(/^\d{2}\/\d{2}$/, 'Формат: MM/YY'),
    cvv: z
      .string()
      .min(1, 'Обязательно')
      .regex(/^\d{3}$/, 'CVV: 3 цифры'),
  }),
  z.object({
    method: z.literal('bank'),
    accountNumber: z.string().min(1, 'Обязательно').min(20, 'Минимум 20 символов'),
    bankName: z.string().min(1, 'Обязательно'),
  }),
  z.object({
    method: z.literal('crypto'),
    walletAddress: z.string().min(1, 'Обязательно').min(26, 'Минимум 26 символов'),
    network: z.enum(['ethereum', 'bitcoin', 'solana'], {
      errorMap: () => ({ message: 'Выберите сеть' }),
    }),
  }),
])

const orderSchema = z
  .object({
    amount: z.number().min(1, 'Минимум 1'),
    payment: paymentSchema,
  })
  .superRefine((data, ctx) => {
    if (data.payment.method === 'crypto' && data.amount < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Минимальная сумма для крипто — 10',
        path: ['amount'],
      })
    }
    if (data.payment.method === 'card' && data.amount > 100000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Максимум для карты — 100 000',
        path: ['amount'],
      })
    }
  })

type OrderForm = z.infer<typeof orderSchema>

export function Task4_2_Solution() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      amount: 0,
      payment: { method: 'card', cardNumber: '', expiry: '', cvv: '' },
    },
  })

  const method = watch('payment.method')

  const onSubmit = (data: OrderForm) => {
    console.log('Order:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 4.2: superRefine и discriminatedUnion</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '450px' }}>
        <div className="form-group">
          <label>Сумма *</label>
          <input type="number" {...register('amount', { valueAsNumber: true })} />
          {errors.amount && <span className="error">{errors.amount.message}</span>}
        </div>

        <div className="form-group">
          <label>Способ оплаты *</label>
          <select {...register('payment.method')}>
            <option value="card">Карта</option>
            <option value="bank">Банковский перевод</option>
            <option value="crypto">Криптовалюта</option>
          </select>
        </div>

        {method === 'card' && (
          <>
            <div className="form-group">
              <label>Номер карты *</label>
              <input {...register('payment.cardNumber')} placeholder="1234567890123456" />
              {errors.payment && 'cardNumber' in errors.payment && (
                <span className="error">{(errors.payment as any).cardNumber?.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Срок действия *</label>
              <input {...register('payment.expiry')} placeholder="MM/YY" />
              {errors.payment && 'expiry' in errors.payment && (
                <span className="error">{(errors.payment as any).expiry?.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>CVV *</label>
              <input {...register('payment.cvv')} placeholder="123" />
              {errors.payment && 'cvv' in errors.payment && (
                <span className="error">{(errors.payment as any).cvv?.message}</span>
              )}
            </div>
          </>
        )}

        {method === 'bank' && (
          <>
            <div className="form-group">
              <label>Номер счёта *</label>
              <input {...register('payment.accountNumber')} />
              {errors.payment && 'accountNumber' in errors.payment && (
                <span className="error">{(errors.payment as any).accountNumber?.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Название банка *</label>
              <input {...register('payment.bankName')} />
              {errors.payment && 'bankName' in errors.payment && (
                <span className="error">{(errors.payment as any).bankName?.message}</span>
              )}
            </div>
          </>
        )}

        {method === 'crypto' && (
          <>
            <div className="form-group">
              <label>Адрес кошелька *</label>
              <input {...register('payment.walletAddress')} />
              {errors.payment && 'walletAddress' in errors.payment && (
                <span className="error">{(errors.payment as any).walletAddress?.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Сеть *</label>
              <select {...register('payment.network')}>
                <option value="">Выберите...</option>
                <option value="ethereum">Ethereum</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="solana">Solana</option>
              </select>
              {errors.payment && 'network' in errors.payment && (
                <span className="error">{(errors.payment as any).network?.message}</span>
              )}
            </div>
          </>
        )}

        <button type="submit">Оплатить</button>
      </form>
    </div>
  )
}
