import { Lab } from 'src/engine'

import { spec as spec41 } from './task-4.1.spec'
import { spec as spec42 } from './task-4.2.spec'
import { spec as spec43 } from './task-4.3.spec'
import { spec as spec44 } from './task-4.4.spec'
import { spec as spec45 } from './task-4.5.spec'
import { spec as spec46 } from './task-4.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task4_1_Solution() {
  return <Solution spec={spec41} />
}
export function Task4_2_Solution() {
  return <Solution spec={spec42} />
}
export function Task4_3_Solution() {
  return <Solution spec={spec43} />
}
export function Task4_4_Solution() {
  return <Solution spec={spec44} />
}
export function Task4_5_Solution() {
  return <Solution spec={spec45} />
}
export function Task4_6_Solution() {
  return <Solution spec={spec46} />
}
