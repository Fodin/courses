import { Lab } from 'src/engine'

import { spec as spec10_1 } from './task-10.1.spec'
import { spec as spec10_2 } from './task-10.2.spec'
import { spec as spec10_3 } from './task-10.3.spec'
import { spec as spec10_4 } from './task-10.4.spec'
import { spec as spec10_5 } from './task-10.5.spec'
import { spec as spec10_6 } from './task-10.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task10_1_Solution() {
  return <Solution spec={spec10_1} />
}

export function Task10_2_Solution() {
  return <Solution spec={spec10_2} />
}

export function Task10_3_Solution() {
  return <Solution spec={spec10_3} />
}

export function Task10_4_Solution() {
  return <Solution spec={spec10_4} />
}

export function Task10_5_Solution() {
  return <Solution spec={spec10_5} />
}

export function Task10_6_Solution() {
  return <Solution spec={spec10_6} />
}
