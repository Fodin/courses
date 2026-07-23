import {
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 4.5 (среднее) — Две сущности ссылаются друг на друга.
 *
 * `entities/room` хранит текущую бронь целым объектом `Booking`, а `entities/booking`
 * хранит номер целым объектом `Room` — взаимный cross-import одного слоя. Задача:
 * развязать обе связи по идентификаторам: `currentBookingId` и `roomId`.
 */

const roomIndex = `export type { Room } from './model/types'
`
const bookingIndex = `export type { Booking } from './model/types'
`

// НАРУШЕНИЕ: room хранит объект Booking целиком.
const roomTypesStart = `import type { Booking } from '@/entities/booking'

export interface Room {
  id: string
  number: number
  currentBooking: Booking | null
}
`
const roomTypesSolution = `export interface Room {
  id: string
  number: number
  currentBookingId: string | null
}
`

// НАРУШЕНИЕ: booking хранит объект Room целиком.
const bookingTypesStart = `import type { Room } from '@/entities/room'

export interface Booking {
  id: string
  guestName: string
  room: Room
}
`
const bookingTypesSolution = `export interface Booking {
  id: string
  guestName: string
  roomId: string
}
`

const roFiles = [
  { path: 'src/entities/room/index.ts', content: roomIndex, role: 'readonly' as const },
  { path: 'src/entities/booking/index.ts', content: bookingIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '4.5',
  title: 'Задание 4.5 — Взаимные ссылки сущностей (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/room/model/types.ts', content: roomTypesStart, role: 'editable' },
    { path: 'src/entities/booking/model/types.ts', content: bookingTypesStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/room/model/types.ts', content: roomTypesSolution, role: 'editable' },
    { path: 'src/entities/booking/model/types.ts', content: bookingTypesSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/entities/room/model/types.ts',
      /currentBookingId\s*:/,
      'Room ссылается на бронь по идентификатору `currentBookingId`, а не объектом'
    ),
    fileContains(
      'src/entities/booking/model/types.ts',
      /roomId\s*:/,
      'Booking ссылается на номер по идентификатору `roomId`, а не объектом'
    ),
  ],
}
