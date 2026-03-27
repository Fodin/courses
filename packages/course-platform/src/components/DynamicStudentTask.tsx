import { useState, useEffect, useRef, type ComponentType } from 'react'

import { TaskStub } from './TaskStub'

interface Props {
  folder: string
  taskId: string
}

/**
 * Динамически загружает студенческий компонент из exercises/{folder}/Task{N}_{M}.tsx.
 * Использует алиас `exercises` из vite.config каждого курса.
 * Поддерживает HMR — при сохранении файла компонент автоматически обновляется.
 */
export function DynamicStudentTask({ folder, taskId }: Props) {
  const [Component, setComponent] = useState<ComponentType | null>(null)
  const [failed, setFailed] = useState(false)
  const mountedRef = useRef(true)

  const fileName = `Task${taskId.replace('.', '_')}`

  useEffect(() => {
    mountedRef.current = true
    setComponent(null)
    setFailed(false)

    loadModule(folder, fileName)
      .then((comp) => {
        if (!mountedRef.current) return
        if (comp) {
          setComponent(() => comp)
        } else {
          setFailed(true)
        }
      })
      .catch(() => {
        if (mountedRef.current) setFailed(true)
      })

    return () => {
      mountedRef.current = false
    }
  }, [folder, fileName])

  // HMR: при любом обновлении модулей перезагружаем студенческий компонент
  useEffect(() => {
    if (!import.meta.hot) return

    const reload = () => {
      loadModule(folder, fileName)
        .then((comp) => {
          if (comp) {
            setComponent(() => comp)
            setFailed(false)
          }
        })
        .catch(() => {})
    }

    import.meta.hot.on('vite:afterUpdate', reload)
    return () => {
      import.meta.hot?.off('vite:afterUpdate', reload)
    }
  }, [folder, fileName])

  if (failed || !Component) {
    return <TaskStub id={taskId} />
  }

  return <Component />
}

async function loadModule(folder: string, fileName: string): Promise<ComponentType | null> {
  // Используем абсолютный URL-путь /exercises/... — Vite dev server
  // резолвит алиас exercises и отдаёт трансформированный модуль.
  // В продакшн-билде этот import не сработает (файл не бандлится),
  // и мы корректно покажем TaskStub через catch.
  const mod = await import(/* @vite-ignore */ `/exercises/${folder}/${fileName}.tsx`)
  return mod[fileName] || mod.default || null
}
