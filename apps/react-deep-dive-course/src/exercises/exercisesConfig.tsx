import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-setup'
import * as Level1 from './01-fiber-tree'
import * as Level2 from './02-work-loop'
import * as Level3 from './03-reconciliation'
import * as Level4 from './04-hooks-internals'
import * as Level5 from './05-useeffect-lifecycle'
import * as Level6 from './06-usememo-usecallback'
import * as Level7 from './07-external-stores'
import * as Level8 from './08-custom-hooks'
import * as Level9 from './09-batching'
import * as Level10 from './10-concurrent'
import * as Level11 from './11-server-components'
import * as Level12 from './12-react-compiler'
import * as Level13 from './13-patterns-performance'
import * as Level14 from './14-recap'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-setup',
    navKey: 'nav.setup',
    descKey: 'level.0.desc',
    tasks: [
      task('0.1', <Level0.Task0_1_Solution />),
      task('0.2', <Level0.Task0_2_Solution />),
      task('0.3', <Level0.Task0_3_Solution />),
    ],
  },
  {
    levelId: '1',
    folder: '01-fiber-tree',
    navKey: 'nav.fiberTree',
    descKey: 'level.1.desc',
    tasks: [
      task('1.1', <Level1.Task1_1_Solution />),
      task('1.2', <Level1.Task1_2_Solution />),
      task('1.3', <Level1.Task1_3_Solution />),
      task('1.4', <Level1.Task1_4_Solution />),
    ],
  },
  {
    levelId: '2',
    folder: '02-work-loop',
    navKey: 'nav.workLoop',
    descKey: 'level.2.desc',
    tasks: [
      task('2.1', <Level2.Task2_1_Solution />),
      task('2.2', <Level2.Task2_2_Solution />),
      task('2.3', <Level2.Task2_3_Solution />),
    ],
  },
  {
    levelId: '3',
    folder: '03-reconciliation',
    navKey: 'nav.reconciliation',
    descKey: 'level.3.desc',
    tasks: [
      task('3.1', <Level3.Task3_1_Solution />),
      task('3.2', <Level3.Task3_2_Solution />),
      task('3.3', <Level3.Task3_3_Solution />),
      task('3.4', <Level3.Task3_4_Solution />),
    ],
  },
  {
    levelId: '4',
    folder: '04-hooks-internals',
    navKey: 'nav.hooksInternals',
    descKey: 'level.4.desc',
    tasks: [
      task('4.1', <Level4.Task4_1_Solution />),
      task('4.2', <Level4.Task4_2_Solution />),
      task('4.3', <Level4.Task4_3_Solution />),
      task('4.4', <Level4.Task4_4_Solution />),
    ],
  },
  {
    levelId: '5',
    folder: '05-useeffect-lifecycle',
    navKey: 'nav.useeffectLifecycle',
    descKey: 'level.5.desc',
    tasks: [
      task('5.1', <Level5.Task5_1_Solution />),
      task('5.2', <Level5.Task5_2_Solution />),
      task('5.3', <Level5.Task5_3_Solution />),
      task('5.4', <Level5.Task5_4_Solution />),
    ],
  },
  {
    levelId: '6',
    folder: '06-usememo-usecallback',
    navKey: 'nav.usememoUsecallback',
    descKey: 'level.6.desc',
    tasks: [
      task('6.1', <Level6.Task6_1_Solution />),
      task('6.2', <Level6.Task6_2_Solution />),
      task('6.3', <Level6.Task6_3_Solution />),
    ],
  },
  {
    levelId: '7',
    folder: '07-external-stores',
    navKey: 'nav.externalStores',
    descKey: 'level.7.desc',
    tasks: [
      task('7.1', <Level7.Task7_1_Solution />),
      task('7.2', <Level7.Task7_2_Solution />),
      task('7.3', <Level7.Task7_3_Solution />),
    ],
  },
  {
    levelId: '8',
    folder: '08-custom-hooks',
    navKey: 'nav.customHooks',
    descKey: 'level.8.desc',
    tasks: [
      task('8.1', <Level8.Task8_1_Solution />),
      task('8.2', <Level8.Task8_2_Solution />),
      task('8.3', <Level8.Task8_3_Solution />),
      task('8.4', <Level8.Task8_4_Solution />),
    ],
  },
  {
    levelId: '9',
    folder: '09-batching',
    navKey: 'nav.batching',
    descKey: 'level.9.desc',
    tasks: [
      task('9.1', <Level9.Task9_1_Solution />),
      task('9.2', <Level9.Task9_2_Solution />),
      task('9.3', <Level9.Task9_3_Solution />),
    ],
  },
  {
    levelId: '10',
    folder: '10-concurrent',
    navKey: 'nav.concurrent',
    descKey: 'level.10.desc',
    tasks: [
      task('10.1', <Level10.Task10_1_Solution />),
      task('10.2', <Level10.Task10_2_Solution />),
      task('10.3', <Level10.Task10_3_Solution />),
      task('10.4', <Level10.Task10_4_Solution />),
    ],
  },
  {
    levelId: '11',
    folder: '11-server-components',
    navKey: 'nav.serverComponents',
    descKey: 'level.11.desc',
    tasks: [
      task('11.1', <Level11.Task11_1_Solution />),
      task('11.2', <Level11.Task11_2_Solution />),
      task('11.3', <Level11.Task11_3_Solution />),
    ],
  },
  {
    levelId: '12',
    folder: '12-react-compiler',
    navKey: 'nav.reactCompiler',
    descKey: 'level.12.desc',
    tasks: [
      task('12.1', <Level12.Task12_1_Solution />),
      task('12.2', <Level12.Task12_2_Solution />),
      task('12.3', <Level12.Task12_3_Solution />),
    ],
  },
  {
    levelId: '13',
    folder: '13-patterns-performance',
    navKey: 'nav.patternsPerformance',
    descKey: 'level.13.desc',
    tasks: [
      task('13.1', <Level13.Task13_1_Solution />),
      task('13.2', <Level13.Task13_2_Solution />),
      task('13.3', <Level13.Task13_3_Solution />),
    ],
  },
  {
    levelId: '14',
    folder: '14-recap',
    navKey: 'nav.recap',
    descKey: 'level.14.desc',
    tasks: [
      task('14.1', <Level14.Task14_1_Solution />),
      task('14.2', <Level14.Task14_2_Solution />),
      task('14.3', <Level14.Task14_3_Solution />),
    ],
  },
]
