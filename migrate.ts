import { db } from "./db";

console.log("Running migration to create table counter");
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS counter (
    id SERIAL PRIMARY KEY,
    namespace TEXT NOT NULL,
    key TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(namespace, key)
  );
`;

const createTriggerFunctionQuery = `
  CREATE OR REPLACE FUNCTION update_counter_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;

const createTriggerQuery = `
  CREATE TRIGGER update_counter_updated_at
  BEFORE UPDATE ON counter
  FOR EACH ROW
  EXECUTE FUNCTION update_counter_updated_at();
`;

await db.unsafe(createTableQuery)
console.log("Create table counter successfully");

await db.unsafe(createTriggerFunctionQuery);
console.log("Create trigger function successfully");

await db.unsafe(createTriggerQuery);
console.log("Create trigger to update updated_at successfully");