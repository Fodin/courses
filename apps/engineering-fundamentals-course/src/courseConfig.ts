import type { CourseConfig } from '@courses/platform'
import { exercises } from './exercises/exercisesConfig'
import { translations } from './translations'

export const courseConfig: CourseConfig = {
  courseId: 'engineering-fundamentals-course',
  title: 'Инженерные основы программирования',
  defaultLanguage: 'ru',
  defaultRoute: '/task/0.1',
  exercises,
  translations,
}
