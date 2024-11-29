import { Database } from 'bun:sqlite'

const dbPath = Bun.env.DB_PATH

if (!dbPath) throw new Error("DB_PATH env variable is not set!")

export const db = new Database(dbPath, {
  strict: true
})
