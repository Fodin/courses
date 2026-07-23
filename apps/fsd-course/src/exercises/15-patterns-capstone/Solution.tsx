import { Lab } from 'src/engine'

import { spec as spec151 } from './task-15.1.spec'
import { spec as spec152 } from './task-15.2.spec'
import { spec as spec153 } from './task-15.3.spec'
import { spec as spec154 } from './task-15.4.spec'
import { spec as spec155 } from './task-15.5.spec'
import { spec as spec156 } from './task-15.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task15_1_Solution() {
  return <Solution spec={spec151} />
}
export function Task15_2_Solution() {
  return <Solution spec={spec152} />
}
export function Task15_3_Solution() {
  return <Solution spec={spec153} />
}
export function Task15_4_Solution() {
  return <Solution spec={spec154} />
}
export function Task15_5_Solution() {
  return <Solution spec={spec155} />
}
export function Task15_6_Solution() {
  return <Solution spec={spec156} />
}
