import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-setup'
import * as Level1 from './01-jsx-ref'
import * as Level2 from './02-use-hook'
import * as Level3 from './03-actions'
import * as Level4 from './04-optimistic'
import * as Level5 from './05-transitions'
import * as Level6 from './06-server'
import * as Level7 from './07-metadata'
import * as Level8 from './08-migration'

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
    folder: '01-jsx-ref',
    navKey: 'nav.jsxRef',
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
    folder: '02-use-hook',
    navKey: 'nav.useHook',
    descKey: 'level.2.desc',
    tasks: [
      task('2.1', <Level2.Task2_1_Solution />),
      task('2.2', <Level2.Task2_2_Solution />),
      task('2.3', <Level2.Task2_3_Solution />),
      task('2.4', <Level2.Task2_4_Solution />),
    ],
  },
  {
    levelId: '3',
    folder: '03-actions',
    navKey: 'nav.actions',
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
    folder: '04-optimistic',
    navKey: 'nav.optimistic',
    descKey: 'level.4.desc',
    tasks: [
      task('4.1', <Level4.Task4_1_Solution />),
      task('4.2', <Level4.Task4_2_Solution />),
      task('4.3', <Level4.Task4_3_Solution />),
    ],
  },
  {
    levelId: '5',
    folder: '05-transitions',
    navKey: 'nav.transitions',
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
    folder: '06-server',
    navKey: 'nav.server',
    descKey: 'level.6.desc',
    tasks: [
      task('6.1', <Level6.Task6_1_Solution />),
      task('6.2', <Level6.Task6_2_Solution />),
      task('6.3', <Level6.Task6_3_Solution />),
    ],
  },
  {
    levelId: '7',
    folder: '07-metadata',
    navKey: 'nav.metadata',
    descKey: 'level.7.desc',
    tasks: [
      task('7.1', <Level7.Task7_1_Solution />),
      task('7.2', <Level7.Task7_2_Solution />),
      task('7.3', <Level7.Task7_3_Solution />),
    ],
  },
  {
    levelId: '8',
    folder: '08-migration',
    navKey: 'nav.migration',
    descKey: 'level.8.desc',
    tasks: [
      task('8.1', <Level8.Task8_1_Solution />),
      task('8.2', <Level8.Task8_2_Solution />),
      task('8.3', <Level8.Task8_3_Solution />),
    ],
  },
]
