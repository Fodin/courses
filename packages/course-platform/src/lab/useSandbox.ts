import { useCallback, useMemo } from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage'

import type { LabSpec } from './types'

/** Версия схемы localStorage — бампнуть при изменении стартовых деревьев. */
const VERSION = 'v2'

/**
 * Состояние песочницы: содержимое всех файлов + правки студента в localStorage.
 * Ключ версионируется, чтобы менять стартеры без конфликта со старым стейтом.
 */
export function useSandbox(spec: LabSpec) {
  const initial = useMemo(
    () => Object.fromEntries(spec.files.map(f => [f.path, f.content])),
    [spec]
  )

  const [files, setFiles] = useLocalStorage<Record<string, string>>(
    `fsd-lab:${VERSION}:${spec.id}`,
    initial
  )

  const setFile = useCallback(
    (path: string, content: string) => setFiles(prev => ({ ...prev, [path]: content })),
    [setFiles]
  )

  const reset = useCallback(() => setFiles(initial), [setFiles, initial])

  return { files, setFile, reset }
}
