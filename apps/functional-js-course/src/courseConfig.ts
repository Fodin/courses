import type { CourseConfig } from '@courses/platform'
import { exercises } from './exercises/exercisesConfig'
import { translations } from './translations'

export const courseConfig: CourseConfig = {
  courseId: 'functional-js-course',
  title: 'Функциональное программирование в JS/TS',
  defaultLanguage: 'ru',
  defaultRoute: '/task/0.1',
  exercises,
  translations,
}
