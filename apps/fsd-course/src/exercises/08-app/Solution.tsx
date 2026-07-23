import { Lab } from 'src/engine'

import { spec as spec81 } from './task-8.1.spec'
import { spec as spec82 } from './task-8.2.spec'
import { spec as spec83 } from './task-8.3.spec'
import { spec as spec84 } from './task-8.4.spec'
import { spec as spec85 } from './task-8.5.spec'
import { spec as spec86 } from './task-8.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task8_1_Solution() {
  return <Solution spec={spec81} />
}
export function Task8_2_Solution() {
  return <Solution spec={spec82} />
}
export function Task8_3_Solution() {
  return <Solution spec={spec83} />
}
export function Task8_4_Solution() {
  return <Solution spec={spec84} />
}
export function Task8_5_Solution() {
  return <Solution spec={spec85} />
}
export function Task8_6_Solution() {
  return <Solution spec={spec86} />
}
