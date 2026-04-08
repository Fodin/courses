import type { CourseConfig } from '@courses/platform'

import { exercises } from './exercises/exercisesConfig'
import { translations } from './translations'

export const courseConfig: CourseConfig = {
  courseId: 'kafka-rabbitmq-course',
  title: 'Микросервисы, Kafka и RabbitMQ',
  defaultLanguage: 'ru',
  defaultRoute: '/task/0.1',
  exercises,
  translations,
}
