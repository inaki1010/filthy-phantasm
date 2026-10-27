import { describe, expect, it } from 'vitest'
import { createDatabase } from './db'
import { createTask, listTasks } from './tasks'

describe('tasks repository', () => {
  it('creates and lists tasks newest first', async () => {
    const database = await createDatabase(':memory:')
    const { db } = database

    const first = createTask(db, 'Learn the API')
    const second = createTask(db, 'Write a test')

    expect(first.completed).toBe(false)
    expect(listTasks(db)).toEqual([second, first])
    db.close()
  })
})
