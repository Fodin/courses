import type { CourseConfig } from '@courses/platform'

import { exercises } from './exercises/exercisesConfig'
import { translations } from './translations'

export const courseConfig: CourseConfig = {
  courseId: 'fsd-course',
  title: 'Feature-Sliced Design',
  defaultLanguage: 'ru',
  defaultRoute: '/task/0.1',
  exercises,
  translations,
}
