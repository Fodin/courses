import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-intro'
import * as Level1 from './01-gitlab-yml-basics'
import * as Level2 from './02-jobs-lifecycle'
import * as Level3 from './03-variables'
import * as Level4 from './04-rules-conditions'
import * as Level5 from './05-cache-artifacts'
import * as Level6 from './06-runners'
import * as Level7 from './07-testing-in-ci'
import * as Level8 from './08-docker-in-ci'
import * as Level9 from './09-environments-deploy'
import * as Level10 from './10-secrets-security'
import * as Level11 from './11-includes-templates'
import * as Level12 from './12-advanced-pipelines'
import * as Level13 from './13-monorepo'
import * as Level14 from './14-security-scanning'
import * as Level15 from './15-releases'
import * as Level16 from './16-github-actions'
import * as Level17 from './17-best-practices'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-intro',
    navKey: 'nav.intro',
    descKey: 'level.0.desc',
    tasks: [
      task('0.1', <Level0.Task0_1_Solution />),
      task('0.2', <Level0.Task0_2_Solution />),
      task('0.3', <Level0.Task0_3_Solution />),
    ],
  },
  {
    levelId: '1',
    folder: '01-gitlab-yml-basics',
    navKey: 'nav.gitlabYmlBasics',
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
    folder: '02-jobs-lifecycle',
    navKey: 'nav.jobsLifecycle',
    descKey: 'level.2.desc',
    tasks: [
      task('2.1', <Level2.Task2_1_Solution />),
      task('2.2', <Level2.Task2_2_Solution />),
      task('2.3', <Level2.Task2_3_Solution />),
    ],
  },
  {
    levelId: '3',
    folder: '03-variables',
    navKey: 'nav.variables',
    descKey: 'level.3.desc',
    tasks: [
      task('3.1', <Level3.Task3_1_Solution />),
      task('3.2', <Level3.Task3_2_Solution />),
      task('3.3', <Level3.Task3_3_Solution />),
    ],
  },
  {
    levelId: '4',
    folder: '04-rules-conditions',
    navKey: 'nav.rulesConditions',
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
    folder: '05-cache-artifacts',
    navKey: 'nav.cacheArtifacts',
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
    folder: '06-runners',
    navKey: 'nav.runners',
    descKey: 'level.6.desc',
    tasks: [
      task('6.1', <Level6.Task6_1_Solution />),
      task('6.2', <Level6.Task6_2_Solution />),
      task('6.3', <Level6.Task6_3_Solution />),
    ],
  },
  {
    levelId: '7',
    folder: '07-testing-in-ci',
    navKey: 'nav.testingInCi',
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
    folder: '08-docker-in-ci',
    navKey: 'nav.dockerInCi',
    descKey: 'level.8.desc',
    tasks: [
      task('8.1', <Level8.Task8_1_Solution />),
      task('8.2', <Level8.Task8_2_Solution />),
      task('8.3', <Level8.Task8_3_Solution />),
    ],
  },
  {
    levelId: '9',
    folder: '09-environments-deploy',
    navKey: 'nav.environmentsDeploy',
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
    folder: '10-secrets-security',
    navKey: 'nav.secretsSecurity',
    descKey: 'level.10.desc',
    tasks: [
      task('10.1', <Level10.Task10_1_Solution />),
      task('10.2', <Level10.Task10_2_Solution />),
      task('10.3', <Level10.Task10_3_Solution />),
    ],
  },
  {
    levelId: '11',
    folder: '11-includes-templates',
    navKey: 'nav.includesTemplates',
    descKey: 'level.11.desc',
    tasks: [
      task('11.1', <Level11.Task11_1_Solution />),
      task('11.2', <Level11.Task11_2_Solution />),
      task('11.3', <Level11.Task11_3_Solution />),
    ],
  },
  {
    levelId: '12',
    folder: '12-advanced-pipelines',
    navKey: 'nav.advancedPipelines',
    descKey: 'level.12.desc',
    tasks: [
      task('12.1', <Level12.Task12_1_Solution />),
      task('12.2', <Level12.Task12_2_Solution />),
      task('12.3', <Level12.Task12_3_Solution />),
      task('12.4', <Level12.Task12_4_Solution />),
    ],
  },
  {
    levelId: '13',
    folder: '13-monorepo',
    navKey: 'nav.monorepo',
    descKey: 'level.13.desc',
    tasks: [
      task('13.1', <Level13.Task13_1_Solution />),
      task('13.2', <Level13.Task13_2_Solution />),
      task('13.3', <Level13.Task13_3_Solution />),
    ],
  },
  {
    levelId: '14',
    folder: '14-security-scanning',
    navKey: 'nav.securityScanning',
    descKey: 'level.14.desc',
    tasks: [
      task('14.1', <Level14.Task14_1_Solution />),
      task('14.2', <Level14.Task14_2_Solution />),
      task('14.3', <Level14.Task14_3_Solution />),
    ],
  },
  {
    levelId: '15',
    folder: '15-releases',
    navKey: 'nav.releases',
    descKey: 'level.15.desc',
    tasks: [
      task('15.1', <Level15.Task15_1_Solution />),
      task('15.2', <Level15.Task15_2_Solution />),
      task('15.3', <Level15.Task15_3_Solution />),
    ],
  },
  {
    levelId: '16',
    folder: '16-github-actions',
    navKey: 'nav.githubActions',
    descKey: 'level.16.desc',
    tasks: [
      task('16.1', <Level16.Task16_1_Solution />),
      task('16.2', <Level16.Task16_2_Solution />),
      task('16.3', <Level16.Task16_3_Solution />),
      task('16.4', <Level16.Task16_4_Solution />),
    ],
  },
  {
    levelId: '17',
    folder: '17-best-practices',
    navKey: 'nav.bestPractices',
    descKey: 'level.17.desc',
    tasks: [
      task('17.1', <Level17.Task17_1_Solution />),
      task('17.2', <Level17.Task17_2_Solution />),
      task('17.3', <Level17.Task17_3_Solution />),
    ],
  },
]
