import { Lab } from 'src/engine'

import { spec as spec91 } from './task-9.1.spec'
import { spec as spec92 } from './task-9.2.spec'
import { spec as spec93 } from './task-9.3.spec'
import { spec as spec94 } from './task-9.4.spec'
import { spec as spec95 } from './task-9.5.spec'
import { spec as spec96 } from './task-9.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task9_1_Solution() {
  return <Solution spec={spec91} />
}
export function Task9_2_Solution() {
  return <Solution spec={spec92} />
}
export function Task9_3_Solution() {
  return <Solution spec={spec93} />
}
export function Task9_4_Solution() {
  return <Solution spec={spec94} />
}
export function Task9_5_Solution() {
  return <Solution spec={spec95} />
}
export function Task9_6_Solution() {
  return <Solution spec={spec96} />
}
