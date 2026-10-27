import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { getDatabase } from '../../lib/db'
import { createTask, listTasks, type Task } from '../../lib/tasks'

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
})

type ErrorResponse = { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[] | Task | ErrorResponse>,
) {
  const database = await getDatabase()
  const { db } = database

  if (req.method === 'GET') {
    return res.status(200).json(listTasks(db))
  }

  if (req.method === 'POST') {
    const parsed = createTaskSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' })
    }

    const task = createTask(db, parsed.data.title)
    database.save()
    return res.status(201).json(task)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
