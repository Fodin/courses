import { Lab } from 'src/engine'

import { spec as spec51 } from './task-5.1.spec'
import { spec as spec52 } from './task-5.2.spec'
import { spec as spec53 } from './task-5.3.spec'
import { spec as spec54 } from './task-5.4.spec'
import { spec as spec55 } from './task-5.5.spec'
import { spec as spec56 } from './task-5.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task5_1_Solution() {
  return <Solution spec={spec51} />
}
export function Task5_2_Solution() {
  return <Solution spec={spec52} />
}
export function Task5_3_Solution() {
  return <Solution spec={spec53} />
}
export function Task5_4_Solution() {
  return <Solution spec={spec54} />
}
export function Task5_5_Solution() {
  return <Solution spec={spec55} />
}
export function Task5_6_Solution() {
  return <Solution spec={spec56} />
}
