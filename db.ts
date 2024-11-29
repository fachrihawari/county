import { Database } from 'bun:sqlite'

if (!process.env.DB_PATH) throw new Error("DB_PATH env variable is not set!")

export const db = new Database(process.env.DB_PATH, {
  strict: true
})
