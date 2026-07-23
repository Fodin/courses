import { Lab } from 'src/engine'

import { spec as spec8_1 } from './task-8.1.spec'
import { spec as spec8_2 } from './task-8.2.spec'
import { spec as spec8_3 } from './task-8.3.spec'
import { spec as spec8_4 } from './task-8.4.spec'
import { spec as spec8_5 } from './task-8.5.spec'
import { spec as spec8_6 } from './task-8.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task8_1_Solution() {
  return <Solution spec={spec8_1} />
}

export function Task8_2_Solution() {
  return <Solution spec={spec8_2} />
}

export function Task8_3_Solution() {
  return <Solution spec={spec8_3} />
}

export function Task8_4_Solution() {
  return <Solution spec={spec8_4} />
}

export function Task8_5_Solution() {
  return <Solution spec={spec8_5} />
}

export function Task8_6_Solution() {
  return <Solution spec={spec8_6} />
}
