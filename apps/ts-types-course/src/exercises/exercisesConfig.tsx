import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-generic-foundations'
import * as Level1 from './01-conditional-types'
import * as Level2 from './02-mapped-types'
import * as Level3 from './03-template-literal-types'
import * as Level4 from './04-infer-keyword'
import * as Level5 from './05-discriminated-unions-advanced'
import * as Level6 from './06-type-guards-advanced'
import * as Level7 from './07-variance'
import * as Level8 from './08-declaration-merging'
import * as Level9 from './09-recursive-types'
import * as Level10 from './10-type-level-programming'
import * as Level11 from './11-utility-type-patterns'
import * as Level12 from './12-advanced-generics'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-generic-foundations',
    navKey: 'nav.genericFoundations',
    descKey: 'level.0.desc',
    tasks: [
      task('0.1', <Level0.Task0_1_Solution />),
      task('0.2', <Level0.Task0_2_Solution />),
      task('0.3', <Level0.Task0_3_Solution />),
      task('0.4', <Level0.Task0_4_Solution />),
      task('0.5', <Level0.Task0_5_Solution />),
    ],
  },
  {
    levelId: '1',
    folder: '01-conditional-types',
    navKey: 'nav.conditionalTypes',
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
    folder: '02-mapped-types',
    navKey: 'nav.mappedTypes',
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
    folder: '03-template-literal-types',
    navKey: 'nav.templateLiteralTypes',
    descKey: 'level.3.desc',
    tasks: [
      task('3.1', <Level3.Task3_1_Solution />),
      task('3.2', <Level3.Task3_2_Solution />),
      task('3.3', <Level3.Task3_3_Solution />),
    ],
  },
  {
    levelId: '4',
    folder: '04-infer-keyword',
    navKey: 'nav.inferKeyword',
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
    folder: '05-discriminated-unions-advanced',
    navKey: 'nav.discriminatedUnionsAdvanced',
    descKey: 'level.5.desc',
    tasks: [
      task('5.1', <Level5.Task5_1_Solution />),
      task('5.2', <Level5.Task5_2_Solution />),
      task('5.3', <Level5.Task5_3_Solution />),
    ],
  },
  {
    levelId: '6',
    folder: '06-type-guards-advanced',
    navKey: 'nav.typeGuardsAdvanced',
    descKey: 'level.6.desc',
    tasks: [
      task('6.1', <Level6.Task6_1_Solution />),
      task('6.2', <Level6.Task6_2_Solution />),
      task('6.3', <Level6.Task6_3_Solution />),
    ],
  },
  {
    levelId: '7',
    folder: '07-variance',
    navKey: 'nav.variance',
    descKey: 'level.7.desc',
    tasks: [
      task('7.1', <Level7.Task7_1_Solution />),
      task('7.2', <Level7.Task7_2_Solution />),
    ],
  },
  {
    levelId: '8',
    folder: '08-declaration-merging',
    navKey: 'nav.declarationMerging',
    descKey: 'level.8.desc',
    tasks: [
      task('8.1', <Level8.Task8_1_Solution />),
      task('8.2', <Level8.Task8_2_Solution />),
      task('8.3', <Level8.Task8_3_Solution />),
    ],
  },
  {
    levelId: '9',
    folder: '09-recursive-types',
    navKey: 'nav.recursiveTypes',
    descKey: 'level.9.desc',
    tasks: [
      task('9.1', <Level9.Task9_1_Solution />),
      task('9.2', <Level9.Task9_2_Solution />),
      task('9.3', <Level9.Task9_3_Solution />),
      task('9.4', <Level9.Task9_4_Solution />),
    ],
  },
  {
    levelId: '10',
    folder: '10-type-level-programming',
    navKey: 'nav.typeLevelProgramming',
    descKey: 'level.10.desc',
    tasks: [
      task('10.1', <Level10.Task10_1_Solution />),
      task('10.2', <Level10.Task10_2_Solution />),
      task('10.3', <Level10.Task10_3_Solution />),
      task('10.4', <Level10.Task10_4_Solution />),
      task('10.5', <Level10.Task10_5_Solution />),
    ],
  },
  {
    levelId: '11',
    folder: '11-utility-type-patterns',
    navKey: 'nav.utilityTypePatterns',
    descKey: 'level.11.desc',
    tasks: [
      task('11.1', <Level11.Task11_1_Solution />),
      task('11.2', <Level11.Task11_2_Solution />),
      task('11.3', <Level11.Task11_3_Solution />),
      task('11.4', <Level11.Task11_4_Solution />),
    ],
  },
  {
    levelId: '12',
    folder: '12-advanced-generics',
    navKey: 'nav.advancedGenerics',
    descKey: 'level.12.desc',
    tasks: [
      task('12.1', <Level12.Task12_1_Solution />),
      task('12.2', <Level12.Task12_2_Solution />),
      task('12.3', <Level12.Task12_3_Solution />),
    ],
  },
]
