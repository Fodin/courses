import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 8.1: Kafka Cluster — Brokers and Controller
// ============================================
//
// Goal: implement an interactive visualization of a 3-broker Kafka cluster.
// The user can click on brokers, see their partitions (leader/follower, ISR),
// simulate a controller crash and switch between KRaft and ZooKeeper modes.

// TODO: Define Partition interface:
//   id: number
//   topic: string
//   role: 'leader' | 'follower'
//   isr: boolean
// interface Partition { ... }

// TODO: Define Broker interface:
//   id: number
//   host: string
//   port: number
//   isController: boolean
//   rack: string
//   partitions: Partition[]
//   color: string
//   bgColor: string
// interface Broker { ... }

// TODO: Create constant initialBrokers: Broker[] — array of 3 brokers:
//   Broker 1: kafka-1:9092, isController: true, rack: 'rack-a', color: '#1565C0', bgColor: '#E3F2FD'
//     partitions: orders[0] leader ISR, orders[1] follower ISR,
//                 payments[0] leader ISR, payments[1] follower NOT ISR
//   Broker 2: kafka-2:9092, isController: false, rack: 'rack-a', color: '#6A1B9A', bgColor: '#F3E5F5'
//     partitions: orders[1] leader ISR, orders[2] follower ISR,
//                 payments[1] leader ISR, payments[2] follower ISR
//   Broker 3: kafka-3:9092, isController: false, rack: 'rack-b', color: '#2E7D32', bgColor: '#E8F5E9'
//     partitions: orders[2] leader ISR, orders[0] follower ISR,
//                 payments[2] leader ISR, payments[0] follower ISR
// const initialBrokers: Broker[] = [...]

export function Task8_1() {
  const { t } = useLanguage()

  // TODO: State selectedBroker: number | null — ID of the selected broker
  const [selectedBroker, setSelectedBroker] = useState<number | null>(null)

  // TODO: State brokers: Broker[] — initialize from initialBrokers
  const [brokers, setBrokers] = useState<unknown[]>([])

  // TODO: State log: string[] — cluster event log
  const [log, setLog] = useState<string[]>([])

  // TODO: State mode: 'zookeeper' | 'kraft' — cluster management mode (default 'kraft')
  const [mode, setMode] = useState<string>('kraft')

  // TODO: Implement helper function addLog(msg: string):
  //   - Prepends `[HH:MM:SS] msg` to the log
  //   - Limits log to 12 entries
  const addLog = (_msg: string) => {
    // TODO: implement
  }

  // TODO: Implement function simulateControllerFailover():
  //   1. Find the current controller (brokers.find(b => b.isController))
  //   2. Randomly pick a new controller from the rest (Math.random())
  //   3. Update brokers: new one gets isController: true, others false
  //   4. Add to log:
  //      - `Broker-N crashed. Starting controller election...`
  //      - `Broker-M became new controller (KRaft Raft consensus / ZooKeeper election)`
  //   5. If selectedBroker === crashed controller, switch to the new one
  const simulateControllerFailover = () => {
    // TODO: implement
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Apache Kafka cluster with 3 brokers. Click on a broker to see its partitions.
      </p>

      {/* TODO: Mode toggle buttons — 'kraft' | 'zookeeper'
          Active mode: background '#1565C0', color '#fff', fontWeight 700
          Inactive mode: background '#fff', color '#333', border '1px solid #ddd' */}

      {/* TODO: Cluster block (background '#f8f9fa', borderRadius '12px', padding '1.25rem'):
          - Left: KRaft Controller block (icon ⚙️, label 'KRaft Controller / built-in Raft')
            or ZooKeeper (icon 🐘, label 'ZooKeeper / external cluster')
            border: '2px solid #E65100', background: '#FFF3E0'
          - Arrow ⟷ between control block and brokers
          - Broker cards: clickable, on click setSelectedBroker(id)
            For controller: CONTROLLER badge in position absolute top-right,
            background '#E65100', color '#fff'
            Fields: icon 🖥️, Broker-N (color broker.color), host:port, rack (gray), N partitions */}

      {/* TODO: Partition panel for selected broker (if selectedBroker !== null):
          - Header "Broker-N — partitions" in broker.color
          - Partition cards: topic[id], role (★ Leader / ○ Follower), ISR status (✅ ISR / ❌ Out of ISR)
          - Leader — border in broker color, background '#fff'
          - Follower — border '#ccc', background '#f5f5f5' */}

      {/* TODO: Action buttons:
          - "Simulate Controller Crash" → simulateControllerFailover() (background '#C62828')
          - "Reset Cluster" → setBrokers(initialBrokers) (background '#f5f5f5') */}

      {/* TODO: Info panel (background '#FFF8E1', border '1px solid #FFE082'):
          KRaft: 'Controller is built into the broker. Uses Raft consensus...'
          ZooKeeper: 'ZooKeeper — external service for metadata storage. Deprecated...' */}

      {/* TODO: Cluster event log (if log.length > 0):
          - Dark terminal (background '#0d1117', color '#58a6ff')
          - "Clear" button → setLog([]) */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: implement the task UI
      </div>
    </div>
  )
}
