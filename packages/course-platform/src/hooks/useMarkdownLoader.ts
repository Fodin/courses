import { useEffect, useState } from 'react'

import { useLanguage } from './useLanguage'

interface UseMarkdownLoaderOptions {
  fallback?: string
}

/**
 * Хук для загрузки markdown файлов с поддержкой локализации
 */
export function useMarkdownLoader(path: string, options: UseMarkdownLoaderOptions = {}) {
  const { fallback = '' } = options
  const { language } = useLanguage()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadMarkdown = async () => {
      try {
        setLoading(true)
        setError(null)

        // Добавляем .en.md для английского языка
        const localizedPath = language === 'en' ? path.replace('.md', '.en.md') : path

        const response = await fetch(localizedPath)
        const contentType = response.headers.get('content-type') || ''
        const isHtmlFallback = contentType.includes('text/html')

        if (!response.ok || isHtmlFallback) {
          // Если английская версия не найдена, пробуем русскую
          if (language === 'en') {
            const fallbackResponse = await fetch(path)
            const fallbackCt = fallbackResponse.headers.get('content-type') || ''
            if (fallbackResponse.ok && !fallbackCt.includes('text/html')) {
              const text = await fallbackResponse.text()
              if (mounted) {
                setContent(text)
                setError(null)
              }
              setLoading(false)
              return
            }
          }
          throw new Error(`Failed to load markdown: ${response.status}`)
        }

        const text = await response.text()

        if (mounted) {
          setContent(text)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setContent(fallback)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadMarkdown()

    return () => {
      mounted = false
    }
  }, [path, language, fallback])

  return { content, loading, error }
}
