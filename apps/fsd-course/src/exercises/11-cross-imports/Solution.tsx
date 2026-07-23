import { Lab } from 'src/engine'

import { spec as spec111 } from './task-11.1.spec'
import { spec as spec112 } from './task-11.2.spec'
import { spec as spec113 } from './task-11.3.spec'
import { spec as spec114 } from './task-11.4.spec'
import { spec as spec115 } from './task-11.5.spec'
import { spec as spec116 } from './task-11.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task11_1_Solution() {
  return <Solution spec={spec111} />
}
export function Task11_2_Solution() {
  return <Solution spec={spec112} />
}
export function Task11_3_Solution() {
  return <Solution spec={spec113} />
}
export function Task11_4_Solution() {
  return <Solution spec={spec114} />
}
export function Task11_5_Solution() {
  return <Solution spec={spec115} />
}
export function Task11_6_Solution() {
  return <Solution spec={spec116} />
}
