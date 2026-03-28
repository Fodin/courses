import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-basics'
import * as Level1 from './01-error-types'
import * as Level2 from './02-promise-errors'
import * as Level3 from './03-async-await'
import * as Level4 from './04-ts-patterns'
import * as Level5 from './05-error-boundaries'
import * as Level6 from './06-data-fetching'
import * as Level7 from './07-forms-input'
import * as Level8 from './08-global-handling'
import * as Level9 from './09-advanced'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-basics',
    navKey: 'nav.basics',
    descKey: 'level.0.desc',
    tasks: [task('0.1', <Level0.Task0_1_Solution />), task('0.2', <Level0.Task0_2_Solution />)],
  },
  {
    levelId: '1',
    folder: '01-error-types',
    navKey: 'nav.errorTypes',
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
    folder: '02-promise-errors',
    navKey: 'nav.promises',
    descKey: 'level.2.desc',
    tasks: [
      task('2.1', <Level2.Task2_1_Solution />),
      task('2.2', <Level2.Task2_2_Solution />),
    ],
  },
  {
    levelId: '3',
    folder: '03-async-await',
    navKey: 'nav.asyncAwait',
    descKey: 'level.3.desc',
    tasks: [
      task('3.1', <Level3.Task3_1_Solution />),
      task('3.2', <Level3.Task3_2_Solution />),
    ],
  },
  {
    levelId: '4',
    folder: '04-ts-patterns',
    navKey: 'nav.tsPatterns',
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
    folder: '05-error-boundaries',
    navKey: 'nav.boundaries',
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
    folder: '06-data-fetching',
    navKey: 'nav.dataFetching',
    descKey: 'level.6.desc',
    tasks: [
      task('6.1', <Level6.Task6_1_Solution />),
      task('6.2', <Level6.Task6_2_Solution />),
      task('6.3', <Level6.Task6_3_Solution />),
      task('6.4', <Level6.Task6_4_Solution />),
    ],
  },
  {
    levelId: '7',
    folder: '07-forms-input',
    navKey: 'nav.forms',
    descKey: 'level.7.desc',
    tasks: [
      task('7.1', <Level7.Task7_1_Solution />),
      task('7.2', <Level7.Task7_2_Solution />),
      task('7.3', <Level7.Task7_3_Solution />),
      task('7.4', <Level7.Task7_4_Solution />),
    ],
  },
  {
    levelId: '8',
    folder: '08-global-handling',
    navKey: 'nav.global',
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
    folder: '09-advanced',
    navKey: 'nav.advanced',
    descKey: 'level.9.desc',
    tasks: [
      task('9.1', <Level9.Task9_1_Solution />),
      task('9.2', <Level9.Task9_2_Solution />),
      task('9.3', <Level9.Task9_3_Solution />),
    ],
  },
]
