import { SQL } from "bun";

const dbUrl = Bun.env.DATABASE_URL

if (!dbUrl) throw new Error("DATABASE_URL env variable is not set!")

export const db = new SQL({
  url: dbUrl,
  strict: true
})
