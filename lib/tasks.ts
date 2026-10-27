import type { SqliteDatabase } from './db'

export type Task = {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

type TaskRow = {
  id: number
  title: string
  completed: number
  created_at: string
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
  }
}

export function listTasks(db: SqliteDatabase): Task[] {
  const result = db.exec('SELECT id, title, completed, created_at FROM tasks ORDER BY id DESC')
  const rows = (result[0]?.values ?? []).map(([id, title, completed, createdAt]) => ({
    id: Number(id),
    title: String(title),
    completed: Number(completed),
    created_at: String(createdAt),
  })) as TaskRow[]

  return rows.map(toTask)
}

export function createTask(db: SqliteDatabase, title: string): Task {
  db.run('INSERT INTO tasks (title) VALUES (?)', [title])

  const result = db.exec('SELECT id, title, completed, created_at FROM tasks WHERE id = last_insert_rowid()')
  const [id, rowTitle, completed, createdAt] = result[0].values[0]
  const row: TaskRow = {
    id: Number(id), title: String(rowTitle), completed: Number(completed), created_at: String(createdAt),
  }

  return toTask(row)
}
