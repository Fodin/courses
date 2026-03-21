import type { ReactElement } from 'react'

import { TaskStub } from './components/TaskStub'
import type { TaskEntry } from './types'

export function task(id: string, solution: ReactElement): TaskEntry {
  return { id, component: <TaskStub id={id} />, solution }
}
