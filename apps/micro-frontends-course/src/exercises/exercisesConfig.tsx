import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-why-micro-frontends'
import * as Level1 from './01-architecture-patterns'
import * as Level2 from './02-module-federation-basics'
import * as Level3 from './03-module-federation-advanced'
import * as Level4 from './04-single-spa-orchestration'
import * as Level5 from './05-web-components-contracts'
import * as Level6 from './06-shared-dependencies'
import * as Level7 from './07-routing-between-apps'
import * as Level8 from './08-communication-patterns'
import * as Level9 from './09-design-system-integration'
import * as Level10 from './10-deploy-and-versioning'
import * as Level11 from './11-testing-strategies'
import * as Level12 from './12-monitoring-and-observability'
import * as Level13 from './13-migration-from-monolith'
import * as Level14 from './14-dx-and-tooling'
import * as Level15 from './15-capstone-architecture'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-why-micro-frontends',
    navKey: 'nav.whyMicroFrontends',
    descKey: 'level.0.desc',
    tasks: [
      task('0.1', <Level0.Task0_1_Solution />),
      task('0.2', <Level0.Task0_2_Solution />),
    ],
  },
  {
    levelId: '1',
    folder: '01-architecture-patterns',
    navKey: 'nav.architecturePatterns',
    descKey: 'level.1.desc',
    tasks: [
      task('1.1', <Level1.Task1_1_Solution />),
      task('1.2', <Level1.Task1_2_Solution />),
    ],
  },
  {
    levelId: '2',
    folder: '02-module-federation-basics',
    navKey: 'nav.moduleFederationBasics',
    descKey: 'level.2.desc',
    tasks: [
      task('2.1', <Level2.Task2_1_Solution />),
      task('2.2', <Level2.Task2_2_Solution />),
      task('2.3', <Level2.Task2_3_Solution />),
    ],
  },
  {
    levelId: '3',
    folder: '03-module-federation-advanced',
    navKey: 'nav.moduleFederationAdvanced',
    descKey: 'level.3.desc',
    tasks: [
      task('3.1', <Level3.Task3_1_Solution />),
      task('3.2', <Level3.Task3_2_Solution />),
    ],
  },
  {
    levelId: '4',
    folder: '04-single-spa-orchestration',
    navKey: 'nav.singleSpaOrchestration',
    descKey: 'level.4.desc',
    tasks: [
      task('4.1', <Level4.Task4_1_Solution />),
      task('4.2', <Level4.Task4_2_Solution />),
      task('4.3', <Level4.Task4_3_Solution />),
    ],
  },
  {
    levelId: '5',
    folder: '05-web-components-contracts',
    navKey: 'nav.webComponentsContracts',
    descKey: 'level.5.desc',
    tasks: [
      task('5.1', <Level5.Task5_1_Solution />),
      task('5.2', <Level5.Task5_2_Solution />),
    ],
  },
  {
    levelId: '6',
    folder: '06-shared-dependencies',
    navKey: 'nav.sharedDependencies',
    descKey: 'level.6.desc',
    tasks: [
      task('6.1', <Level6.Task6_1_Solution />),
      task('6.2', <Level6.Task6_2_Solution />),
    ],
  },
  {
    levelId: '7',
    folder: '07-routing-between-apps',
    navKey: 'nav.routingBetweenApps',
    descKey: 'level.7.desc',
    tasks: [
      task('7.1', <Level7.Task7_1_Solution />),
      task('7.2', <Level7.Task7_2_Solution />),
    ],
  },
  {
    levelId: '8',
    folder: '08-communication-patterns',
    navKey: 'nav.communicationPatterns',
    descKey: 'level.8.desc',
    tasks: [
      task('8.1', <Level8.Task8_1_Solution />),
      task('8.2', <Level8.Task8_2_Solution />),
      task('8.3', <Level8.Task8_3_Solution />),
    ],
  },
  {
    levelId: '9',
    folder: '09-design-system-integration',
    navKey: 'nav.designSystemIntegration',
    descKey: 'level.9.desc',
    tasks: [
      task('9.1', <Level9.Task9_1_Solution />),
      task('9.2', <Level9.Task9_2_Solution />),
    ],
  },
  {
    levelId: '10',
    folder: '10-deploy-and-versioning',
    navKey: 'nav.deployAndVersioning',
    descKey: 'level.10.desc',
    tasks: [
      task('10.1', <Level10.Task10_1_Solution />),
      task('10.2', <Level10.Task10_2_Solution />),
    ],
  },
  {
    levelId: '11',
    folder: '11-testing-strategies',
    navKey: 'nav.testingStrategies',
    descKey: 'level.11.desc',
    tasks: [
      task('11.1', <Level11.Task11_1_Solution />),
      task('11.2', <Level11.Task11_2_Solution />),
    ],
  },
  {
    levelId: '12',
    folder: '12-monitoring-and-observability',
    navKey: 'nav.monitoringObservability',
    descKey: 'level.12.desc',
    tasks: [
      task('12.1', <Level12.Task12_1_Solution />),
      task('12.2', <Level12.Task12_2_Solution />),
    ],
  },
  {
    levelId: '13',
    folder: '13-migration-from-monolith',
    navKey: 'nav.migrationFromMonolith',
    descKey: 'level.13.desc',
    tasks: [
      task('13.1', <Level13.Task13_1_Solution />),
      task('13.2', <Level13.Task13_2_Solution />),
    ],
  },
  {
    levelId: '14',
    folder: '14-dx-and-tooling',
    navKey: 'nav.dxAndTooling',
    descKey: 'level.14.desc',
    tasks: [
      task('14.1', <Level14.Task14_1_Solution />),
      task('14.2', <Level14.Task14_2_Solution />),
    ],
  },
  {
    levelId: '15',
    folder: '15-capstone-architecture',
    navKey: 'nav.capstoneArchitecture',
    descKey: 'level.15.desc',
    tasks: [
      task('15.1', <Level15.Task15_1_Solution />),
      task('15.2', <Level15.Task15_2_Solution />),
      task('15.3', <Level15.Task15_3_Solution />),
    ],
  },
]
