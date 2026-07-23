import { Lab } from 'src/engine'

import { spec as spec71 } from './task-7.1.spec'
import { spec as spec72 } from './task-7.2.spec'
import { spec as spec73 } from './task-7.3.spec'
import { spec as spec74 } from './task-7.4.spec'
import { spec as spec75 } from './task-7.5.spec'
import { spec as spec76 } from './task-7.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task7_1_Solution() {
  return <Solution spec={spec71} />
}
export function Task7_2_Solution() {
  return <Solution spec={spec72} />
}
export function Task7_3_Solution() {
  return <Solution spec={spec73} />
}
export function Task7_4_Solution() {
  return <Solution spec={spec74} />
}
export function Task7_5_Solution() {
  return <Solution spec={spec75} />
}
export function Task7_6_Solution() {
  return <Solution spec={spec76} />
}
