import { Lab } from 'src/engine'

import { spec as spec121 } from './task-12.1.spec'
import { spec as spec122 } from './task-12.2.spec'
import { spec as spec123 } from './task-12.3.spec'
import { spec as spec124 } from './task-12.4.spec'
import { spec as spec125 } from './task-12.5.spec'
import { spec as spec126 } from './task-12.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task12_1_Solution() {
  return <Solution spec={spec121} />
}
export function Task12_2_Solution() {
  return <Solution spec={spec122} />
}
export function Task12_3_Solution() {
  return <Solution spec={spec123} />
}
export function Task12_4_Solution() {
  return <Solution spec={spec124} />
}
export function Task12_5_Solution() {
  return <Solution spec={spec125} />
}
export function Task12_6_Solution() {
  return <Solution spec={spec126} />
}
