import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-intro'
import * as Level1 from './01-package-json'
import * as Level2 from './02-semver'
import * as Level3 from './03-lockfile'
import * as Level4 from './04-node-modules'
import * as Level5 from './05-resolution'
import * as Level6 from './06-install-commands'
import * as Level7 from './07-diagnostics'
import * as Level8 from './08-error-resolution'
import * as Level9 from './09-overrides'
import * as Level10 from './10-audit-security'
import * as Level11 from './11-scripts-lifecycle'
import * as Level12 from './12-cache-integrity'
import * as Level13 from './13-workspaces'
import * as Level14 from './14-publishing'
import * as Level15 from './15-pnpm'
import * as Level16 from './16-yarn'
import * as Level17 from './17-comparison'
import * as Level18 from './18-migration-troubleshooting'

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
    folder: '01-package-json',
    navKey: 'nav.packageJson',
    descKey: 'level.1.desc',
    tasks: [task('1.1', <Level1.Task1_1_Solution />)],
  },
  {
    levelId: '2',
    folder: '02-semver',
    navKey: 'nav.semver',
    descKey: 'level.2.desc',
    tasks: [task('2.1', <Level2.Task2_1_Solution />)],
  },
  {
    levelId: '3',
    folder: '03-lockfile',
    navKey: 'nav.lockfile',
    descKey: 'level.3.desc',
    tasks: [task('3.1', <Level3.Task3_1_Solution />)],
  },
  {
    levelId: '4',
    folder: '04-node-modules',
    navKey: 'nav.nodeModules',
    descKey: 'level.4.desc',
    tasks: [task('4.1', <Level4.Task4_1_Solution />)],
  },
  {
    levelId: '5',
    folder: '05-resolution',
    navKey: 'nav.resolution',
    descKey: 'level.5.desc',
    tasks: [task('5.1', <Level5.Task5_1_Solution />)],
  },
  {
    levelId: '6',
    folder: '06-install-commands',
    navKey: 'nav.installCommands',
    descKey: 'level.6.desc',
    tasks: [task('6.1', <Level6.Task6_1_Solution />)],
  },
  {
    levelId: '7',
    folder: '07-diagnostics',
    navKey: 'nav.diagnostics',
    descKey: 'level.7.desc',
    tasks: [task('7.1', <Level7.Task7_1_Solution />)],
  },
  {
    levelId: '8',
    folder: '08-error-resolution',
    navKey: 'nav.errorResolution',
    descKey: 'level.8.desc',
    tasks: [task('8.1', <Level8.Task8_1_Solution />)],
  },
  {
    levelId: '9',
    folder: '09-overrides',
    navKey: 'nav.overrides',
    descKey: 'level.9.desc',
    tasks: [task('9.1', <Level9.Task9_1_Solution />)],
  },
  {
    levelId: '10',
    folder: '10-audit-security',
    navKey: 'nav.auditSecurity',
    descKey: 'level.10.desc',
    tasks: [task('10.1', <Level10.Task10_1_Solution />)],
  },
  {
    levelId: '11',
    folder: '11-scripts-lifecycle',
    navKey: 'nav.scriptsLifecycle',
    descKey: 'level.11.desc',
    tasks: [task('11.1', <Level11.Task11_1_Solution />)],
  },
  {
    levelId: '12',
    folder: '12-cache-integrity',
    navKey: 'nav.cacheIntegrity',
    descKey: 'level.12.desc',
    tasks: [task('12.1', <Level12.Task12_1_Solution />)],
  },
  {
    levelId: '13',
    folder: '13-workspaces',
    navKey: 'nav.workspaces',
    descKey: 'level.13.desc',
    tasks: [task('13.1', <Level13.Task13_1_Solution />)],
  },
  {
    levelId: '14',
    folder: '14-publishing',
    navKey: 'nav.publishing',
    descKey: 'level.14.desc',
    tasks: [task('14.1', <Level14.Task14_1_Solution />)],
  },
  {
    levelId: '15',
    folder: '15-pnpm',
    navKey: 'nav.pnpm',
    descKey: 'level.15.desc',
    tasks: [task('15.1', <Level15.Task15_1_Solution />)],
  },
  {
    levelId: '16',
    folder: '16-yarn',
    navKey: 'nav.yarn',
    descKey: 'level.16.desc',
    tasks: [task('16.1', <Level16.Task16_1_Solution />)],
  },
  {
    levelId: '17',
    folder: '17-comparison',
    navKey: 'nav.comparison',
    descKey: 'level.17.desc',
    tasks: [task('17.1', <Level17.Task17_1_Solution />)],
  },
  {
    levelId: '18',
    folder: '18-migration-troubleshooting',
    navKey: 'nav.migrationTroubleshooting',
    descKey: 'level.18.desc',
    tasks: [task('18.1', <Level18.Task18_1_Solution />)],
  },
]
