// Безголовый вход в движок для валидаторов: только чистая логика проверок,
// без React/CodeMirror (Lab/SolutionView в граф не попадают). Движок живёт в
// платформе — импортируем vfs+checks напрямую.
export { createVirtualFs } from '../../../packages/course-platform/src/lab/vfs'
export * from '../../../packages/course-platform/src/lab/checks'
export type {
  LabSpec,
  VirtualFile,
  VirtualFs,
  Check,
  CheckResult,
  ImportEdge,
  FsdLayer,
  FileRole,
  FileLanguage,
} from '../../../packages/course-platform/src/lab/types'
