import { Lab } from 'src/engine'

import { spec as spec31 } from './task-3.1.spec'
import { spec as spec32 } from './task-3.2.spec'
import { spec as spec33 } from './task-3.3.spec'
import { spec as spec34 } from './task-3.4.spec'
import { spec as spec35 } from './task-3.5.spec'
import { spec as spec36 } from './task-3.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task3_1_Solution() {
  return <Solution spec={spec31} />
}
export function Task3_2_Solution() {
  return <Solution spec={spec32} />
}
export function Task3_3_Solution() {
  return <Solution spec={spec33} />
}
export function Task3_4_Solution() {
  return <Solution spec={spec34} />
}
export function Task3_5_Solution() {
  return <Solution spec={spec35} />
}
export function Task3_6_Solution() {
  return <Solution spec={spec36} />
}
