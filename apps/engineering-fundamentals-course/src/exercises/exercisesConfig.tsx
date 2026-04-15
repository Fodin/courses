import { task, type LevelConfig } from '@courses/platform'

import * as Level0 from './00-language-and-paradigms'
import * as Level1 from './01-type-systems'
import * as Level2 from './02-data-structures-and-adt'
import * as Level3 from './03-state-and-immutability'
import * as Level4 from './04-functions-and-composition'
import * as Level5 from './05-polymorphism-and-dispatch'
import * as Level6 from './06-structural-composition'
import * as Level7 from './07-modularity'
import * as Level8 from './08-abstraction-and-soc'
import * as Level9 from './09-coupling-cohesion-boundaries'
import * as Level10 from './10-ioc-and-contracts'
import * as Level11 from './11-naming-and-code-style'
import * as Level12 from './12-error-handling'
import * as Level13 from './13-concurrency-and-async'
import * as Level14 from './14-metaprogramming-and-dsl'
import * as Level15 from './15-testing'
import * as Level16 from './16-refactoring-and-review'
import * as Level17 from './17-platform-agnostic'
import * as Level18 from './18-ai-engineering'

export const exercises: LevelConfig[] = [
  {
    levelId: '0',
    folder: '00-language-and-paradigms',
    navKey: 'nav.languageAndParadigms',
    descKey: 'level.0.desc',
    tasks: [task('0.1', <Level0.Task0_1_Solution />)],
  },
  {
    levelId: '1',
    folder: '01-type-systems',
    navKey: 'nav.typeSystems',
    descKey: 'level.1.desc',
    tasks: [task('1.1', <Level1.Task1_1_Solution />)],
  },
  {
    levelId: '2',
    folder: '02-data-structures-and-adt',
    navKey: 'nav.dataStructuresAndAdt',
    descKey: 'level.2.desc',
    tasks: [task('2.1', <Level2.Task2_1_Solution />)],
  },
  {
    levelId: '3',
    folder: '03-state-and-immutability',
    navKey: 'nav.stateAndImmutability',
    descKey: 'level.3.desc',
    tasks: [task('3.1', <Level3.Task3_1_Solution />)],
  },
  {
    levelId: '4',
    folder: '04-functions-and-composition',
    navKey: 'nav.functionsAndComposition',
    descKey: 'level.4.desc',
    tasks: [task('4.1', <Level4.Task4_1_Solution />)],
  },
  {
    levelId: '5',
    folder: '05-polymorphism-and-dispatch',
    navKey: 'nav.polymorphismAndDispatch',
    descKey: 'level.5.desc',
    tasks: [task('5.1', <Level5.Task5_1_Solution />)],
  },
  {
    levelId: '6',
    folder: '06-structural-composition',
    navKey: 'nav.structuralComposition',
    descKey: 'level.6.desc',
    tasks: [task('6.1', <Level6.Task6_1_Solution />)],
  },
  {
    levelId: '7',
    folder: '07-modularity',
    navKey: 'nav.modularity',
    descKey: 'level.7.desc',
    tasks: [task('7.1', <Level7.Task7_1_Solution />)],
  },
  {
    levelId: '8',
    folder: '08-abstraction-and-soc',
    navKey: 'nav.abstractionAndSoc',
    descKey: 'level.8.desc',
    tasks: [task('8.1', <Level8.Task8_1_Solution />)],
  },
  {
    levelId: '9',
    folder: '09-coupling-cohesion-boundaries',
    navKey: 'nav.couplingCohesionBoundaries',
    descKey: 'level.9.desc',
    tasks: [task('9.1', <Level9.Task9_1_Solution />)],
  },
  {
    levelId: '10',
    folder: '10-ioc-and-contracts',
    navKey: 'nav.iocAndContracts',
    descKey: 'level.10.desc',
    tasks: [task('10.1', <Level10.Task10_1_Solution />)],
  },
  {
    levelId: '11',
    folder: '11-naming-and-code-style',
    navKey: 'nav.namingAndCodeStyle',
    descKey: 'level.11.desc',
    tasks: [task('11.1', <Level11.Task11_1_Solution />)],
  },
  {
    levelId: '12',
    folder: '12-error-handling',
    navKey: 'nav.errorHandling',
    descKey: 'level.12.desc',
    tasks: [task('12.1', <Level12.Task12_1_Solution />)],
  },
  {
    levelId: '13',
    folder: '13-concurrency-and-async',
    navKey: 'nav.concurrencyAndAsync',
    descKey: 'level.13.desc',
    tasks: [task('13.1', <Level13.Task13_1_Solution />)],
  },
  {
    levelId: '14',
    folder: '14-metaprogramming-and-dsl',
    navKey: 'nav.metaprogrammingAndDsl',
    descKey: 'level.14.desc',
    tasks: [task('14.1', <Level14.Task14_1_Solution />)],
  },
  {
    levelId: '15',
    folder: '15-testing',
    navKey: 'nav.testing',
    descKey: 'level.15.desc',
    tasks: [task('15.1', <Level15.Task15_1_Solution />)],
  },
  {
    levelId: '16',
    folder: '16-refactoring-and-review',
    navKey: 'nav.refactoringAndReview',
    descKey: 'level.16.desc',
    tasks: [task('16.1', <Level16.Task16_1_Solution />)],
  },
  {
    levelId: '17',
    folder: '17-platform-agnostic',
    navKey: 'nav.platformAgnostic',
    descKey: 'level.17.desc',
    tasks: [task('17.1', <Level17.Task17_1_Solution />)],
  },
  {
    levelId: '18',
    folder: '18-ai-engineering',
    navKey: 'nav.aiEngineering',
    descKey: 'level.18.desc',
    tasks: [task('18.1', <Level18.Task18_1_Solution />)],
  },
]
