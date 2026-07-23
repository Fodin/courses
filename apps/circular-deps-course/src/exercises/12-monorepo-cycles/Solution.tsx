import { Lab } from 'src/engine'

import { spec as spec12_1 } from './task-12.1.spec'
import { spec as spec12_2 } from './task-12.2.spec'
import { spec as spec12_3 } from './task-12.3.spec'
import { spec as spec12_4 } from './task-12.4.spec'
import { spec as spec12_5 } from './task-12.5.spec'
import { spec as spec12_6 } from './task-12.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task12_1_Solution() {
  return <Solution spec={spec12_1} />
}
export function Task12_2_Solution() {
  return <Solution spec={spec12_2} />
}
export function Task12_3_Solution() {
  return <Solution spec={spec12_3} />
}
export function Task12_4_Solution() {
  return <Solution spec={spec12_4} />
}
export function Task12_5_Solution() {
  return <Solution spec={spec12_5} />
}
export function Task12_6_Solution() {
  return <Solution spec={spec12_6} />
}
