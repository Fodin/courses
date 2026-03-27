import { useState } from 'react'

// ============================================
// Задание 7.4: Module Contracts
// ============================================

interface CreateUserInput {
  name: string
  email: string
}

interface ModuleUser {
  id: string
  name: string
  email: string
}

interface Notification {
  id: string
  userId: string
  message: string
  timestamp: number
}

// TODO: Define interface UserModuleContract:
//   createUser(input: CreateUserInput): ModuleUser
//   getUser(id: string): ModuleUser | null
//   listUsers(): ModuleUser[]
//   deleteUser(id: string): boolean

// TODO: Define interface NotificationModuleContract:
//   send(userId: string, message: string): void
//   getHistory(userId: string): Notification[]

let moduleUserIdCounter = 0
let notificationIdCounter = 0

// TODO: Create function createUserModule(): UserModuleContract
//   — create internal state: const users = new Map<string, ModuleUser>()
//   — return object implementing UserModuleContract:
//     createUser: generate id = `u-${++moduleUserIdCounter}`, store and return user
//     getUser: return from map or null
//     listUsers: return Array.from(users.values())
//     deleteUser: return users.delete(id)

// TODO: Create function createNotificationModule(deps: { users: UserModuleContract }): NotificationModuleContract
//   — create internal state: const notifications = new Map<string, Notification[]>()
//   — return object implementing NotificationModuleContract:
//     send(userId, message):
//       — first check if user exists via deps.users.getUser(userId)
//       — if not found, throw Error(`Cannot notify: user ${userId} not found`)
//       — create Notification with id = `notif-${++notificationIdCounter}`, timestamp = Date.now()
//       — append to notifications map (create array if needed)
//     getHistory(userId):
//       — return notifications for userId or empty array

export function Task7_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    moduleUserIdCounter = 0
    notificationIdCounter = 0

    // TODO: Create user module via createUserModule()
    // TODO: Create notification module via createNotificationModule({ users })

    // TODO: Create two users (Alice, Bob) via users.createUser, log their names and ids

    // TODO: Send notifications:
    //   - Send 'Welcome to the platform!' to Alice
    //   - Send 'Your order has been shipped' to Alice
    //   - Send 'Welcome, Bob!' to Bob
    //   Log how many notifications sent to each user

    // TODO: Get Alice's notification history, log each notification id and message

    // TODO: Try to send notification to non-existent user 'u-999', catch error, log message

    // TODO: Delete Bob via users.deleteUser, list remaining users, log count and details

    // TODO: Log contract summary:
    //   'UserModule exposes: createUser, getUser, listUsers, deleteUser'
    //   'NotificationModule exposes: send, getHistory'
    //   'Internal state (Maps) is hidden — only contracts are public'

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.4: Module Contracts</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
