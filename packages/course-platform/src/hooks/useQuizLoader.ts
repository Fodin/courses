import { useEffect, useState } from 'react'

import { useLanguage } from './useLanguage'
import type { QuizQuestion } from '../types'

/**
 * Хук для загрузки quiz JSON файлов с поддержкой локализации
 */
export function useQuizLoader(path: string) {
  const { language } = useLanguage()
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadQuiz = async () => {
      try {
        setLoading(true)
        setError(null)

        const localizedPath =
          language === 'en' ? path.replace('.json', '.en.json') : path

        const response = await fetch(localizedPath)

        if (!response.ok) {
          if (language === 'en') {
            const fallbackResponse = await fetch(path)
            if (fallbackResponse.ok) {
              const data = await fallbackResponse.json()
              if (mounted) {
                setQuestions(data)
                setError(null)
              }
              setLoading(false)
              return
            }
          }
          throw new Error(`Failed to load quiz: ${response.status}`)
        }

        const data = await response.json()

        if (mounted) {
          setQuestions(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setQuestions(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadQuiz()

    return () => {
      mounted = false
    }
  }, [path, language])

  return { questions, loading, error }
}
