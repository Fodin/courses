import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { CoursePlatform } from '@courses/platform'

import { courseConfig } from './courseConfig'

import '@courses/platform/src/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoursePlatform config={courseConfig} />
  </StrictMode>
)
