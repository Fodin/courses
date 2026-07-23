import { Lab } from 'src/engine'

import { spec as spec61 } from './task-6.1.spec'
import { spec as spec62 } from './task-6.2.spec'
import { spec as spec63 } from './task-6.3.spec'
import { spec as spec64 } from './task-6.4.spec'
import { spec as spec65 } from './task-6.5.spec'
import { spec as spec66 } from './task-6.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task6_1_Solution() {
  return <Solution spec={spec61} />
}
export function Task6_2_Solution() {
  return <Solution spec={spec62} />
}
export function Task6_3_Solution() {
  return <Solution spec={spec63} />
}
export function Task6_4_Solution() {
  return <Solution spec={spec64} />
}
export function Task6_5_Solution() {
  return <Solution spec={spec65} />
}
export function Task6_6_Solution() {
  return <Solution spec={spec66} />
}
