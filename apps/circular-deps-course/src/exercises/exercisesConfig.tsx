import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-intro'
import * as Level1 from './01-module-runtime'
import * as Level2 from './02-why-harmful'
import * as Level3 from './03-type-vs-runtime'
import * as Level4 from './04-barrel-files'
import * as Level5 from './05-detection-tools'
import * as Level6 from './06-eslint-no-cycle'
import * as Level7 from './07-breaking-techniques'
import * as Level8 from './08-fsd-layers'
import * as Level9 from './09-fsd-slices-public-api'
import * as Level10 from './10-fsd-violations'
import * as Level11 from './11-boundary-linters'
import * as Level12 from './12-monorepo-cycles'
import * as Level13 from './13-ci-prevention'
import * as Level14 from './14-capstone'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-intro',
    navKey: 'nav.intro',
    descKey: 'level.0.desc',
    tasks: [task('0.1', <Level0.Task0_1_Solution />)],
  },
  {
    levelId: '1',
    folder: '01-module-runtime',
    navKey: 'nav.moduleRuntime',
    descKey: 'level.1.desc',
    tasks: [task('1.1', <Level1.Task1_1_Solution />)],
  },
  {
    levelId: '2',
    folder: '02-why-harmful',
    navKey: 'nav.whyHarmful',
    descKey: 'level.2.desc',
    tasks: [task('2.1', <Level2.Task2_1_Solution />)],
  },
  {
    levelId: '3',
    folder: '03-type-vs-runtime',
    navKey: 'nav.typeVsRuntime',
    descKey: 'level.3.desc',
    tasks: [
      task('3.1', <Level3.Task3_1_Solution />),
      task('3.2', <Level3.Task3_2_Solution />),
      task('3.3', <Level3.Task3_3_Solution />, '*'),
      task('3.4', <Level3.Task3_4_Solution />),
      task('3.5', <Level3.Task3_5_Solution />),
      task('3.6', <Level3.Task3_6_Solution />, '*'),
    ],
  },
  {
    levelId: '4',
    folder: '04-barrel-files',
    navKey: 'nav.barrelFiles',
    descKey: 'level.4.desc',
    tasks: [
      task('4.1', <Level4.Task4_1_Solution />),
      task('4.2', <Level4.Task4_2_Solution />),
      task('4.3', <Level4.Task4_3_Solution />, '*'),
      task('4.4', <Level4.Task4_4_Solution />),
      task('4.5', <Level4.Task4_5_Solution />),
      task('4.6', <Level4.Task4_6_Solution />, '*'),
    ],
  },
  {
    levelId: '5',
    folder: '05-detection-tools',
    navKey: 'nav.detectionTools',
    descKey: 'level.5.desc',
    tasks: [task('5.1', <Level5.Task5_1_Solution />)],
  },
  {
    levelId: '6',
    folder: '06-eslint-no-cycle',
    navKey: 'nav.eslintNoCycle',
    descKey: 'level.6.desc',
    tasks: [task('6.1', <Level6.Task6_1_Solution />)],
  },
  {
    levelId: '7',
    folder: '07-breaking-techniques',
    navKey: 'nav.breakingTechniques',
    descKey: 'level.7.desc',
    tasks: [
      task('7.1', <Level7.Task7_1_Solution />),
      task('7.2', <Level7.Task7_2_Solution />),
      task('7.3', <Level7.Task7_3_Solution />, '*'),
      task('7.4', <Level7.Task7_4_Solution />),
      task('7.5', <Level7.Task7_5_Solution />),
      task('7.6', <Level7.Task7_6_Solution />, '*'),
      task('7.7', <Level7.Task7_7_Solution />),
      task('7.8', <Level7.Task7_8_Solution />),
      task('7.9', <Level7.Task7_9_Solution />, '*'),
    ],
  },
  {
    levelId: '8',
    folder: '08-fsd-layers',
    navKey: 'nav.fsdLayers',
    descKey: 'level.8.desc',
    tasks: [
      task('8.1', <Level8.Task8_1_Solution />),
      task('8.2', <Level8.Task8_2_Solution />),
      task('8.3', <Level8.Task8_3_Solution />, '*'),
      task('8.4', <Level8.Task8_4_Solution />),
      task('8.5', <Level8.Task8_5_Solution />),
      task('8.6', <Level8.Task8_6_Solution />, '*'),
    ],
  },
  {
    levelId: '9',
    folder: '09-fsd-slices-public-api',
    navKey: 'nav.fsdSlices',
    descKey: 'level.9.desc',
    tasks: [
      task('9.1', <Level9.Task9_1_Solution />),
      task('9.2', <Level9.Task9_2_Solution />),
      task('9.3', <Level9.Task9_3_Solution />, '*'),
      task('9.4', <Level9.Task9_4_Solution />),
      task('9.5', <Level9.Task9_5_Solution />),
      task('9.6', <Level9.Task9_6_Solution />, '*'),
    ],
  },
  {
    levelId: '10',
    folder: '10-fsd-violations',
    navKey: 'nav.fsdViolations',
    descKey: 'level.10.desc',
    tasks: [
      task('10.1', <Level10.Task10_1_Solution />),
      task('10.2', <Level10.Task10_2_Solution />),
      task('10.3', <Level10.Task10_3_Solution />, '*'),
      task('10.4', <Level10.Task10_4_Solution />),
      task('10.5', <Level10.Task10_5_Solution />),
      task('10.6', <Level10.Task10_6_Solution />, '*'),
    ],
  },
  {
    levelId: '11',
    folder: '11-boundary-linters',
    navKey: 'nav.boundaryLinters',
    descKey: 'level.11.desc',
    tasks: [task('11.1', <Level11.Task11_1_Solution />)],
  },
  {
    levelId: '12',
    folder: '12-monorepo-cycles',
    navKey: 'nav.monorepoCycles',
    descKey: 'level.12.desc',
    tasks: [
      task('12.1', <Level12.Task12_1_Solution />),
      task('12.2', <Level12.Task12_2_Solution />),
      task('12.3', <Level12.Task12_3_Solution />, '*'),
      task('12.4', <Level12.Task12_4_Solution />),
      task('12.5', <Level12.Task12_5_Solution />),
      task('12.6', <Level12.Task12_6_Solution />, '*'),
    ],
  },
  {
    levelId: '13',
    folder: '13-ci-prevention',
    navKey: 'nav.ciPrevention',
    descKey: 'level.13.desc',
    tasks: [task('13.1', <Level13.Task13_1_Solution />)],
  },
  {
    levelId: '14',
    folder: '14-capstone',
    navKey: 'nav.capstone',
    descKey: 'level.14.desc',
    tasks: [
      task('14.1', <Level14.Task14_1_Solution />),
      task('14.2', <Level14.Task14_2_Solution />),
      task('14.3', <Level14.Task14_3_Solution />, '*'),
      task('14.4', <Level14.Task14_4_Solution />),
      task('14.5', <Level14.Task14_5_Solution />),
      task('14.6', <Level14.Task14_6_Solution />, '*'),
    ],
  },
]
