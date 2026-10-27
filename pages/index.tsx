import { FormEvent, useEffect, useState } from 'react'
import type { Task } from '../lib/tasks'
import styles from '../styles/home.module.css'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/tasks')
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load tasks')
        setTasks(await response.json() as Task[])
      })
      .catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'Something went wrong'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })

    const payload = await response.json() as Task | { error: string }
    if (!response.ok || !('id' in payload)) {
      setError('error' in payload ? payload.error : 'Could not create task')
      return
    }

    setTasks((current) => [payload, ...current])
    setTitle('')
  }

  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>Interview starter</p>
      <h1>Task board</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="title">New task</label>
        <div className={styles.inputRow}>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Add authentication"
            maxLength={120}
          />
          <button type="submit">Add task</button>
        </div>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? <p>Loading…</p> : (
        <ul className={styles.list}>
          {tasks.length === 0 && <li className={styles.empty}>No tasks yet.</li>}
          {tasks.map((task) => <li key={task.id}>{task.title}</li>)}
        </ul>
      )}

      <p className={styles.hint}>Try: <code>npm test</code> · <code>npm run typecheck</code></p>
    </main>
  )
}
