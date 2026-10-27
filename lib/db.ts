import fs from 'node:fs'
import path from 'node:path'
import initSqlJs, { type Database } from 'sql.js'

export type SqliteDatabase = Database

const schema = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`

export async function createDatabase(filename = path.join(process.cwd(), 'data', 'app.db')) {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
  })
  const db = fs.existsSync(filename) ? new SQL.Database(fs.readFileSync(filename)) : new SQL.Database()
  db.run(schema)

  const database = {
    db,
    save() {
      if (filename !== ':memory:') {
        fs.mkdirSync(path.dirname(filename), { recursive: true })
        fs.writeFileSync(filename, Buffer.from(db.export()))
      }
    },
  }

  database.save()
  return database
}

let database: ReturnType<typeof createDatabase> | undefined

export async function getDatabase() {
  database ??= createDatabase()
  return database
}
