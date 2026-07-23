import { Lab } from 'src/engine'

import { spec as spec21 } from './task-2.1.spec'
import { spec as spec22 } from './task-2.2.spec'
import { spec as spec23 } from './task-2.3.spec'
import { spec as spec24 } from './task-2.4.spec'
import { spec as spec25 } from './task-2.5.spec'
import { spec as spec26 } from './task-2.6.spec'

function Solution({ spec }: { spec: Parameters<typeof Lab>[0]['spec'] }) {
  return (
    <div className="exercise-container">
      <Lab spec={spec} showReference />
    </div>
  )
}

export function Task2_1_Solution() {
  return <Solution spec={spec21} />
}
export function Task2_2_Solution() {
  return <Solution spec={spec22} />
}
export function Task2_3_Solution() {
  return <Solution spec={spec23} />
}
export function Task2_4_Solution() {
  return <Solution spec={spec24} />
}
export function Task2_5_Solution() {
  return <Solution spec={spec25} />
}
export function Task2_6_Solution() {
  return <Solution spec={spec26} />
}
