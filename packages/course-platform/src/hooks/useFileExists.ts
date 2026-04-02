import { useEffect, useState, useRef } from 'react'

import { useLanguage } from './useLanguage'

const cache = new Map<string, boolean>()

function isMarkdownResponse(response: Response): boolean {
  if (!response.ok) return false
  const contentType = response.headers.get('content-type') || ''
  // Vite SPA fallback возвращает text/html для несуществующих файлов
  return !contentType.includes('text/html')
}

/**
 * Проверяет существование markdown-файла (с учётом языка).
 * Отличает реальный файл от Vite SPA fallback по Content-Type.
 */
export function useFileExists(path: string): { exists: boolean; loading: boolean } {
  const { language } = useLanguage()
  const [exists, setExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    if (!path) {
      setExists(false)
      setLoading(false)
      return
    }

    const localizedPath = language === 'en' ? path.replace('.md', '.en.md') : path
    const cacheKey = localizedPath

    if (cache.has(cacheKey)) {
      setExists(cache.get(cacheKey)!)
      setLoading(false)
      return
    }

    setLoading(true)

    fetch(localizedPath, { method: 'HEAD' })
      .then(response => {
        const result = isMarkdownResponse(response)
        cache.set(cacheKey, result)

        if (mountedRef.current) {
          setExists(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mountedRef.current) {
          setExists(false)
          setLoading(false)
        }
      })

    return () => {
      mountedRef.current = false
    }
  }, [path, language])

  return { exists, loading }
}
