import { Lab } from 'src/engine'

import { spec as spec141 } from './task-14.1.spec'
import { spec as spec142 } from './task-14.2.spec'
import { spec as spec143 } from './task-14.3.spec'
import { spec as spec144 } from './task-14.4.spec'
import { spec as spec145 } from './task-14.5.spec'
import { spec as spec146 } from './task-14.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task14_1_Solution() {
  return <Solution spec={spec141} />
}
export function Task14_2_Solution() {
  return <Solution spec={spec142} />
}
export function Task14_3_Solution() {
  return <Solution spec={spec143} />
}
export function Task14_4_Solution() {
  return <Solution spec={spec144} />
}
export function Task14_5_Solution() {
  return <Solution spec={spec145} />
}
export function Task14_6_Solution() {
  return <Solution spec={spec146} />
}
