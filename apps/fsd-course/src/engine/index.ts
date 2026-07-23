// Движок многофайловых заданий живёт в платформе (`@courses/platform/src/lab`).
// Этот файл — тонкий реэкспорт, чтобы весь контент курса импортировал его как
// `from 'src/engine'`. Исторические имена (FsdLab/FsdTaskSpec) сохранены как
// локальные алиасы, чтобы не переписывать существующие задания курса.
export * from '@courses/platform/src/lab'
export { Lab as FsdLab } from '@courses/platform/src/lab'
export type { LabSpec as FsdTaskSpec } from '@courses/platform/src/lab'
